"use client"

import ErrorMessage from '@/components/ErrorMessage';
import { CredentialValidationService } from '@/validation_service/validation_service';
import React, { FormEvent, useState } from 'react'

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [errorMessages, setErrorMessage] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            setErrorMessage(["Email field must be filled with a proper email address."]);
            return;
        }
        if (!CredentialValidationService.validateEmailFormat(email)) {
            setErrorMessage(["Email field is not in valid format."]);
            return;
        }

        try {
            const emailData = JSON.stringify({ email })

            const response = await fetch("/api/reset-password",
                {
                    method: "POST",
                    body: emailData,
                    headers: { "Content-Type": "application/json" }
                })

            const responseData = await response.json();
            if (response.ok) {
                setSuccessMessage("Password reset email has been sent successfully.");
                setErrorMessage([]);
            } else {
                setErrorMessage([responseData.message])
            }

        } catch (error) {
            console.log(error);
            setErrorMessage(["An unknown error occurred."])
        }

    }

    return (
        <form onSubmit={handleSubmit} method="post">

            <input type="text" id="email" name="email" placeholder="example@mail.com"
                className="shadow-sm rounded-md border px-4 py-2 mb-4 w-full focus:ring-accent-light focus:border-accent"
                onChange={(e) => setEmail(e.target.value)} />

            {errorMessages.length > 0 && <ErrorMessage errorMessages={errorMessages} />}
            {successMessage && <h4 className="text-accent-dark text-lg self-start font-semibold py-2 mb-2">{successMessage}</h4>}

            <button type="submit"
                className="bg-accent hover:bg-accent-dark text-white w-full py-2 px-4 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                Send Reset Password Email</button>
        </form>
    )
}

export default ForgotPasswordForm