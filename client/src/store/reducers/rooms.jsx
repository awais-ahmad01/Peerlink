import { createSlice } from "@reduxjs/toolkit";
import { getRecentRooms, deleteRoom } from "../actions/rooms";

const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    isloading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(getRecentRooms.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(getRecentRooms.fulfilled, (state, action) => {
        state.isloading = false;
        state.rooms = action.payload.data;
      })
      .addCase(getRecentRooms.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload || "Something went wrong";
      })

      // delete
      .addCase(deleteRoom.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state) => {
        state.isloading = false;
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload || "Failed to delete room";
      });
  },
});

export default roomsSlice.reducer;
