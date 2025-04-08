import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import timeAgo from "../components/time";
import Spinner from "../components/Loader";


function SubscriberPost (){
      const [loader, setLoader] = useState(false);
       const [postData, setPostData] = useState([])


       const allSubscribePosts = async ()=> {
        setPostData([])
        setLoader(true)
        try {
            const response = await fetch(`/api/v1/tweets/user/p/post`)
            const result = await response.json()

            if(!response.ok){
                setLoader(false)
                console.log(result?.message);
                
            }

            setLoader(false)
            setPostData(result?.data)
        } catch (error) {
            setLoader(false)
            console.log(error.message);  
        }

       }

       useEffect(()=> {
        allSubscribePosts()
       }, [])


    return (
        <>
        <div>
            <div className="flex flex-col h-screen mt-20">
                   {/* Loader spinner when loading */}
                   {loader ? (
                        <div className="flex justify-center items-center mt-60">
                            <Spinner />
                        </div>
                    ) : null}
                {/* Main content */}
                <div className="flex-grow p-4 flex flex-col items-start justify-start overflow-y-auto">
                    <div className="flex flex-col w-full space-y-4"> {/* Use flex-col for vertical stacking */}
                        {postData?.map((post, index) => (        
                            <div key={index} className="flex-shrink-0 w-full"> {/* Each card takes full width */}
                                <PostCard
                                    avatar={post?.owner?.avatar}
                                    channelName={post?.owner?.username}
                                    content={post?.content}
                                    uploadTime={timeAgo(post?.createdAt)}
                                    postId={post?._id}
                                    postData={postData}
                                    userId={post?.owner?._id}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
         </div>
        </>
    )
}
export default SubscriberPost;