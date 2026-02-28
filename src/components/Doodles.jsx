
const Doodles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
        <svg className="absolute top-20 left-10 w-24 h-24 text-white/30 animate-pulse-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M4 12l8-8 8 8M4 12h16" />
        </svg>
        <svg className="absolute top-40 right-20 w-32 h-32 text-yellow-400/30 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </svg>
        <svg className="absolute bottom-32 left-32 w-20 h-20 text-pink-400/30 animate-bounce-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg className="absolute bottom-10 right-10 w-28 h-28 text-blue-400/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="3" />
            <path d="M12 8v3" />
        </svg>
        <svg className="absolute top-1/2 left-1/2 w-40 h-40 text-purple-400/20 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
            <path d="M15 5l-3 3-3-3M6 20l3-3 3 3M9 17V7m6 10l3-3 3 3M15 17V7" />
        </svg>
        {/* Ticket Stub */}
        <svg className="absolute top-10 left-1/3 w-16 h-16 text-green-400/30 animate-pulse-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M3 6h18v12H3z" />
            <path d="M3 11a2 2 0 012-2 2 2 0 01-2-2" />
            <path d="M21 11a2 2 0 00-2-2 2 2 0 002-2" />
        </svg>
        {/* Confetti / Starburst */}
        <svg className="absolute bottom-20 right-1/3 w-24 h-24 text-red-500/20 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2l2 7h7l-6 5 2 7-6-5-6 5 2-7-6-5h7z" />
        </svg>
        {/* Another Ticket Variant */}
        <svg className="absolute top-1/3 right-10 w-20 h-20 text-indigo-400/20 animate-bounce-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M6 12h2" />
            <path d="M16 12h2" />
            <circle cx="12" cy="12" r="2" />
        </svg>
        {/* Barcode-ish */}
        <svg className="absolute bottom-1/4 left-10 w-32 h-16 text-gray-500/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M4 4v16M8 4v16M12 4v16M16 4v16M20 4v16" />
        </svg>
    </div>
);

export default Doodles;
