export function BeetleLogo({ className = "size-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <ellipse cx="12" cy="13" rx="7" ry="5" />
            <circle cx="12" cy="7" r="2.5" />
            <path d="M5 11 3 8" />
            <path d="M19 11 21 8" />
            <path d="M6.5 14.5 5 18" />
            <path d="M17.5 14.5 19 18" />
            <path d="M9.5 17.5 9 21" />
            <path d="M14.5 17.5 15 21" />
        </svg>
    )
}
