"use client"

import { useState } from "react";

const BanBtn = ({ userId, banned }: { userId: string, banned: boolean }) => {

    const [isBanned, setIsBanned] = useState(banned)

    const onClick = async () => {
        try {
            const response = await fetch('/api/admin/ban-user', {
                method: 'PATCH',
                body: JSON.stringify({ userId }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setIsBanned(!isBanned);
            } else {
                console.error('Failed to ban/unban user');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <button className={`px-4 py-2 rounded-md w-20 ${!isBanned ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
            onClick={onClick}>
            {!isBanned ? 'Ban' : 'Unban'}
        </button>
    );

}

export default BanBtn