import React from "react";

function Spinner() {

    return (
        <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
        </div>
    );
}

export default Spinner;