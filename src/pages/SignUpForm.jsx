import React from 'react'
import './SignUpForm.css'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import {auth} from './firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'
const Login = () => {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const handleSubmit=async (e)=>{
    e.preventDefault()
    try{
      await createUserWithEmailAndPassword(auth,email,password)
      console.log("Account Created")
    }catch(err){
      console.log(err)
    }
  }
  return (
    <div className='signup-container'>
      <form className='signup-form' onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <label htmlFor='email'>
          Email:
          <input type='text' value={email} onChange={(e)=>setEmail(e.target.value)}/>
        </label>
        <label htmlFor='password'>
          Password:
          <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        </label>
        <button type='submit'>Sign-Up</button>
        <p>Already Registered? <Link to='/Login'>Login</Link></p>
      </form>
    </div>
  )
}

export default Login
