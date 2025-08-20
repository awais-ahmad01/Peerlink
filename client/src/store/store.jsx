import { configureStore
 } from "@reduxjs/toolkit";

import authReducer from './reducers/auth';

import roomsReducer from './reducers/rooms';

const store = configureStore({
    reducer: {
        auth: authReducer,
        romms: roomsReducer
      
    },

})

export default store;