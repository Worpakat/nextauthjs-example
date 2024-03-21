"use client";

import React from 'react'

const Error = ({ error }: { error: Error }) => {
    return (
        <div>
            <h3 className="m-4 text-red-500 text-2xl font-semibold">{error.message}</h3>
        </div>
    )
}

export default Error