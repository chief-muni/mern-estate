import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"

function SignUpAndSignIn() {
  const
    [formData, setFormData] = useState({}),
    [error, setError] = useState(null),
    [isLoading, setIsLoading] = useState(false),
    [formType, setFormType] = useState('sign-in'),   // or 'sign-up'
    navigate = useNavigate()
  ;
  const formLabel = formType === 'sign-up' ? `Sign Up` : 'Sign In';
  
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      setIsLoading(true);
      // const { data } = await axios.post(`/auth/${formType}`, formData);
      const res = await fetch(`/api/v1/auth/${formType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      // console.log(data);
      if(data.success === false) {
        setError(data.message);
        setIsLoading(false);
        return
      }
      setIsLoading(false);
      if(formType === 'sign-up') {
        setFormType('sign-in')
      } else {
        navigate('/')
      }
      setError(null);
    } catch(error) {
      setIsLoading(false);
      setError(error.message);
    } 
  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">{formLabel}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {formType === 'sign-up' && <input 
          type="text" id="username" className="border p-3 rounded-lg" placeholder="username" 
          onChange={handleChange}
        />}
        <input 
          type="email" id="email" className="border p-3 rounded-lg" placeholder="email" 
          onChange={handleChange}
        />
        <input 
          type="password" id="password" className="border p-3 rounded-lg" placeholder="password" 
          onChange={handleChange}
        />
        <button type="submit" disabled={isLoading}>{isLoading ? 'Loading...' : formLabel}</button>
      </form>
      <div className="flex gap-2 mt-5 justify-center">
        {formType === 'sign-in' && <>
          <p>Don&apos;t have an account? </p>
          {/* <Link to="/sign-in"></Link> */}
          <Link onClick={() => setFormType('sign-up')} className="text-blue-700">Sign up now!</Link>
        </>}
        {formType === 'sign-up' && <>
          <p>Already Have an account?</p>
          {/* <Link to="/sign-in"></Link> */}
          <Link onClick={() => setFormType('sign-in')} className="text-blue-700">Sign in</Link>
        </>}
      </div>
      {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
    </div>
  )
}

export default SignUpAndSignIn;