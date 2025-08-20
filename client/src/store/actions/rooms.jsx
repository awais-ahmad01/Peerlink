import {createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const getRecentRooms = createAsyncThunk(
  'rooms/getRecentRooms',
  async(username)=>{
    try{

        
        const response = await axios.get(`${baseURL}/get-rooms/${username}`)

        console.log('response:', response)

        return {data: response}
    }
    catch(error){
         console.log('Error: ', error)
    }
  }
)

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async({username, roomId})=>{
    try{

        
        const response = await axios.get(`${baseURL}/delete-room/${roomId}/${username}`)

        console.log('response:', response)

        return true;
    }
    catch(error){
         console.log('Error: ', error)
    }
  }
)