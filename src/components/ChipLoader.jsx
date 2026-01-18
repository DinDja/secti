// src/components/ChipLoader.jsimport React from 'react';

const ChipLoader = () => (
    <div className="loader-wrapper animate-in fade-in duration-500">
        <div className="secti-loader">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="secti-inline-block">
                <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="grad1">
                        <stop stopColor="#973BED"></stop>
                        <stop stopColor="#007CFF" offset="1"></stop>
                    </linearGradient>
                    <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="grad2">
                        <stop stopColor="#00E0ED"></stop>
                        <stop stopColor="#00DA72" offset="1"></stop>
                    </linearGradient>
                </defs>
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#grad1)" d="M 48 16 C 10 8 10 32 32 32 C 54 32 54 56 16 48" className="secti-dash" pathLength="360"></path>
            </svg>
            <div className="secti-w-2"></div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="secti-inline-block">
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#grad2)" d="M 50 14 H 14 V 50 H 50" className="secti-dash" pathLength="360"></path>
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#grad2)" d="M 14 32 H 42" className="secti-dash" pathLength="360"></path>
            </svg>
            <div className="secti-w-2"></div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="secti-inline-block">
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#grad1)" d="M 48 14 C 14 6 14 58 48 50" className="secti-dash" pathLength="360"></path>
            </svg>
            <div className="secti-w-2"></div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="secti-inline-block">
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#grad2)" d="M 14 14 H 50" className="secti-dash" pathLength="360"></path>
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#grad2)" d="M 32 14 V 50" className="secti-dash" pathLength="360"></path>
            </svg>
            <div className="secti-w-2"></div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="64" width="64" className="secti-inline-block">
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#grad1)" d="M 32 14 V 50" className="secti-dash" pathLength="360"></path>
            </svg>
        </div>
    </div>
);

export default ChipLoader;