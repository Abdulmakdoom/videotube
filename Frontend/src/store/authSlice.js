import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: { // actions
        login: (state, action)=> { 
            state.userData = action.payload;   
            //console.log(action.payload);          
        },

        logout: (state) => {
            state.userData = null;
        }
    }
})



export const {login, logout} = authSlice.actions;

export default authSlice.reducer;