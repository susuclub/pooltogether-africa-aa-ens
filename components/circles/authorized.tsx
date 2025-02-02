"use client";

import { useBiconomy } from "@/providers/BiconomyContext"
import { useRouter } from "next/navigation";
import { useGetPooler } from "@/hooks/pooler/useGetPooler";
import Image from "next/image";
import { Logout } from "../logout";





export function Authorized() {
    const router = useRouter() 
    const { smartAccount, smartAccountAddress } = useBiconomy()
    const { pooler, loading, getBackPooler } = useGetPooler( smartAccountAddress! )
    
    
    return (
        <main className="flex min-h-screen flex-col items-center gap-8 p-24 max-md:p-6 bg-white">
            <div className="flex w-full items-center justify-between">
                <div className="flex text-center">
                    <Image
                        src="/logo.png"
                        alt=""
                        width={36}
                        height={36}
                    />
                    <p className="text-2xl font-bold whitespace-nowrap max-sm:hidden">susu club</p>
                </div>
                <div className="flex gap-3">
                    {
                        pooler && (
                            <>
                                {/** <Withdraw pooler={pooler!} smartAccountAddress={smartAccountAddress! as `0x${string}`} balance={formatedBalance!}/> */}
                            </>
                        )
                    }
                    {/**<Profile pooler={pooler} smartAccountAddress={smartAccountAddress!} getBackPooler={getBackPooler}/> */}
                    <Logout/>
                </div>
            </div>

        </main>    
    )
}