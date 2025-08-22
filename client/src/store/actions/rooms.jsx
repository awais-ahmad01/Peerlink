import {createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const baseURL = import.meta.env.VITE_API_BASE_URL;
const baseURL = 'http://localhost:3000';

export const getRecentRooms = createAsyncThunk(
  'rooms/getRecentRooms',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/get-rooms/${userId}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch recent rooms"
      );
    }
  }
);


export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async ({ userId, roomId }, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(`${baseURL}/delete-room/${roomId}/${userId}`);
      // refresh after delete
      dispatch(getRecentRooms(userId));
      return true;
    } catch (error) {
      console.error('Error deleting room:', error);
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete room"
      );
    }
  }
);
