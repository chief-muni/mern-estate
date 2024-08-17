import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from "../redux/user/userSlice";
import axios from "axios";

function Profile() {
  const 
    { currentUser, loading, error } = useSelector(state => state.user),
    dispatch = useDispatch(),
    fileRef = useRef(null),
    [file, setFile] = useState(undefined),
    [uploadProgress, setUploadProgress] = useState(0),
    [uploadError, setUploadError] = useState(false),
    [formData, setFormData] = useState({}),
    [updateSuccess, setUpdateSuccess] = useState(false)
  ;
  // console.log(formData);
  // console.log(currentUser);
  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const 
      storage  = getStorage(app),
      fileName = new Date().getTime() + file.name,
      storageRef = ref(storage, fileName),
      uploadTask = uploadBytesResumable(storageRef, file)
    ;
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadProgress(progress);
    }, (error) => { // callback on error
      console.warn(error);
      setUploadError(true);
    }, () => {      // callback on complete
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        // console.log(`file available at - ${downloadURL}`);
        setFormData({ ...formData, avatar:downloadURL });
      })
    });
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      setUpdateSuccess(false);
      const { data } = await axios.patch(`/user/update/${currentUser._id}`, formData);
      // if(!data) throw new Error(`User update failed`);
      if(data.success === false) {
        dispatch(updateUserFailure(data.message));   // here data represents error
      }
      // console.log(data);
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch(error) {
      setUpdateSuccess(false);
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDeleteUser = async() => {
    const confirm = window.confirm('Are you sure you want to delete your account');
    if(!confirm) return;
    try {
      dispatch(deleteUserStart());
      const { data } = await axios.delete(`/user/delete/${currentUser._id}`);
      if(data.success === false) {
        dispatch(deleteUserFailure(error.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch(error) {
      dispatch(deleteUserFailure(error.message))
    }
  };

  const handleSignOut = async() => {
    const confirm = window.confirm('Are you sure you want to Logout');
    if(!confirm) return;
    try {
      dispatch(signOutUserStart());
      await axios.get('auth/sign-out');
      dispatch(signOutUserSuccess());
    } catch(error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" 
          onChange={e => setFile(e.target.files[0])}
          ref={fileRef} id="photo" 
          hidden accept="image/*" 
        />
        <img 
          onClick={() => fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar}
          alt={`${currentUser.username} photo`} 
          className="w-24 h-24 self-center mt-2 rounded-full object-cover cursor-pointer border border-gray-400 hover:border-dashed"
        />
        <div className="flex justify-center gap-1">
          <p className="text-green-700 font-medium">
            {uploadProgress > 0 && uploadProgress < 100 
              ? `Upload is ${Math.round(uploadProgress)}% complete`
              : uploadProgress === 100 && !uploadError
              ? `Image successfully uploaded!`
              : ''
            }
          </p>
          <p className="text-red-700 font-medium">
            {uploadError  && `Image upload failed, (must be less than 2mb)`}
          </p>
        </div>
        <input type="text" 
          id="username" className="border p-3 rounded-lg"
          onChange={handleChange}
          defaultValue={currentUser.username}
          placeholder="username" 
        />
        <input type="email" 
          id="email" className="border p-3 rounded-lg"
          onChange={handleChange}
          defaultValue={currentUser.email}
          placeholder="email" 
        />
        <input type="password" 
          id="password" className="border p-3 rounded-lg"
          onChange={handleChange}
          placeholder="password" 
        />
        <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Update'}</button>
      </form>
      <div className="flex justify-between mt-7 px-2">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      {error && <p className="text-red-700 font-medium text-center mt-6">{error}</p>}
      {updateSuccess && <p className="text-green-700 font-medium text-center mt-6">Profile updated successully</p>}
      
    </div>
  )
}

export default Profile