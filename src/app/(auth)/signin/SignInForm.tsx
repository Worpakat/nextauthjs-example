"use client"

import ErrorMessage from '@/components/ErrorMessage';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEvent, useState } from 'react'

const SignInForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessages, setErrorMessage] = useState<string[]>([]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let callbackUrl = searchParams.get("callbackUrl") as string ;
        console.log(callbackUrl);
        

        const authResult = await signIn("credentials", {
            email, password, redirect: false
            //'redirect'=false prevents callback method and code is continued executing and it redirects to home page.
        });

        if (authResult?.ok) {
            if(callbackUrl){
                router.replace(callbackUrl)
                return
            }

            router.replace("/");
        }
        else {
            setErrorMessage(["Credentials are invalid."]);
            (e.target as HTMLFormElement).reset();
        }
    }


    return (
        <form onSubmit={handleSubmit} action="/signin">
            <div className="flex flex-col mb-4">
                <label htmlFor="email" className="text-gray-700 mb-2">Email</label>
                <input type="text" id="email" name="email" placeholder="example@mail.com" className="shadow-sm rounded-md border px-4 py-2 focus:ring-accent-light focus:border-accent"
                    onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col mb-4">
                <div className="mb-2 flex justify-between">
                    <label htmlFor="password" className="text-gray-700">Password</label>
                    <Link href={"/forgot-password"} className="text-sm italic underline underline-offset-1">Forgot password?</Link>
                </div>
                <input type="password" id="password" name="password" className="shadow-sm rounded-md border px-4 py-2 focus:ring-accent-light focus:border-accent"
                    onChange={(e) => setPassword(e.target.value)} />
            </div>

            {errorMessages.length > 0 && <ErrorMessage errorMessages={errorMessages} />}

            <button type="submit" className="bg-accent hover:bg-accent-dark text-white py-2 px-4 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-accent">Sign In</button>
        </form>
    )
}

export default SignInForm