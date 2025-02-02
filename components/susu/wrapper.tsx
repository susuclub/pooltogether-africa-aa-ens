"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Authorized } from "./authorized";
import { Unauthorized } from "./unauthorized";

export function Wrapper() {
    
    const { ready, authenticated } = usePrivy()

    return (
        <>
            {
                !ready 
                ?(
                    <>
                        <main className="flex min-h-screen flex-col items-center justify-between p-24">
                            <p>loading....</p>
                        </main>
                    </>
                )
                :(
                    authenticated
                    ? <Authorized/>
                    : <Unauthorized/>
                )
            }
        </>
    )
}