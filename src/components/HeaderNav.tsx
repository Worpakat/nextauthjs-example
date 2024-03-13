"use client"

import { useSession } from "next-auth/react";
import Link from "next/link";
import SignoutBtn from "./SignoutBtn";
import Image from "next/image";

const HeaderNav = () => {
    const { data: session } = useSession();

    if (session) {
        const profileImageSrc = session.user.imageURL ? session.user.imageURL : '/default_pp.jpg'
        return (
            <nav>
                <Link href="/profile" className="text-accent-dark hover:text-accent px-3 py-2">
                    <Image
                        src={profileImageSrc}
                        alt="P.Photo"
                        width={36}
                        height={36}
                        className='rounded-full object-cover inline-block mr-2'/>
                    Profile
                </Link>
                <Link href="/admin" className="text-accent-dark hover:text-accent px-3 py-2">Administration</Link>
                <SignoutBtn />
            </nav>
        );
    }

    return (
        <nav className="space-x-4">
            <Link href="/signin" className="text-accent-dark hover:text-accent px-3 py-2">Signin</Link>
            <Link href="/signup" className="text-accent-dark hover:text-accent px-3 py-2">Signup</Link>
        </nav>
    );
}

export default HeaderNav