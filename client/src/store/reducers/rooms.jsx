import { createSlice } from "@reduxjs/toolkit";
import { getRecentRooms } from "../actions/rooms";

const initialState = {
    isloading: true,
    rooms: null,

}

const roomSlice = createSlice({
    name: 'rooms',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
           .addCase(getRecentRooms.pending, (state) => {
                state.isloading = true;
           })

           .addCase(getRecentRooms.fulfilled, (state, action) => {
                state.isloading = false;
                state.rooms = action.payload.data;
           })

            .addCase(getRecentRooms.rejected, (state) => {
                state.isloading = false;
                state.rooms = null;
           })

          
        }

    });


    export default roomSlice.reducer;