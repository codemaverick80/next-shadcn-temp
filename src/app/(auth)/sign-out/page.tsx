"use client";
import {redirect, } from "next/navigation";

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useSession} from "@/app/SessionContext";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

export default function SignedOutPage() {

    const {session, user} = useSession();
    if (session) {
        return redirect("/dashboard");
    }

    return (
        <div className="w-full lg:grid lg:min-h-[600px] xl:min-h-[800px]">


            <div className="py-24 mx-auto max-w-[600px] space-y-6">

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Successfully Signed Out</CardTitle>
                        <CardDescription>
                            You have been successfully signed out. You can now sign in to your
                            account.
                        </CardDescription>
                    </CardHeader>

                    <CardFooter>
                        <Button className="w-full" variant="default" asChild>
                            <Link href="/sign-in">Sign In</Link>
                        </Button>
                    </CardFooter>
                </Card>


            </div>
        </div>
    );
}
