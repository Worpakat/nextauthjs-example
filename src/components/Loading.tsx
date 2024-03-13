import React from 'react';

const Loading = () => {
    return (
        <div className="min-h-screen bg-mainBG flex justify-center items-center">
            <div className="p-8 py-16 rounded-lg shadow-lg w-80 -mt-24 flex justify-center flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">Loading...</h2>
                <div className="w-12 h-12 border-t-4 border-accent-dark rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

export default Loading;
