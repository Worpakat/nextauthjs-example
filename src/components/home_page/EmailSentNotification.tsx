import Link from "next/link"

const EmailSentNotification = () => {
    return (
        <h3 className="text-lg text-center font-semibold py-2 my-2">
            We have sent a verification email, please check your inbox.
            If you are not received, you can send new one from your <Link href={'/profile'} className="text-accent-dark italic underline">Profile</Link> Page
        </h3>
    )
}

export default EmailSentNotification