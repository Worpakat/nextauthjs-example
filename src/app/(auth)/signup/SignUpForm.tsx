"use client"

import ErrorMessage from '@/components/ErrorMessage';
import { ValidationFailureTypes } from '@/validation_service/failures';
import { CredentialValidationService } from '@/validation_service/validation_service';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react'

const SignUpForm = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessages, setErrorMessage] = useState<string[]>([]);


    const validateFields = (): boolean => {
        //Check if fields filled.
        if (!email || !password || !confirmPassword) {
            setErrorMessage(["All fields must be filled."]);
            return false;
        }
        //Check email format
        if (!CredentialValidationService.validateEmailFormat(email)) {
            setErrorMessage(["Email field is not in valid format."]);
            return false;
        }
        //Check do passwords match.
        if (!CredentialValidationService.isPasswordsMatches(password, confirmPassword)) {
            setErrorMessage(["Passwords doesn't match."]);
            return false;
        }
        //Check password requirements are met.
        if (!CredentialValidationService.validatePasswordRequirements(password)) {
            setErrorMessage([
                "Your password doesn't meet the requirements yet:",
                " -It must be at least 8 characters long.",
                " -It needs to include a mix of uppercase letters (A-Z), lowercase letters (a-z) numbers (0-9), and symbols (!@#$%^&*).",
                " -It needs to include at least one number(0-9) and one symbol(!@#$%^&* etc.)",
            ]);
            return false;
        }

        return true;
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateFields()) return;
        //Front-End validation is okey.

        try {
            const credentials = JSON.stringify({ email, password });
            const response = await fetch("/api/signup", {
                method: "POST",
                body: credentials,
                headers: { "Content-Type": "application/json" }
            })
            const responseData = await response.json();

            //Server error handling.
            if (response.status === 500) {
                throw ("A server error occurred, please try again later.")
            }

            //Server failure detection hadnling.
            if (responseData.result === "failure") {
                //Front-end email exists failure displaying.
                if (responseData.message === ValidationFailureTypes.EMAIL_EXIST) {
                    setErrorMessage(["This email has been already used. Try another one."])
                }

                logServerValidationError(responseData.failureType);
                return;
            }
            //result= "success"

            //Signin user.
            const authResult = await signIn("credentials", {
                email, password, redirect: false
                //'redirect'=false prevents callback method and code is continued executing and it redirects to home page.
            });

            if (authResult?.ok) {
                //Send verification email.
                const headers: HeadersInit = { "userId": responseData.userId }
                fetch("/api/profile/verify-email", { headers });
                //We don't wait for result.

                router.replace("/?mailSent=true");
            }
            else {
                setErrorMessage(["You could not be signed in. Try signin from 'Signin' page."]);
                (e.target as HTMLFormElement).reset();
            }
            
        } catch (error: any) {
            console.log(error);
            setErrorMessage(["An error ocurred:", error.message])
        }

    }


    return (
        <form onSubmit={handleSubmit} method="post">
            <div className="flex flex-col mb-4">
                <label htmlFor="email" className="text-gray-700 mb-2">Email</label>
                <input type="input" id="email" name="email" placeholder="example@mail.com" className="shadow-sm rounded-md border px-4 py-2 focus:ring-accent-light focus:border-accent"
                    onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="password" className="text-gray-700 mb-2">Password</label>
                <input type="password" id="password" name="password" className="shadow-sm rounded-md border px-4 py-2 focus:ring-accent-light focus:border-accent"
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="passwordConfirmation" className="text-gray-700 mb-2">Confirm Password</label>
                <input type="password" id="passwordConfirmation" name="passwordConfirmation" className="shadow-sm rounded-md border px-4 py-2 focus:ring-accent-light focus:border-accent"
                    onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            {errorMessages.length > 0 && <ErrorMessage errorMessages={errorMessages} />}

            <button type="submit" className="bg-accent hover:bg-accent-dark text-white py-2 px-4 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-accent">Sign Up</button>
        </form>
    )
}

export default SignUpForm

//UTIL FUNCTION
/**Because we already have a frontend validation check and display that, no need to extra UI displaying.
 * Console logging is enough.
 */
const logServerValidationError = (failureType: ValidationFailureTypes) => {
    switch (failureType) {
        case ValidationFailureTypes.EMPTY_FIELD:
            console.log("All fields must be filled.");
            break;

        case ValidationFailureTypes.CREDENTIAL_TYPE:
            console.log("Some credential(s) type is(are) wrong.");
            break;

        case ValidationFailureTypes.EMAIL_FORMAT:
            console.log("Email field is not in valid format.");
            break;

        case ValidationFailureTypes.PASS_REQUIREMENT:
            console.log("Your password doesn't meet the requirements yet:", [
                " -It must be at least 8 characters long.",
                " -It needs to include a mix of uppercase letters (A-Z), lowercase letters (a-z) numbers (0-9), and symbols (!@#$%^&*).",
                " -It needs to include at least one number(0-9) and one symbol(!@#$%^&* etc.)",
            ]);
            break;

        case ValidationFailureTypes.EMAIL_EXIST:
            console.log("This email has been already used. Try another one.");
            break;

        default:
            console.log("An unknown error ocurred");
            break;
    }
}