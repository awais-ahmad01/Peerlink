import { createSlice } from "@reduxjs/toolkit";
import { registerUser, signinUser, verifyToken, signOut } from '../actions/auth';

const initialState = {
    isloading: true,
    user: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
           .addCase(registerUser.pending, (state) => {
                state.isloading = true;
           })

           .addCase(registerUser.fulfilled, (state, action) => {
                state.isloading = false;
           })

            .addCase(registerUser.rejected, (state) => {
                state.isloading = false;
           })

           .addCase(signinUser.pending, (state) => {
                state.isloading = true;
           })

           .addCase(signinUser.fulfilled, (state, action) => {
                state.isloading = false;
                state.user = action.payload.userData;
                state.isAuthenticated = action.payload.auth;
           })

              .addCase(signinUser.rejected, (state, action) => {    
                state.isloading = false;
                state.user = null;
                state.isAuthenticated = false;
           })

           .addCase(verifyToken.pending, (state, action)=>{
               state.isloading = true;
           })

            .addCase(verifyToken.fulfilled, (state, action) => {
                state.isloading = false;
                state.user = action.payload.userData;
                state.isAuthenticated = action.payload.auth;
           })

            .addCase(verifyToken.rejected, (state, action) => {    
                state.isloading = false;
                state.user = null;
                state.isAuthenticated = false;
           })

           .addCase(signOut.pending, (state)=>{
               state.isloading = true;
           })

           .addCase(signOut.fulfilled, (state)=>{
               state.isloading = false;
               state.isAuthenticated = false;
           })
        }

    });


    export default authSlice.reducer;