export function formatHistoryDate(createdAt: Date): string {
    // Constants for time calculations
    const MS_PER_MINUTE = 60 * 1000;
    const MS_PER_HOUR = 60 * MS_PER_MINUTE;
    const MS_PER_DAY = 24 * MS_PER_HOUR;
    const MS_PER_YEAR = 365 * MS_PER_DAY; // Corrected to include a standard year length

    // Time measures
    const now = new Date();
    const createdDate = new Date(createdAt);
    const timeDifference = now.getTime() - createdDate.getTime();

    // Detail formatting functions
    function formatSameDay() {
        return createdDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    function formatDateWithTime() {
        return createdDate.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    function formatDateWithYear() {
        return createdDate.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    // Conditional formatting based on time difference
    if (timeDifference < MS_PER_HOUR) {
        const minutes = Math.floor(timeDifference / MS_PER_MINUTE);
        return minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""} ago` : "just now";
    } else if (timeDifference < MS_PER_DAY) {
        return formatSameDay();
    } else if (timeDifference < MS_PER_YEAR) {
        return formatDateWithTime();
    } else {
        return formatDateWithYear();
    }
}