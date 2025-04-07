import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import postSlice from './postSlice'
const store = configureStore({
    reducer: {
        auth:authSlice,
        //todo: add more slice here for posts
        posts: postSlice,
    }
});

export default store;