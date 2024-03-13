import Image from 'next/image'
import { useState } from 'react'
import ErrorMessage from '@/components/ErrorMessage'
import { useSession } from 'next-auth/react'

import dynamic from 'next/dynamic';
const PPEditor = dynamic(() => import('./PPEditor'), {
    ssr: false,
});
/**What is this dynamic report? I was taking this error before I do this dynamic importing. 
 * ⨯ node_modules\react-avatar-edit\lib\react-avatar.js (1:249) @ self
 ⨯ ReferenceError: self is not defined
 *
 As you can see react-avatar-edit caused the problem. 
 It's reason explained in the accepted answer at this stack overflow link: https://stackoverflow.com/questions/66096260/why-am-i-getting-referenceerror-self-is-not-defined-when-i-import-a-client-side
 And also some solutions ways. Also at this Next.js documentation link shows the solution that I used.
 https://nextjs.org/learn-pages-router/seo/improve/dynamic-import-components
 
 Basic Explanation: The error occurs because the library requires Web APIs to work, 
 which are not available when Next.js pre-renders the page on the server-side. 
 So with dynamic importing we imported the component that contains react-avatar's 'Avatar' component
 when just befor it is rendered. Hence, it's imported to client side.
*/




interface IPSectionProps {
    ppURL: string,
    setPPURL: React.Dispatch<React.SetStateAction<string>>
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>
}

const PPSection = ({ ppURL, setPPURL, setSuccessMessage }: IPSectionProps) => {

    const [errorMessages, setErrorMessage] = useState<string[]>([]);
    const [openEditor, setOpenEditor] = useState(false);
    const [base64Picture, setBase64Picture] = useState("");
    const { data: session, update } = useSession();

    const onUpdate = async () => {
        try {
            if (!session) return;

            if (!base64Picture) {
                setErrorMessage(["First you must change your profile picture."]);
                return;
            }
            const mimeType = getMimeTypeFromBase64(base64Picture);
            if (!mimeType) throw Error("Format has not been matched.")
            const binaryImage = base64ToBinary(base64Picture);

            // Convert the ArrayBuffer to a Blob
            const imageBlob = new Blob([binaryImage], { type: mimeType });

            // Create a FormData object and append the Blob
            const formData = new FormData();
            formData.append('userId', session.user.id);
            formData.append('image', imageBlob, `${session.user.id}_pp`);

            // Make the PUT request
            const response = await fetch('/api/profile/image/', {
                method: 'PUT',
                body: formData
            });
            const responseData = await response.json();

            if (response.ok) {
                setPPURL(responseData.imageURL);
                setSuccessMessage("Profile photo is updated successfully.");
                setErrorMessage([]);
                update({ imageURL: responseData.imageURL });

            } else {
                setErrorMessage([responseData.message]);
            }

        } catch (error: Error | any) {
            setErrorMessage([error.message]);
            console.error("An error occurred:", error);
        }
    }

    return (
        <div className='flex flex-col gap-2 items-center mb-4'>
            <Image
                width={200}
                height={200}
                src={base64Picture ? base64Picture : ppURL}
                alt='Profile Picture'
                priority={false}
                className='border-accent-dark border-4 rounded-full object-cover' />

            {errorMessages.length > 0 && <ErrorMessage errorMessages={errorMessages} />}

            <div className='flex gap-2 justify-center'>
                <button type="button" className="bg-accent hover:bg-accent-dark text-white font-medium py-2 px-4 rounded-md transition duration-300"
                    onClick={() => setOpenEditor(true)}>
                    Change Profile Picture
                </button>
                <button type="button" className="bg-accent hover:bg-accent-dark text-white font-medium py-2 px-4 rounded-md transition duration-300"
                    onClick={onUpdate}>
                    Update
                </button>
            </div>

            {openEditor && <PPEditor
                base64Picture={base64Picture}
                setBase64Picture={setBase64Picture}
                setOpenEditor={setOpenEditor}
                ppURL={ppURL}
            />}
        </div>
    )
}

export default PPSection

//Util function

/**Gets base64 format string and returns its binary format. */
function base64ToBinary(base64Picture: string): ArrayBuffer {
    const rawB64 = base64Picture.split(',')[1];
    return Buffer.from(rawB64, 'base64');
}
// Extract MIME type from base64 picture URI scheme
function getMimeTypeFromBase64(base64Picture: string) {
    const match = base64Picture.match(/^data:(.*?);base64,/);
    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}