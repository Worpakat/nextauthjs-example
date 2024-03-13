import { redirect } from "next/navigation";
import ResetPasswordForm from "./ForgotPasswordForm";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export default async function ForgotPassword() {
    const session = await getServerSession(options);
    if (session) return redirect("/");
    
    return (
        <div className="container mx-auto flex items-center justify-center pt-8">
            <div className="bg-white shadow-md rounded-lg px-8 py-8 w-96">
                <h2 className="text-2xl text-accent-dark font-bold text-center mb-4">Reset Password</h2>
                <ResetPasswordForm />
            </div>
        </div>
    );
}
