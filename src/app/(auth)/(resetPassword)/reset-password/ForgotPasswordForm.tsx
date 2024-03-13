"use client"

import ErrorMessage from '@/components/ErrorMessage';
import { ValidationFailureTypes } from '@/validation_service/failures';
import { CredentialValidationService } from '@/validation_service/validation_service';
import { useSearchParams } from 'next/navigation';
import React, { FormEvent, useState } from 'react'

const ResetPasswordForm = () => {
    const searchParams = useSearchParams()

    const [errorMessages, setErrorMessage] = useState<string[]>([]);
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);

    const [newPassword, setNewPasword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = searchParams.get("token");
        if (!token) {
            setErrorMessage(["Reset password link is invalid, please try to click link again or send a new reset password email."]);
            return;
        }

        if (!CredentialValidationService.validatePasswordFields(newPassword, confirmPassword, setErrorMessage)) return;

        try {
            const resetPasswordData = JSON.stringify({
                token,
                newPassword
            });
            const response = await fetch("/api/reset-password",
                {
                    method: "PATCH",
                    body: resetPasswordData,
                    headers: { "Content-Type": "application/json" }
                });
            const responseData = await response.json();

            if (response.ok) {
                setIsPasswordChanged(true);
                setErrorMessage([]);

            } else {
                console.log(responseData);

                switch (responseData.message) {
                    case ValidationFailureTypes.EMPTY_FIELD:
                        setErrorMessage(["All fields must be filled."]);
                        break;

                    case ValidationFailureTypes.PASS_REQUIREMENT:
                        setErrorMessage([
                            "Your password doesn't meet the requirements yet:",
                            " -It must be at least 8 characters long.",
                            " -It needs to include a mix of uppercase letters (A-Z), lowercase letters (a-z) numbers (0-9), and symbols (!@#$%^&*).",
                            " -It needs to include at least one number(0-9) and one symbol(!@#$%^&* etc.)",
                        ]);
                        break;

                    default:
                        setErrorMessage([responseData.message]);
                        break;
                }
            }

        } catch (error) {
            console.log(error);
            setErrorMessage(["An unknown error occurred."])
        }
    }

    return (

        <form onSubmit={handleSubmit} className="space-y-4 transition duration-300 ease-in-out over">

            {isPasswordChanged && <h4 className="text-accent-dark text-lg self-start font-semibold py-2 mt-2">Password has been successfully reset.</h4>}

            <div className="flex flex-col mb-4">
                <label htmlFor="new-password" className="text-gray-700 mb-2">New Password</label>
                <input type="password" id="new-password" name="new-password" placeholder="Enter new password" value={newPassword} className="shadow-sm rounded-md border px-4 py-2 focus:ring-accent-light focus:border-accent"
                    onChange={(e) => setNewPasword(e.target.value)} />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="confirm-password" className="text-gray-700 mb-2">Confirm Password</label>
                <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm new password" value={confirmPassword} className="shadow-sm rounded-md border px-4 py-2 focus:ring-accent-light focus:border-accent"
                    onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            {errorMessages.length > 0 && <ErrorMessage errorMessages={errorMessages} />}

            <div>
                <button type="submit" className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-2 px-4 rounded-md transition duration-300">Change Password</button>
            </div>
        </form>
    )
}

export default ResetPasswordForm