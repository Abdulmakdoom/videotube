class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        // over-write kr rahe hai
        super(message)
        this.statusCode = statusCode 
        this.data = null  
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor) // (reference, this.constructor)
        }

    }
}

export {ApiError}

