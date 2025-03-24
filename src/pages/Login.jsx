import React from 'react'
import './SignUpForm.css'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const SignUpForm = () => {
  const navigate=useNavigate();
  return (
    <div className='signup-container'>
      <form className='signup-form'>
        <h2>Login</h2>
        <label htmlFor='email'>
          Email:
          <input type='text'/>
        </label>
        <label htmlFor='password'>
          Password:
          <input type='password'/>
        </label>
        <button onClick={()=>navigate('/Map')}>Login</button>
        <p>Already Registered?<Link to='/SignUpForm'>Sign-Up</Link> </p>
      </form>
    </div>
  )
}

export default SignUpForm
