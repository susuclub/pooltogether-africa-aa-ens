
import { Wrapper } from "@/components/susu/wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "susu club",
    description: "get a susu box, save & win prizes",
};

export default async function Susu() {
    return (
        <>
            <Wrapper/>
        </>
    )
}