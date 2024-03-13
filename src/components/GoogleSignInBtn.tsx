"use client"
import { signIn } from "next-auth/react";
import Image from "next/image";

const GoogleSignInBtn = () => {

    return (
        <button onClick={() => signIn("google")}
            className="w-full rounded-md border-2 border-slate-200 px-4 py-2 flex items-center gap-8">
            <Image
                width={50}
                height={50}
                src={"/google_icon.png"}
                alt='Google Icon'
                className='object-cover' />
            <span>Sign in with Google</span>
        </button>
    );
}

export default GoogleSignInBtn