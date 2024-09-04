import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

function OAuth() {
  const 
    dispatch = useDispatch(),
    navigate = useNavigate()
  ;

  const handleGoogleClick = async() => {
    try{
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      // console.log(result);
      const { displayName, email, photoURL } = result.user;
      const { data } = await axios.post('/auth/google', { name: displayName, email, photo: photoURL });
      dispatch(signInSuccess(data));
      navigate('/');
      console.log(data);
    } catch(error) {
      console.log('Could not sign in with google', error);
    }
  }

  return (
    <button 
      type="button" 
      className="google"
      onClick={handleGoogleClick}
    >Continue with Google</button>
  )
}

export default OAuth