// const fetchWithAuth = async (url, options = {}) => {
//     // Ensure credentials (cookies) are included in the request
//     let response = await fetch(url, {
//       ...options,
//       credentials: 'include', // Ensure cookies (access token, refresh token) are sent
//     });
  
//     // If the response is 401 Unauthorized, it means the access token has likely expired
//     if (response.status === 401) {
//       try {
//         // Attempt to refresh the access token
//         const refreshResponse = await fetch('/api/v1/users/refresh-token', {
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

//           alert('Please allow third-party cookies to ensure proper access to data, or your session may expire.')
//           window.location.href = '/login';
//           throw new Error("Session expired, please log in again");
          
//         }
//       } catch (refreshError) {
//         // If there is an error in refreshing the token, handle accordingly
//         alert('Please allow third-party cookies to ensure proper access to data, or your session may expire.')
//         window.location.href = '/login';
//         throw new Error("Session expired, please log in again");
//       }
//     }
  
//     return response;
//   };
  
//   export default fetchWithAuth;


const fetchWithAuth = async (url, options = {}) => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  let response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`, // Send access token from localStorage
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401 && refreshToken) {
    try {
      // Try refreshing access token
      const refreshResponse = await fetch('/api/v1/users/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }), // Send refresh token manually
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data;

        // Save new tokens
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request with new token
        response = await fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        // Refresh failed, redirect to login
        localStorage.clear();
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    } catch (error) {
      localStorage.clear();
      alert('Session expired. Please log in again.');
      window.location.href = '/login';
      throw new Error('Token refresh failed');
    }
  }

  return response;
};

export default fetchWithAuth;
