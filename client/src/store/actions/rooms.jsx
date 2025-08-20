import {createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;
// const baseURL = 'http://localhost:3000';

export const getRecentRooms = createAsyncThunk(
  'rooms/getRecentRooms',
  async(username)=>{
    try{

    
        const response = await axios.get(`${baseURL}/get-rooms/${username}`)

        console.log('response:', response.data)

        return {data: response.data}
    }
    catch(error){
         console.log('Error: ', error)
    }
  }
)

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async({username, roomId}, {dispatch})=>{
    try{

        
        const response = await axios.post(`${baseURL}/delete-room/${roomId}/${username}`)

        console.log('response:', response)

        dispatch(getRecentRooms(username))

        return true;
    }
    catch(error){
         console.log('Error: ', error)
    }
  }
)