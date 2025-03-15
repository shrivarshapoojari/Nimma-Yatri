import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ userData, setUserData ] = useState({})

  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()



  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

    if (response.status === 200) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }


    setEmail('')
    setPassword('')
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-16 mb-10' src="data:image/png;base64,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" alt="" />

        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

          <input
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            required type="password"
            placeholder='password'
          />

          <button
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
          >Login</button>

        </form>
        <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
      </div>
      <div>
        <Link
          to='/captain-login'
          className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
        >Sign in as Captain</Link>
      </div>
    </div>
  )
}

export default UserLogin