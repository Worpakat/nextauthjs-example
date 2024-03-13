import { redirect} from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import SignInForm from "./SignInForm";
import GoogleSignInBtn from "@/components/GoogleSignInBtn";

export default async function SignIn() {
    const session = await getServerSession(options);
    if (session) return redirect("/");

    return (
        <div className="container mx-auto flex items-center justify-center pt-8">
            <div className="bg-white shadow-md rounded-lg px-8 py-8 w-96">
                <h2 className="text-2xl text-accent-dark font-bold text-center mb-4">Sign In</h2>

                <GoogleSignInBtn/>

                <div className="text-center my-4">
                    <span className="text-gray-400">- OR -</span>
                </div>

                <SignInForm />
                
                <p className="text-center mt-4">
                    Don&apos;t have an account? <Link href="/signup" className="text-accent-dark font-semibold">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
