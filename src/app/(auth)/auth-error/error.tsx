import React from 'react'

const AuthError = ({ error }: { error: Error }) => {
    return (
        <div>
            <h2>
                CUSTOM ERROR PAGE -- ERROR: {error.message}
            </h2>

        </div>
    )
}

export default AuthError