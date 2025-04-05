import React from 'react'
import { useSelector } from 'react-redux'

const Account = () => {
  const userData = useSelector((state) => state.auth.userData)

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Account Page</h1>
      {userData ? (
        <div className="bg-white p-6 rounded shadow-md">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  )
}

export default Account
