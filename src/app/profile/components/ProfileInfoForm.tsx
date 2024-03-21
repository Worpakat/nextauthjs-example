"use client";

import ErrorMessage from "@/components/ErrorMessage";
import { CredentialValidationService } from "@/validation_service/validation_service";
import { useSession } from "next-auth/react";
import { FormEvent, useContext, useState } from "react";
import { ISuccessContext, SuccessContext } from "./SuccessContextWrapper";

interface IProfileInfoFormProps {
    _username: string | undefined
    _email: string
    _emailVerified: "Yes" | "No"
    _birthday: Date | undefined,
}

const ProfileInfoForm = ({ 
    _username,
    _email,
    _emailVerified,
    _birthday }: IProfileInfoFormProps) => {

    const { data: session, status, update } = useSession();

    const { setSuccessMessage } = useContext(SuccessContext) as ISuccessContext;
    const [errorMessages, setErrorMessage] = useState<string[]>([]);
    const [username, setUsername] = useState<string | undefined>(_username);
    const [email, setEmail] = useState(_email);
    const [birthday, setBirthday] = useState<Date | undefined>(_birthday);

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

                } else if (responseData.profileUpdateRes.email !== session.user.email) {
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

    return (
        <div>
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
                        <p className="shadow-sm rounded-md border w-32 px-4 py-2 bg-[rgb(255,255,255)] focus:ring-accent-light focus:border-accent">{_emailVerified}</p>
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

        </div>

    );
};

export default ProfileInfoForm;