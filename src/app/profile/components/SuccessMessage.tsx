"use client"

import React, { useContext } from 'react'
import { ISuccessContext, SuccessContext } from './SuccessContextWrapper';

const SuccessMessage = () => {
    const { successMessage, setSuccessMessage } = useContext(SuccessContext) as ISuccessContext;

    return (
        <>
            {successMessage && <h4 className="text-accent-dark text-lg text-center font-semibold py-2 my-2">{successMessage}</h4>}
        </>
    )
}

export default SuccessMessage