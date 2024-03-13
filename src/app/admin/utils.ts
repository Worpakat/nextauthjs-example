
export const getPageFromRoute = (subroutes: string[] | undefined): number => {
    //If there is no subroute at URL subroutes becomes undefined.
    if (subroutes) {
        const firstSubrouteAsNumber = parseInt(subroutes[0], 10);

        // Check if the conversion was successful and the result is not NaN
        if (!isNaN(firstSubrouteAsNumber) && firstSubrouteAsNumber >= 0) return firstSubrouteAsNumber;
    }

    // If conversion failed or array is empty, return 0
    return 0;
};

export const formatDate = (date: Date | string): string => {
    if (typeof date === "string") date = new Date(date);

    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear());

    return `${month}/${day}/${year}`;
}

/**Calculates the page range to be displayed.  */
export const getPageRange = (currentPage: number, totalPages: number) => {
    const range = [];
    const maxVisiblePages = 5; // Maximum number of visible page numbers

    // Calculate the start and end of the range
    let start = currentPage - Math.floor(maxVisiblePages / 2);
    let end = currentPage + Math.floor(maxVisiblePages / 2);

    // Adjust the range if it exceeds the total number of pages
    if (start < 0) {
        end += Math.abs(start);
        start = 0;
    }
    if (end > totalPages - 1) {
        end = totalPages - 1;
    }

    // Generate the range of page numbers
    for (let i = start; i <= end; i++) {
        range.push(i);
    }

    return range;
};