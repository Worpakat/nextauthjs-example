"use client"
import { redirect, useRouter } from "next/navigation";
import { getPageRange } from "./utils";

const Pagination = ({ currentPage, totalPages }: { currentPage: number, totalPages: number }) => {
    const router = useRouter();

    const handlePageClick = (page: number) => {
        if (page !== currentPage) router.push(`/admin/${page}`);
    };

    return (
        <div className="flex justify-center space-x-2 mt-4">
            {/* Previous page button */}
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-1 rounded-md bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Page numbers */}
            {getPageRange(currentPage, totalPages).map((page) => (
                <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-accent text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    {page}
                </button>
            ))}

            {/* Next page button */}
            <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 rounded-md bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default Pagination;