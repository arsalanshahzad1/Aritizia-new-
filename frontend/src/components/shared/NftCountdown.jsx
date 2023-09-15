// import React, { useState, useEffect } from 'react';

// function NftCountdown({ endDateTime }) {
//     const [days, setDays] = useState(0);
//     const [hours, setHours] = useState(0);
//     const [minutes, setMinutes] = useState(0);
//     const [seconds, setSeconds] = useState(0);

//     const getTimeRemaining = () => {
//         endDateTime = parseInt(endDateTime, 10)
//         const now = new Date();
//         const endDate = new Date(Date.parse(endDateTime));
//         const difference = (endDate - now) / 1000;
//         console.log(difference, "date")
//         const days = Math.floor(difference / (60 * 60 * 24));
//         const hours = Math.floor((difference - (days * 60 * 60 * 24)) / (60 * 60));
//         const minutes = Math.floor((difference - (days * 60 * 60 * 24) - (hours * 60 * 60)) / (60));
//         const seconds = Math.floor(difference - (days * 60 * 60 * 24) - (hours * 60 * 60) - (minutes * 60));

//         setDays(days);
//         setHours(hours);
//         setMinutes(minutes);
//         setSeconds(seconds);
//     };

//     useEffect(() => {
//         getTimeRemaining();
//         const interval = setInterval(() => {
//             getTimeRemaining();
//         }, 1000);

//         return () => {
//             clearInterval(interval);
//         };
//     }, []);

//     return `${days}:${hours}:${minutes}:${seconds}`
// };

// export default NftCountdown;



import React, { useState, useEffect } from 'react';

function NftCountdown({ endDateTime }) {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const getTimeRemaining = () => {
        endDateTime = parseInt(endDateTime, 10);
        const now = new Date();
        const endDate = new Date(endDateTime * 1000); // Convert seconds to milliseconds
        const difference = Math.max((endDate - now) / 1000, 0); // Ensure the difference is non-negative

        const days = Math.floor(difference / (60 * 60 * 24));
        const hours = Math.floor((difference - days * 60 * 60 * 24) / (60 * 60));
        const minutes = Math.floor((difference - days * 60 * 60 * 24 - hours * 60 * 60) / 60);
        const seconds = Math.floor(difference - days * 60 * 60 * 24 - hours * 60 * 60 - minutes * 60);

        setDays(days);
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
    };

    useEffect(() => {
        getTimeRemaining();
        const interval = setInterval(() => {
            getTimeRemaining();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [endDateTime]); // Include endDateTime as a dependency
    console.log(days, "days")

    return `${days}:${hours}:${minutes}:${seconds}`;
}

export default NftCountdown;
