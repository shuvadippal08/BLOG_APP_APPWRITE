// postSlice.js
import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload); // add to top
    },
  },
});

export const { setPosts, setLoading, setError, addPost } = postSlice.actions;
export default postSlice.reducer;
