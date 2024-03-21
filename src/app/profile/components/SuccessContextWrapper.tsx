"use client"
import { createContext, useState } from 'react'
import React from 'react'

export interface ISuccessContext {
    successMessage: string;
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>
}

export const SuccessContext = createContext<ISuccessContext | null>(null)

const SuccessContextWrapper = ({ children }: { children: React.ReactNode }) => {

    const [successMessage, setSuccessMessage] = useState("");

    return (
        <SuccessContext.Provider value={{ successMessage, setSuccessMessage }}>{children}</SuccessContext.Provider>
    );
}

export default SuccessContextWrapper