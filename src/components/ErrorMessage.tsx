import React from 'react'

const ErrorMessage = ({ errorMessages }: { errorMessages: string[] }) => {
    return (
        <ul className="text-accent-dark mb-4 text-sm">
            {errorMessages.map((error, index) => {
                return <li key={index}>{error}</li>
            })}
        </ul>
    );
}

export default ErrorMessage