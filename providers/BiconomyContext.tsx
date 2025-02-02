"use client"


import { BiconomySmartAccountV2, createSmartAccountClient } from "@biconomy/account"
import type { ReactNode } from "react"
import React, { useContext, useEffect, useState } from "react"
import { WalletClient } from "viem"
import { base } from "viem/chains"
import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom } from "viem";


type Props = {
    children: ReactNode,
}

interface BiconomyInterface {
    smartAccount?: BiconomySmartAccountV2;
    smartAccountAddress?: string;
};

const Biconomy = React.createContext<BiconomyInterface>({
    smartAccount: undefined,
    smartAccountAddress: undefined
});

export function useBiconomy () {
    return useContext(Biconomy);
};

export function BiconomyContext ({ children }: Props) {
    const [ smartAccount, setSmartAccount ] = useState<BiconomySmartAccountV2 | undefined>()
    const [ smartAccountAddress, setSmartAccountAddress ] = useState<string | undefined>()
    const [ embeddedWallet, setEmbeddedWallet ] = useState<ConnectedWallet | undefined>()

    const { wallets } = useWallets();
    const { user, ready, authenticated } = usePrivy();

    // make sure connected walltet == privy user before setting embed
    useEffect(() => {
        const connectedWalletBase = wallets[0]
        const connectedWalletPrivy = wallets.find((wallet) => (wallet.walletClientType === "privy"));
        const connectedUserWallet = user?.wallet
        if (connectedWalletBase?.walletClientType === connectedUserWallet?.walletClientType) {
            setEmbeddedWallet(connectedWalletPrivy)
        }
    }, [ wallets, user ]);
    
    const getWalletClient = async () => {
        
        // Switch your wallet to your target chain before getting the viem WalletClient
        await embeddedWallet?.switchChain(base.id)

        // Get an EIP1193 provider from the user"s wallet
        const ethereumProvider = await embeddedWallet?.getEthereumProvider()

        // Create a Viem wallet client from the EIP1193 provider
        const walletClient = createWalletClient({
            account: embeddedWallet?.address as `0x${string}`,
            chain: base,
            transport: custom(ethereumProvider!)
        })
        return walletClient as WalletClient;
    }

    const createSmartAccount = async (walletClient: WalletClient) => {
        if (!walletClient) return;

        const smartAccount = await createSmartAccountClient({
            signer: walletClient,
            bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL, // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
            biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY, // <-- Read about at https://docs.biconomy.io/dashboard/paymaster
            rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
        });
      
        const address = await smartAccount.getAccountAddress();
        setSmartAccountAddress(address);
        setSmartAccount(smartAccount);
    };

    const readyOrNot = async () => {
        //logout smart account        
        if (ready && !authenticated){
            setSmartAccountAddress(undefined);
            setSmartAccount(undefined);   
            setEmbeddedWallet(undefined);
        }
        
        //not ready or not logged in
        if (!ready || !authenticated) return;

        //find privy signer & create/login smart account
        if (!embeddedWallet) return; 
        const walletClient = await getWalletClient()
        if (embeddedWallet && !smartAccount) createSmartAccount(walletClient);
    }
    useEffect(() => {
        readyOrNot()
    }, [ wallets, ready, authenticated, embeddedWallet ]);

    return (
        <>
            <Biconomy.Provider value={{smartAccount: smartAccount, smartAccountAddress: smartAccountAddress}}>{children}</Biconomy.Provider>
        </>
    )
}