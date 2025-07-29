import type React from "react";

type BadgeProps = {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "blue" | "teal" | "green" | "red";
};

const Badge = ({
    children,
    className = "",
    variant = "default",
}: BadgeProps) => {
    const variants = {
        default: "bg-gray-100 text-gray-800",
        blue: "bg-blue-100 text-blue-800",
        teal: "bg-teal-100 text-teal-800",
        green: "bg-green-100 text-green-800",
        red: "bg-red-100 text-red-800",
    };

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
        >
            {children}
        </span>
    );
};

export default Badge;
