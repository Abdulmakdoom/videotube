import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import Spinner from "../components/Loader";
import PostCard from "../components/PostCard";
import timeAgo from "../components/time";


function OwnerAllPosts (){
      const [postData, setPostData] = useState([])
         const [loader, setLoader] = useState(true);


         const userData = useSelector((state) => state.auth.userData);
         const userId = userData?._id;



        const postHandler = async () => {
            if (!userId) {
                // Prevent the fetch call if there is no valid ID
                return;
            }
        
            setPostData([])
            setLoader(true); // Set loader to true before fetching
        
            try {
                let response = await fetch(`/api/v1/tweets/user/${userId}`);
                let result = await response.json();
        
                //console.log(result);
                
                if (!response.ok) {
                    throw new Error(result.message || "Failed to fetch tweets");
                }
        
                setPostData(result.data);
        
            } catch (error) {
                console.log(error.message);
                // Optionally, set an error state here to show an error message to the user
                // setError(error.message); // example
            } finally {
                setLoader(false); // Always set loader to false, whether success or failure
            }
        }

        useEffect(()=> {
            postHandler();
        }, [userId])
    return (
        <>
         {/* Post Content */}
         <div>
            <div className="flex flex-col h-screen mt-20 pl-20">
                 {/* Loader spinner when loading */}
                 {loader ? (
                        <div className="flex justify-center items-center mt-60">
                            <Spinner />
                        </div>
                    ) : null}
                {/* Main content */}
                <div className="flex-grow p-4 flex flex-col items-start justify-start overflow-y-auto">
                    <div className="flex flex-col w-full space-y-4"> {/* Use flex-col for vertical stacking */}
                        {postData.map((post, index) => (
                            <div key={index} className="flex-shrink-0 w-full"> {/* Each card takes full width */}
                                <PostCard
                                    avatar={post?.owner?.avatar}
                                    channelName={post?.owner?.username}
                                    content={post?.content}
                                    uploadTime={timeAgo(post?.createdAt)}
                                    postId={post?._id}
                                    postData={postData}
                                    userId={post?.owner?._id}
                                    // data={data}
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

export default OwnerAllPosts;