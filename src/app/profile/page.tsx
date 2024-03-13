"use client"

import ChangePasswordForm from "./ChangePassword";
import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { CredentialValidationService } from "@/validation_service/validation_service";
import PPSection from "./PPSection";

export default function Profile() {
    const { data: session, status, update } = useSession();

    const [userFetched, setUserFetched] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [errorMessages, setErrorMessage] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState("");

    const [ppURL, setPPURL] = useState("");
    const [username, setUsername] = useState<string | undefined>();
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState<Date | undefined>();
    const [emailVerified, setEmailVerified] = useState<"Yes" | "No" | undefined>();

    const onSendVerificationEmail = async () => {
        if (status !== "authenticated") return

        try {
            const headers: HeadersInit = { "userId": session.user.id }
            const response = await fetch("/api/profile/verify-email", { headers });
            const responseData = await response.json();

            if (response.ok) {
                setSuccessMessage("Verification email is sent, please check your inbox.");
                setErrorMessage([]);

            } else {
                setErrorMessage([responseData.message])
            }

        } catch (error: Error | any) {
            setErrorMessage([error.message]);
            console.error("An error occurred:", error);
        }
    }

    const onSaveChanges = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status !== "authenticated") return

        if (!email) {
            setErrorMessage(["Email field must be filled with a proper email address."]);
            return;
        }
        if (!CredentialValidationService.validateEmailFormat(email)) {
            setErrorMessage(["Email field is not in valid format."]);
            return;
        }

        try {
            const profileUpdateData = JSON.stringify({
                id: session.user.id,
                name: username,
                email,
                birthday
            } as IProfileUpdateReqData)

            const response = await fetch("/api/profile",
                {
                    method: "PATCH",
                    body: profileUpdateData,
                    headers: { "Content-Type": "application/json" }
                })

            const responseData = await response.json();
            if (response.ok) {
                setSuccessMessage(responseData.message);
                setErrorMessage([]);

                if (responseData.message === "Profile has been updated successfully but, email has not been changed.") {
                    setEmail(session.user.email); //We set to current email again.
                    
                } else if(responseData.profileUpdateRes.email !== session.user.email) { 
                    update({ //Updating the session.
                        email: responseData.profileUpdateRes.email,
                        email_verified: responseData.profileUpdateRes.email_verified
                    });
                }

            } else {
                setErrorMessage([responseData.message])
            }

        } catch (error) {
            console.log(error);
            setErrorMessage(["An unknown error occurred."])
        }

    }

    const getUserProfile = async () => {
        if (status !== "authenticated") return

        try {
            const headers: HeadersInit = { "userId": session.user.id }
            const response = await fetch("/api/profile", { headers })
            const responseData = await response.json();

            if (response.ok) {
                const userProfile: IUserProfile = responseData.userProfile as IUserProfile;
                setUsername(userProfile.username);
                setEmail(userProfile.email);
                setEmailVerified(() => session.user.email_verified ? "Yes" : "No");
                if (userProfile.imageURL) setPPURL(userProfile.imageURL);
                if (userProfile.birthday) setBirthday(new Date(userProfile.birthday as string));

                setUserFetched(true);

            } else {
                // Handle non-200 HTTP status codes
                throw Error(responseData.message);
            }

        } catch (error: Error | any) {
            setErrorMessage([error.message]);
            console.error("An error occurred:", error);
        }
    }

    useEffect(() => {
        getUserProfile();
    }, [status])

    if (!userFetched) {
        return <Loading />
    }
    else {
        return (
            <div className="min-h-screen pt-4 pb-8 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-3xl font-semibold text-center mb-4">Profile</h2>
                    {successMessage && <h4 className="text-accent-dark text-lg text-center font-semibold py-2 my-2">{successMessage}</h4>}

                    <PPSection
                        ppURL={ppURL ? ppURL : "/default_pp.jpg"}
                        setPPURL={setPPURL}
                        setSuccessMessage={setSuccessMessage} />

                    <form className="space-y-4" onSubmit={onSaveChanges}>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="username" className="text-gray-700 mb-2">Username</label>
                            <input type="text" id="username" name="username" placeholder="Enter your username" value={username} className="shadow-sm rounded-md border px-4 py-2 focus:ring-accent-light focus:border-accent"
                                onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="email" className="text-gray-700 mb-2">Email</label>
                            <input type="text" id="email" name="email" placeholder="example@mail.com" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="shadow-sm rounded-md border px-4 py-2 focus:ring-accent-light focus:border-accent" />
                        </div>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="birthday" className="text-gray-700 mb-2">Birthday</label>
                            <input
                                type="date"
                                id="birthday"
                                name="birthday"
                                value={birthday ? birthday.toISOString().split('T')[0] : ''}
                                onChange={(e) => setBirthday(new Date(e.target.value))}
                                className="shadow-sm rounded-md border px-4 py-2 focus:ring-accent-light focus:border-accent"
                            />                        </div>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="email-verified" className="text-gray-700 mb-2">Email Verified</label>
                            <div className="flex justify-between gap-4">
                                <p className="shadow-sm rounded-md border w-32 px-4 py-2 bg-[rgb(255,255,255)] focus:ring-accent-light focus:border-accent">{emailVerified}</p>
                                {!session?.user.email_verified &&
                                    <button type="button" onClick={onSendVerificationEmail}
                                        className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-2 px-4 rounded-md transition duration-300">
                                        Send Verification Email
                                    </button>}
                            </div>
                        </div>

                        {errorMessages.length > 0 && <ErrorMessage errorMessages={errorMessages} />}

                        <div>
                            <button type="submit" className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-2 px-4 rounded-md transition duration-300">Save Changes</button>
                        </div>
                    </form>
                    <hr className="my-6" />
                    <h3 className="text-xl font-semibold mb-4 cursor-pointer inline-block" onClick={() => setIsChangePasswordOpen((prev) => !prev)}>
                        Change Password
                        <span className={`ml-1 ${!isChangePasswordOpen ? 'transform rotate-180' : ''} inline-block`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </h3>
                    {isChangePasswordOpen && <ChangePasswordForm />}
                </div>
            </div>
        );

    }



}
