import React from "react";

function Container({children}) {  // we define styling property only
    return (
        <div className="w-400  mx-auto">{children}</div>
    )
}

export default Container;