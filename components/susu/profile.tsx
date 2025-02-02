import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pooler } from "@/hooks/pooler/useGetPooler"
import { FaceIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { usePostPooler } from "@/hooks/pooler/usePostPooler"
import { usePrivy } from "@privy-io/react-auth"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"
import { normalize } from "viem/ens"
import { usePoolDeposit } from "@/hooks/deposit/usePoolDeposit"
import { Label } from "../ui/label"
import { motion } from "framer-motion";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { usePlausible } from "next-plausible"





interface ProfileProps {
    pooler: Pooler | null
    smartAccountAddress: string
    getBackPooler: () => void
}
const FormSchema = z.object({
    susuTag: z.string().min(1),
    
})

const emailSchema = z.string().email();



export function Profile ({ pooler, smartAccountAddress, getBackPooler } : ProfileProps) {
    const { postPooler } = usePostPooler()
    const { poolApproveHook } = usePoolDeposit()
    const { user } = usePrivy()
    const plausible = usePlausible()

    console.log(user?.linkedAccounts)
    const linkedIndexAccount = user?.linkedAccounts[0]!
     
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean | null>(null)

    const [email, setEmail] = useState<string | null>(null)
    const [isValidEmail, setIsValidEmail] = useState(true);
    
    console.log(smartAccountAddress)

    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            //email: undefined,
            susuTag: undefined,
        },
    })

    const { setValue } = form


    const handleSusuTagChange = (e: any) => {
        try {
            (e.target.value.length >= 1)
            ? setValue("susuTag", normalize(e.target.value))
            : setValue("susuTag", (e.target.value))
        } catch (error : any) {
            console.log(error.message)
        }
    }
    const susu = form.watch("susuTag")
    console.log(susu)
    
    const handleEmailChange = (e: any) => {

        const inputEmail = e.target.value;
        setEmail(inputEmail)

    }

    
    

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        
        setLoading(true)
        const getEmail = () => {
            if (linkedIndexAccount.type === "wallet") {
                return email
            } else if (linkedIndexAccount.type === "email") {
                return user?.email?.address
            }
            
        }
        try {
            console.log({ data });
            const email = getEmail()
            console.log(email)
            // Zod email validation
            const result = emailSchema.safeParse(email);
            setIsValidEmail(result.success);
            if (!pooler && email && data.susuTag && result.success == true) {
                
                const approve = await poolApproveHook()
                console.log("error in approve hook by ai agent", approve)
                //debug w/israel
                console.log(approve)

                await postPooler(
                    smartAccountAddress!,
                    email!,
                    data.susuTag,
                )
                getBackPooler()
                plausible("saveProfile")
                setLoading(false)
            } else {
                //update
            }
        } catch (error) {
            console.log(error)
            
        }
        setLoading(false)
    }
    useEffect(()=>{
        if (pooler && !loading) {
            setOpen(false)
        }
    }, [pooler, loading])
    return (
        <>
            <Drawer
                open={open}
                onOpenChange={setOpen}
                onClose={()=>{
                    //
                }}
            >
                <DrawerTrigger asChild>
                    <Button 
                        className="gap-2" 
                        variant="outline"
                        onClick={()=>{
                            setOpen(true)
                        }}
                    >
                        <FaceIcon/>
                        <span className="max-md:hidden">Edit Profile</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Edit profile</DrawerTitle>
                            <DrawerDescription>Make changes to your profile here. Click save when done.</DrawerDescription>
                        </DrawerHeader>
                        <div className="flex flex-col p-4">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    
                                    {
                                        linkedIndexAccount.type === "wallet" && (
                                            <>
                                                <div className="flex w-full max-w-sm items-center space-x-2">
                                                    <Label className={`text-right ${!isValidEmail && "text-red-500"}`}>Email</Label>
                                                    <Input 
                                                        disabled={!!pooler} 
                                                        className="col-span-3" 
                                                        placeholder={!pooler ? "pooler@susu.club" : pooler.email} 
                                                        onChange={handleEmailChange}  />    
                                                </div>
                                            </>
                                        )
                                    }
                                    <FormField
                                        control={form.control}
                                        name="susuTag"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex w-full max-w-sm items-center space-x-2">
                                                    <FormLabel className="text-right">Username</FormLabel>
                                                    <FormControl >
                                                        <Input disabled={!!pooler || loading!} className="col-span-3" placeholder={!pooler ? "vitalik" : pooler.ens} {...field} onChange={handleSusuTagChange}/>
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    
                            
                                    <div className="flex justify-end">
                                        <Button
                                            className="w-36"
                                            disabled={!!pooler || loading!}
                                            type="submit"
                                        >
                                            {
                                                loading
                                                ? (
                                                    <>
                                                        <motion.div
                                                        initial={{ rotate: 0 }} // Initial rotation value (0 degrees)
                                                        animate={{ rotate: 360 }} // Final rotation value (360 degrees)
                                                        transition={{
                                                            duration: 1, // Animation duration in seconds
                                                            repeat: Infinity, // Infinity will make it rotate indefinitely
                                                            ease: "linear", // Animation easing function (linear makes it constant speed)
                                                        }}
                                                    >
                                                            <DotsHorizontalIcon/>
                                                        </motion.div>
                                                    </>
                                                )
                                                : (
                                                    <>
                                                        Save changes
                                                    </>
                                                )
                                            }
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )

}