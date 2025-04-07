import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import authService from "./appwrite/auth"
import {login, logout, finishLoading} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    }).catch((err) => {
      console.error("Auth error",err)
    })
    .finally(() =>dispatch( finishLoading()))
  }, [dispatch]);
  
  return !loading ? (
    <div className='min-h-screen bg-gray-400 flex flex-col'>
      <div className='w-full '>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null;
}

export default App