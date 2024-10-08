import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signInStart, signInSuccess, signUpSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

function SignUpAndSignIn() {
  const
    [formData, setFormData] = useState({}),
    { loading, error } = useSelector(state => state.user),
    [formType, setFormType] = useState('sign-in'),   // or 'sign-up'
    formLabel = formType === 'sign-up' ? `Sign Up` : 'Sign In',
    dispatch = useDispatch(),
    navigate = useNavigate()
  ;

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      dispatch(signInStart());
      const { data } = await axios.post(`/auth/${formType}`, formData);
      if(data.success === false || !data) {
        dispatch(signInFailure(data.message));
        return
      }
      if(formType === 'sign-up') {
        dispatch(signUpSuccess());
        setFormType('sign-in')
      } else {
        dispatch(signInSuccess(data));
        navigate('/')
      }
    } catch(error) {
      dispatch(signInFailure(error.message));
    } 
  };

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
        <button type="submit" disabled={loading}>{loading ? 'Loading...' : formLabel}</button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5 justify-center">
        {formType === 'sign-in' && <>
          <p>Don&apos;t have an account? </p>
          <Link onClick={() => setFormType('sign-up')} className="text-blue-700">Sign up now!</Link>
        </>}
        {formType === 'sign-up' && <>
          <p>Already Have an account?</p>
          <Link onClick={() => setFormType('sign-in')} className="text-blue-700">Sign in</Link>
        </>}
      </div>
      {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
    </div>
  )
}

export default SignUpAndSignIn