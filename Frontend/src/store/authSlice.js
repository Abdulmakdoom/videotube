// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     userData: null,
//     // refreshData: null
// }

// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: { // actions
//         login: (state, action)=> { 
//             state.userData = action.payload;   
//             //console.log(action.payload);          
//         },

//         logout: (state) => {
//             state.userData = null;
//         },
//         // restoreUser: (state, action) => {
//         //     state.refreshData = action.payload; // Restore user on refresh
//         // }
//     }
// })



// export const {login, logout} = authSlice.actions;

// export default authSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.userData = action.payload;
    },
    logout: (state) => {
      state.userData = null;
    },
    resetAuth: () => initialState, // ✅ Resets slice state completely
  }
});

export const { login, logout, resetAuth } = authSlice.actions;
export default authSlice.reducer;
