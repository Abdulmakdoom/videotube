import React, { useEffect, useState } from "react";
import Input from "./Input";
import Button from "./Button";

// TODO: comment upload time 
function CommentBox ({videoId, className}) {
    const [input, setInput] = useState({content: ""})
    const [error, setError] = useState("")
    const [getComments, setGetComments] = useState([])

    

    const inputHandler = (e)=> {
        let {value} = e.target;
        setInput((prevData)=> ({
            ...prevData,
            content: value
        }))
    }
    // console.log(input);
   
    const formDataHandler = async(e)=> {
        e.preventDefault()
        setError("")

        try {

            //---------------------------response 1
            const response = await fetch(`/api/v1/comments/${videoId}`, {
                method: "POST",
                credentials: "include", // Ensures cookies are sent
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            })

            const result = await response.json()

            if(!response.ok){
                throw new Error(result.message || "Something went wrong")
            }

            //console.log(result.data);
            

            setInput({ content: "" });


            //-----------------------------response 2
            try {
                let response = await fetch(`/api/v1/comments/${videoId}`)
                let result = await response.json()
                //console.log(result);
    
                setGetComments(result.data.comments)
    
                //console.log(result.data);
    
                if(!response.ok){
                    throw new Error(result.message || "Something went wrong")
                }
            } catch (error) {
                setError(error.message)
            }
            // Update the comments list instantly by adding the new comment
            //setGetComments((prevData) => [...prevData, result.data]);

            // console.log(input);
            //console.log(videoId);
        } catch (error) {
            setError(error.message)
        }

    }

    useEffect(()=> {
        const fetchcomments = async()=> {
            try {
                let response = await fetch(`/api/v1/comments/${videoId}`)
                let result = await response.json()
                //console.log(result);
    
                setGetComments(result.data.comments)
    
                //console.log(result.data);
    
                if(!response.ok){
                    throw new Error(result.message || "Something went wrong")
                }
            } catch (error) {
                setError(error.message)
            }
        }
        fetchcomments()
    }, [])

   //console.log(getComments);

   

    return(
        <>
        {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}

        <form onSubmit={formDataHandler} >
           <div className={className}>
           <Input  onChange={inputHandler} value={input.content} type="text" name="content" placeholder="Add a comment..."/>
            <Button type="submit" className="bg-red-600">
                Send
            </Button>
           </div>
        </form>

        {/* {comment box} */}
        <div className="space-y-4">
        <div>
            {getComments.map((data, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border-b border-gray-300">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                    <img
                        src={data.ownerDetails.avatar} // Replace with actual avatar image URL
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    </div>

                    {/* Comment content */}
                    <div className="flex-1">
                    {/* Username */}
                    <div className="text-sm font-semibold text-gray-800">{data.ownerDetails.username}</div>

                    {/* Comment text */}
                    <div className="text-sm text-gray-700 mt-1">
                        {data.content}
                    </div>

                    {/* Actions (like, reply, etc.) */}
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <button className="hover:text-blue-500">Like</button>
                        <button className="hover:text-blue-500">Reply</button>
                    </div>
                    </div>
                </div>
                ))}
            </div>
        </div>

        </>
    )
}

export default CommentBox;