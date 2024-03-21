import ChangePasswordForm from "./components/ChangePassword";
import PPSection from "./components/PPSection";
import SuccessContextWrapper from "./components/SuccessContextWrapper";
import ProfileInfoForm from "./components/ProfileInfoForm";
import SuccessMessage from "./components/SuccessMessage";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { DBService } from "@/db_service/db_service";

export default async function Profile() {
    const session = await getServerSession(options);
    let userProfile: IUserProfile | undefined

    const getUserProfile = async () => {
        try {
            if (!session) {
                console.log("You are not authenticated.");
                redirect("/");
            }

            const userDocument = await DBService.getUserById(session.user.id);
            if (!userDocument || userDocument instanceof Error) {
                redirect("/");
            }

            return {
                username: userDocument.name,
                email: userDocument.email,
                email_verified: userDocument.email_verified,
                role: userDocument.role,
                imageURL: userDocument.image.URL,
                banned: userDocument.banned,
                birthday: userDocument.birthday
            } as IUserProfile

        } catch (error: Error | any) {
            console.error("An error occurred:", error);
            return error
        }
    }

    userProfile = await getUserProfile();
    if (!userProfile) {
        throw Error("An error occurred. Please try again later:( !");

    } else if (userProfile instanceof Error) {
        console.error("An error occurred:", userProfile.message);
        throw userProfile;
    }

    console.log(userProfile);
    

    return (
        <div className="min-h-screen pt-4 pb-8 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-semibold text-center mb-4">Profile</h2>

                <SuccessContextWrapper>
                    <SuccessMessage />

                    <PPSection _ppURL={userProfile?.imageURL ? userProfile?.imageURL : "/default_pp.jpg"} />

                    <ProfileInfoForm
                        _username={userProfile.username}
                        _email={userProfile.email}
                        _emailVerified={userProfile.email_verified ? "Yes" : "No"}
                        _birthday={userProfile.birthday ? new Date(userProfile.birthday.toString()) : undefined} />

                </SuccessContextWrapper>

                <hr className="my-6" />

                
                {userProfile.role !== "googleUser" && <ChangePasswordForm />}
            </div>
        </div >
    );

}
