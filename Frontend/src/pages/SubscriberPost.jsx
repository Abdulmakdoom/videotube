import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import timeAgo from "../components/time";
import Spinner from "../components/Loader";
import fetchWithAuth from "../utils/api";
import { useSelector } from "react-redux";


function SubscriberPost (){
      const [loader, setLoader] = useState(false);
      const [postData, setPostData] = useState([])

        const userData = useSelector((state) => state.auth.userData);
        const userId = userData?._id;
       let url = import.meta.env.VITE_API_URL

       const allSubscribePosts = async ()=> {
        setPostData([])
        setLoader(true)
        try {
            const response = await fetchWithAuth(`${url}/api/v1/tweets/user/p/post`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const result = await response.json()

            if(!response.ok){
                setLoader(false)
                //console.log(result?.message);
                
            }

            setLoader(false)
            setPostData(result?.data)
        } catch (error) {
            setLoader(false)
            //console.log(error.message);  
        }

       }

       useEffect(()=> {
        allSubscribePosts()
       }, [])


    return (
        <>
        <div>
            <div className="flex flex-col h-screen mt-20 pl-20">

            {userData && (
                <>
                    {loader ? (
                    <div className="flex justify-center items-center h-screen">
                        <Spinner />
                    </div>
                    ) : postData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-screen text-center px-4 pb-50">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                        No posts available
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                        There are no posts to show right now. Check back later or create a new post.
                        </p>
                    </div>
                    ) : null}
                </>
            )}

                


                {!userId && (
                <div className="flex flex-col items-center justify-center h-screen text-center px-4 pb-50">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                    Please log in to view this post
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                    You must be signed in to access this content. Log in to explore posts and engage with the community.
                    </p>
                    <a
                    href="/login"
                    className="inline-block px-6 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium transition duration-200"
                    >
                    Go to Login
                    </a>
                </div>
                )}


                {/* Main content */}
                {userId && <div className="flex-grow p-4 flex flex-col items-start justify-start overflow-y-auto">
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
                </div>}
            </div>
         </div>
        </>
    )
}
export default SubscriberPost;