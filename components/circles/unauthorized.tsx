"use client"; 


import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function Unauthorized() {
    const router = useRouter()
     
    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <Alert className="w-108">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Login First!</AlertTitle>
                    <AlertDescription>
                        You cannot view the Susu account without being Logged in.
                    </AlertDescription>
                </Alert>
                <Button
                    onClick={()=>{
                        router.push("/")
                    }}
                >
                    Go to Home
                </Button>
            </main>
        </>
    )
}