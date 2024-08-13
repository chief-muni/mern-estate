import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"

function SignUp() {
  const
    [formData, setFormData] = useState({}),
    [error, setError] = useState(null),
    [isLoading, setIsLoading] = useState(false),
    navigate = useNavigate()
  ;
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      setIsLoading(true);
      // setError(null);
      // const { data } = await axios.post(`/auth/sign-up`, formData);
      const res = await fetch('/api/v1/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if(data.success === false) {
        setError(data.message);
        setIsLoading(false);
        return
      }
      console.log({ data });
      setIsLoading(false);
      navigate('/sign-in')
      setError(null);
    } catch(error) {
      setIsLoading(false);
      setError(error.message);
    } 
  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="text" id="username" className="border p-3 rounded-lg" placeholder="username" 
          onChange={handleChange}
        />
        <input 
          type="email" id="email" className="border p-3 rounded-lg" placeholder="email" 
          onChange={handleChange}
        />
        <input 
          type="password" id="password" className="border p-3 rounded-lg" placeholder="password" 
          onChange={handleChange}
        />
        <button type="submit" disabled={isLoading}>{isLoading ? 'Creating ...' : 'Sign Up'}</button>
      </form>
      <div className="flex gap-2 mt-5 justify-center">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
    </div>
  )
}

export default SignUp