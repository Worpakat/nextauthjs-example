import Link from 'next/link'
import React from 'react'
import SignoutBtn from './SignoutBtn'
import { options } from '@/app/api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'
import HeaderNav from './HeaderNav'

const Header = async () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-10 bg-primary shadow-md py-4">
            <div className="container max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="text-accent-dark font-bold text-2xl hover:text-accent">NextAuthExample</Link>
                <HeaderNav/>
            </div>
        </header>

    )
}

export default Header