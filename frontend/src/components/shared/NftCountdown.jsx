import React, { useState, useEffect } from 'react';

function NftCountdown({ endDateTime }) {
    const [timeRemaining, setTimeRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const calculateTimeRemaining = () => {
        const now = new Date().getTime();
        const endTime = endDateTime; // Convert seconds to milliseconds
        const timeDifference = Math.max(endTime - now, 0); // Ensure the difference is non-negative

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
    };

    useEffect(() => {
        calculateTimeRemaining();
        const interval = setInterval(calculateTimeRemaining, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [endDateTime]);

    // Format the time remaining as a string
    const { days, hours, minutes, seconds } = timeRemaining;
    const formattedDays = String(days).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    const formattedTimeRemaining = `${formattedDays}:${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        
    return formattedTimeRemaining;
}

export default NftCountdown;
