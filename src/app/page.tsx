import UserWelcome from "@/components/home_page/UserWelcome";
import EmailSentNotification from "@/components/home_page/EmailSentNotification";

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const { mailSent } = searchParams;

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold text-accent-dark">NextAuth Example App</h1>
            <UserWelcome />
            {mailSent && <EmailSentNotification />}
            <p>This app is made for experiencing the authentication which is one of the important parts of web development. I made it as end product level as I can.</p>
            <section className="app-features">
                <h2 className="">App&apos;s Features</h2>
                <ul className="outer-list">
                    <li>
                        <h3>Authentication with credentials:</h3>
                        <p>Users can create accounts with an email address password and signin with it. User&apos;s information stored at database.</p>
                    </li>
                    <li>
                        <h3>Authentication with Google account(OAuth):</h3>
                        <p>Users can signin with their Google account. In this case, some of information of user that Google provided is stored at database.</p>
                    </li>
                    <li>
                        <h3>Custom signin and signup pages:</h3>
                        <p>Instead of using pages that NextAuth.js has provided for signin signout, I&apos;ve created custom pages. And also a signup page.</p>
                    </li>
                    <li>
                        <h3>Email verification:</h3>
                        <p>After first signup and signin a verification email is sent to user. User can verify its email address by clicking the link inside the email that we&apos;ve sent.</p>
                    </li>
                    <li>
                        <h3>Password reseting:</h3>
                        <p>Users can reset their password via <span className="italic font-light">Forgot password?</span> link at signin page.
                            It&apos;s processed with sending a reset password email to user&apos;s email address that user used for signup before.</p>
                    </li>
                    <li>
                        <h3>Profile page:</h3>
                        <ul className="inner-list">
                            <li>- User&apos;s information are displayed in this page.</li>
                            <li>- User can update a new profile photo and change it. It can make basic cropping on photo before update the new profile photo.</li>
                            <li>- User can change its informations here: Username, email, birthday</li>
                            <li>- In case of user has not verified its email or verification email could not be sent for any reason, user can send a new verification email from this page.</li>
                            <li>- User can change its password with a new one.</li>
                        </ul>
                    </li>
                    <li>
                        <h3>Role based authorization:</h3>
                        <p>A role is given to every user: <span className="italic font-light">credentialUser, googleUser, admin</span>.</p>
                    </li>
                    <li>
                        <h3>Administration page:</h3>
                        <p>Only <span className="italic font-light">admin</span> users can enter Administration page.
                            Admin users can display all the users at a table with their informations, and also ban or unban a user.
                            Ban/Unban feature is just made with representative intention. Any feature can take care of this user information and manage the processing by that.
                            For example banned users can not buy any products and make payment.</p>
                    </li>
                </ul>
            </section>
        </div>
    );

}



