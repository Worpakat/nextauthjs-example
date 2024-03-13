import ErrorMessage from "@/components/ErrorMessage";
import { CredentialValidationService } from "@/validation_service/validation_service";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

const ChangePasswordForm = () => {
    const { data: session } = useSession();

    const [errorMessages, setErrorMessage] = useState<string[]>([]);
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPasword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!CredentialValidationService.validatePasswordFields(newPassword, confirmPassword, setErrorMessage, oldPassword)) return;

        try {
            if (!session) return;

            const changePasswordData = JSON.stringify({
                id: session.user.id,
                oldPassword,
                newPassword,
                confirmPassword
            });

            const response = await fetch("/api/profile/change-password",
                {
                    method: "PATCH",
                    body: changePasswordData,
                    headers: { "Content-Type": "application/json" }
                })

            const responseData = await response.json();
            if (response.ok) {
                setIsPasswordChanged(true);
                setErrorMessage([])
            } else {
                setErrorMessage([responseData.message])
            }

        } catch (error) {
            console.log(error);
            setErrorMessage(["An unknown error occurred."])
        }
    }

    return (
        <div>

            {isPasswordChanged && <h4 className="text-accent-dark text-lg self-start font-semibold py-2 mt-2">Password successfully changed!</h4>}

            <form onSubmit={handleSubmit} className="space-y-4 transition duration-300 ease-in-out over">
                <div className="flex flex-col mb-4">
                    <label htmlFor="old-password" className="text-gray-700 mb-2">Old Password</label>
                    <input type="password" id="old-password" name="old-password" placeholder="Enter old password" value={oldPassword} className="shadow-sm rounded-md border px-4 py-2 focus:ring-accent-light focus:border-accent"
                        onChange={(e) => setOldPassword(e.target.value)} />
                </div>
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
        </div>

    );
};

export default ChangePasswordForm;