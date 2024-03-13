import ErrorMessage from '@/components/ErrorMessage'
import { ChangeEvent, useState } from 'react'
import Avatar from 'react-avatar-edit'
import Image from 'next/image'

interface IPPEditorProps {
    base64Picture: string
    setBase64Picture: React.Dispatch<React.SetStateAction<string>>
    setOpenEditor: React.Dispatch<React.SetStateAction<boolean>>
    ppURL: string
}

const PPEditor = ({
    base64Picture,
    setBase64Picture,
    setOpenEditor,
    ppURL
}: IPPEditorProps) => {

    const [previewPicture, setPreviewPicture] = useState("")
    const [errorMessages, setErrorMessage] = useState<string[]>([]);

    const onClose = () => {
        setPreviewPicture("")
    }
    const onCrop = (preview: string) => {
        setPreviewPicture(preview)
    }
    const onBeforeFileLoad = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return;

        if (files[0].type.substring(0, 5) !== "image") {
            setErrorMessage(["You can use just image file."]);
            e.target.value = "";
        };
    }

    const onChangeBtn = () => {
        setOpenEditor(false)
        setBase64Picture(previewPicture)        
    }
    const onCancelBtn = () => {
        setOpenEditor(false)
        setPreviewPicture("");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-10 backdrop-filter backdrop-blur-md transition-opacity">
            <div className='flex flex-col gap-4 items-center justify-center bg-white border-2 border-accent rounded-md p-8 shadow-lg'>
                <Image
                    width={200}
                    height={200}
                    src={previewPicture ? previewPicture : ppURL}
                    alt='Preview'
                    priority={false} 
                    className='border-accent-dark border-4 rounded-full object-cover' />

                <Avatar
                    width={390}
                    height={295}
                    onCrop={onCrop}
                    onClose={onClose}
                    src=''
                    onBeforeFileLoad={onBeforeFileLoad} />

                {errorMessages.length > 0 && <ErrorMessage errorMessages={errorMessages} />}

                <div className='flex gap-2 justify-center'>
                    <button type="button" className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                        onClick={onCancelBtn}>
                        Cancel
                    </button>
                    <button type="button" className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                        onClick={onChangeBtn}>
                        Change
                    </button>
                </div>

            </div>
        </div>
    )
}

export default PPEditor