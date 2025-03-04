import React from "react";

function Button({
    children,
    type = "button",
    bgColor = "bg-blue-600",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button
            type={type}
            className={`${bgColor} ${textColor} ${className} rounded-lg shadow-md py-2 px-4 transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;