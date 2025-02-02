"use client"

import { useState } from "react"
import { przDepositBot, suPrzUSDC } from "@/utils/constants/addresses"
import { allowanceUSD } from "@/utils/deposit/allowance"
import { parseUnits } from "viem"
import { PaymasterMode } from "@biconomy/account"
import { approveLifeTimeSwim } from "@/utils/deposit/approve"
import { deposit } from "@/utils/deposit/deposit"
import { useBiconomy } from "@/providers/BiconomyContext"
import { hook } from "@/utils/deposit/hook"
import { usePostDeposit } from "./usePostDeposit"
import { toast } from "@/components/ui/use-toast"

export const usePoolDeposit = () => {
    

    const [loading, setLoading] = useState<boolean>(false)
    const { smartAccount } = useBiconomy()
    const { postDeposit } = usePostDeposit()

    async function giveMeFailedToast(): Promise<void> {
        return new Promise((resolve) => {
            toast({
                title: "Deposit Failed, Try again!",
                description: "Something went wrong, no missing deposits!!",
                variant: "destructive"
            });
    
            // Set a timeout of six seconds (6000 milliseconds)
            setTimeout(() => {
                resolve();
            }, 3666);
        });
    }

    const poolDeposit = async (amountDollar: string, smartAccountAddress: `0x${string}`) => {
        
        try {
            setLoading(true)
            const amountParsed = parseUnits(amountDollar!, 6)
            const allowance_ = await allowanceUSD(smartAccountAddress, suPrzUSDC)
            let userOpResponse
            let txnHash
            if (amountParsed < allowance_ || allowance_ == BigInt(0)) {
                // send two
                const tx = []
                const tx1 = approveLifeTimeSwim(suPrzUSDC)
                tx.push(tx1)
                const tx2 = deposit(amountParsed, smartAccountAddress)
                tx.push(tx2)
                // Send the transaction and get the transaction hash
                userOpResponse = await smartAccount!.sendTransaction(tx, {
                    paymasterServiceData: {mode: PaymasterMode.SPONSORED},
                });
                const { transactionHash } = await userOpResponse.waitForTxHash();
                console.log("Transaction Hash", transactionHash);
                txnHash = transactionHash
    
            }else {
                // send one
                const tx = deposit(amountParsed, smartAccountAddress)
                // Send the transaction and get the transaction hash
                userOpResponse = await smartAccount!.sendTransaction(tx, {
                    paymasterServiceData: {mode: PaymasterMode.SPONSORED},
                });
                const { transactionHash } = await userOpResponse.waitForTxHash();
                console.log("Transaction Hash", transactionHash);
                txnHash = transactionHash
    
            }
    
            
            const userOpReceipt  = await userOpResponse?.wait();
            if(userOpReceipt?.success == "true") { 
                console.log("UserOp receipt", userOpReceipt)
                console.log("Transaction receipt", userOpReceipt?.receipt)
                await postDeposit(
                    smartAccountAddress,
                    smartAccountAddress,
                    txnHash!,
                    amountDollar,
                    "deposit"
                )
                setLoading(false)
                return txnHash 
            }
            
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
        
        
    }
    const poolApproveHook = async () => {
        
        try {
            setLoading(true)
            let tx = []
            const approveTx = approveLifeTimeSwim(przDepositBot)
            tx.push(approveTx)
            const hookTx = hook()
            tx.push(hookTx)


            // Send the transaction and get the transaction hash
            const userOpResponse = await smartAccount!.sendTransaction(tx, {
                paymasterServiceData: {mode: PaymasterMode.SPONSORED},
            });
            const { transactionHash } = await userOpResponse.waitForTxHash();
            console.log("Transaction Hash", transactionHash);
    
            
            const userOpReceipt  = await userOpResponse?.wait();
            if(userOpReceipt?.success == "true") { 
                console.log("UserOp receipt", userOpReceipt)
                console.log("Transaction receipt", userOpReceipt?.receipt)
                setLoading(false)
                return transactionHash 
            } else {
                giveMeFailedToast()
            }
            
        } catch (error) {
            console.log("error in approve hook by ai agent", error)
            setLoading(false)
            return error

        }
        
        
    }
    
    return { loading, poolDeposit, poolApproveHook }
}