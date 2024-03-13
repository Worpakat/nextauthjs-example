"use client"

import { useSession } from "next-auth/react";
import { tree } from "next/dist/build/templates/app-page";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
    const searchParams = useSearchParams()
    const { data: session, update } = useSession();

    const [notification, setNotification] = useState("Please wait a moment, verification completing...")
    
    const [isSessionUpdated, setIsSessionUpdated] = useState(false);
    // This is used to prevent to invoke requestForVerification again after update() method. 
    //Because it updates the session and triggers useEffect again. 

    const requestForVerification = async () => {
        try {
            if (!session) return;

            const token = searchParams.get('token');
            if (!token) {
                setNotification("Link is broken, please click again the verification link from your email.")
                return;
            }
            const tokenData = JSON.stringify({ token });

            const response = await fetch("/api/profile/verify-email",
                {
                    method: "PATCH",
                    body: tokenData,
                    headers: { "Content-Type": "application/json" }
                })

            const responseData = await response.json();

            if (response.ok) {
                setNotification("Your email is verified succesfully. You can leave from this page.");
                update({ email_verified: true });
                setIsSessionUpdated(true);
                
            } else {
                setNotification("An error occurred: " + responseData.message);
            }

        } catch (error) {
            setNotification("An error occurred, please check your browser console.");
            console.log(error);
        }
    }


    useEffect(() => {
        if(isSessionUpdated) return;

        requestForVerification();
    }, [session])


    return (
        <div>

            <h3 className="m-4 text-accent-dark text-2xl font-semibold">{notification}</h3>

        </div>
    );

}


