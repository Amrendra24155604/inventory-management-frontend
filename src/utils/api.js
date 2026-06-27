// const API_PORT = import.meta.env.VITE_API_PORT;

// export async function apiRequest(endpoint, options = {}) {
//   const accessToken = localStorage.getItem('accessToken');
  
//   if (!accessToken) {
//     window.location.href = '/login';
//     return;
//   }

//   const config = {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${accessToken}`,  // 👈 ONLY localStorage
//       ...options.headers,
//     },
//   };

//   const response = await fetch(`${API_PORT}${endpoint}`, config);
  
//   if (response.status === 401) {
//     localStorage.clear();
//     window.location.href = '/login';
//   }
  
//   return response;
// }
