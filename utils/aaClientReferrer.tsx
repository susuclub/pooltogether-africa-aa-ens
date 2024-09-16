"use server"


//import { BiconomySmartAccountV2, createSmartAccountClient, PaymasterMode } from "@biconomy/account";
import { walletClient } from "./clientReferrer";
import { claimInvite } from "./refs/claimInvite";


export async function createSmartAccountClaimInvite (referrer: `0x${string}`, invited: `0x${string}`) {
    try {
        //AA SA config
        /*
        if (!walletClient) return;
        
        const smartAccountFromCreate = await createSmartAccountClient({
            signer: walletClient,
            bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL, // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
            biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY, // <-- Read about at https://docs.biconomy.io/dashboard/paymaster
        });
    
        const address = await smartAccountFromCreate.getAccountAddress();
        
        console.log('smart account wallet:', address)

        const tx = claimInvite(referrer, invited)
        

        // Send the transaction and get the transaction hash
        const userOpResponse = await smartAccountFromCreate!.sendTransaction(tx, {
            paymasterServiceData: {mode: PaymasterMode.SPONSORED},
        });
        const { transactionHash } = await userOpResponse.waitForTxHash();
        console.log("Transaction Hash", transactionHash);
        
        const userOpReceipt  = await userOpResponse?.wait();
        if(userOpReceipt?.success == 'true') { 
            console.log("UserOp receipt", userOpReceipt)
            console.log("Transaction receipt", userOpReceipt?.receipt)
            return transactionHash
        }
        return address
        */
       //EOA config
        const tx = claimInvite(referrer, invited)
        const hash = await walletClient.sendTransaction(tx)
        console.log(hash)
        return hash
        
    } catch (error) {
        console.log(error)
    }
};