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
            className={`${bgColor} ${textColor} ${className} rounded-lg shadow-md py-2 px-4 transition duration-200`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;