// const fetchWithAuth = async (url, options = {}) => {
//   const url2 = "https://videotube-mggc.onrender.com" || "http://localhost:8000"
//     // Ensure credentials (cookies) are included in the request
//     let response = await fetch(url, {
//       ...options,
//       credentials: 'include', // Ensure cookies (access token, refresh token) are sent
//     });
  
//     // If the response is 401 Unauthorized, it means the access token has likely expired
//     if (response.status === 401) {
//       try {
//         // Attempt to refresh the access token
//         const refreshResponse = await fetch(url2+'/api/v1/users/refresh-token', {
//           method: 'POST',
//           credentials: 'include', // Send cookies with the request
//         });
  
//         if (refreshResponse.ok) {
//           // After successful refresh, retry the original request
//           // Optional: You could store the new access token in a global state (e.g., Redux)
//           // Or you can just retry the request as is since cookies are set in the browser.
  
//           response = await fetch(url, {
//             ...options,
//             credentials: 'include', // Ensure cookies are included again
//           });
//         } else {
//           // If the refresh token request fails, it likely means the user is logged out
//           throw new Error("Session expired, please log in again");
//         }
//       } catch (refreshError) {
//         // If there is an error in refreshing the token, handle accordingly
//         throw new Error("Session expired, please log in again");
//       }
//     }
  
//     return response;
//   };
  
//   export default fetchWithAuth;



const baseURL = "https://videotube-mggc.onrender.com" || "http://localhost:8000";

const fetchWithAuth = async (url, options = {}) => {
  try {
    let response = await fetch(url, {
      ...options,
      credentials: 'include',
    });

    // If unauthorized, try refreshing the token
    if (response.status === 401) {
      const refreshResponse = await fetch(`${baseURL}/api/v1/users/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!refreshResponse.ok) {
        throw new Error("Session expired. Please log in again.");
      }

      // Retry the original request after refresh
      response = await fetch(url, {
        ...options,
        credentials: 'include',
      });
    }

    return response;

  } catch (err) {
    console.error("fetchWithAuth error:", err.message);
    throw err; // Let the caller handle it
  }
};

export default fetchWithAuth;

  