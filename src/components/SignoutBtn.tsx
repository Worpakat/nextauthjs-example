"use client"

import { signOut } from 'next-auth/react'
import React from 'react'

const SignoutBtn = () => {
    const onSignout = () => {
        signOut({ redirect: true })
    }
    return (
        <button className="text-accent-dark hover:text-accent px-3 py-2" onClick={onSignout}>Signout</button>
    )
}

export default SignoutBtn