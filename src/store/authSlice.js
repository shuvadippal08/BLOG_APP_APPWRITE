import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
    loading: true,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: { 
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            state.loading = false;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.loading = false;
        },
        finishLoading:(state) =>{
            state.loading = false;
        }
    }
})

export const {login, logout,finishLoading} = authSlice.actions;

export default authSlice.reducer;