"use client"

import { useSession } from "next-auth/react";

const UserWelcome = () => {
    const { data: session } = useSession();

    if (session) {
        return (
            <h2 className="text-lg">Welcome <span className=" font-semibold italic">{session.user.email}</span> You are signed in succesfully.</h2>
        )
    }
}

export default UserWelcome