import React from 'react';

export const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24" >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        );
    }

    if (hasHalfStar) {
        stars.push(
            <svg key="half" className="w-4 h-4" viewBox="0 0 24 24" >
                <defs>
                    <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%" >
                        <stop offset="50%" stopColor="#facc15" />
                        <stop offset="50%" stopColor="#d1d5db" />
                    </linearGradient>
                </defs>
                < path fill="url(#half-star)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        );
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
        stars.push(
            <svg key={`empty-${i}`} className="w-4 h-4 fill-gray-300" viewBox="0 0 24 24" >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        );
    }

    return stars;
};
