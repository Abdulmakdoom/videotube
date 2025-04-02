import React, { useId } from "react";

function Input({ label, type, className = "", ...props }) {
    const id = useId();

    return (
        <div className="w-full">
            {label && (
                <label
                    className="block mb-1 text-white font-medium"
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ${className}`}
                {...props}
                id={id}
            />
        </div>
    );
}

export default Input;