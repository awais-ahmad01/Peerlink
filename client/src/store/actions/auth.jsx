import {createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;
// const baseURL = 'http://localhost:3000';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async(formData)=>{
    try{

        console.log('form:', formData)
        const response = await axios.post(`${baseURL}/register`, formData)

        console.log('response:', response)

        return true
    }
    catch(error){
         console.log('Error: ', error)
    }
  }
)



export const signinUser = createAsyncThunk(
    'auth/siginUser',
    async(formData)=>{
        try{
            console.log('form: ', formData)

           

            const response = await axios.post(`${baseURL}/login`, formData)

            console.log('response:', response)

            if(response){
                localStorage.setItem('token', response.data.token)
            }

            return {userData: response.data.user, auth:true}
        }
        catch(error){
            console.log("Error:", error)
            throw error;
        }
    }
)



export const verifyToken = createAsyncThunk(
    'auth/verifyToken',
    async()=>{
        try{
          
            

            const token = localStorage.getItem('token');

            console.log('token:', token)

            if(!token){
                console.log('token not found')

                return {userData:{}, auth:false}
            }


             const response = await axios.get(`${baseURL}/verifyToken`,
                {
                    headers:{
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
             )



            console.log('response:', response)

            return {userData: response.data.user, auth:true}
        }
        catch(error){
            console.log("Error:", error)
            throw error;
        }
    }
)


export const signOut = createAsyncThunk(
    'auth/signOut',
    async()=>{
        localStorage.removeItem('token');
        console.log('dispatched..')
        return true;
    }
)



