import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from "../redux/user/userSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import { HiChevronDoubleDown, HiChevronDoubleUp, HiPencil, HiTrash } from "react-icons/hi2";

function Profile() {
  const 
    { currentUser, loading, error } = useSelector(state => state.user),
    dispatch = useDispatch(),
    fileRef = useRef(null),
    [file, setFile] = useState(undefined),
    [formData, setFormData] = useState({}),
    [uploadProgress, setUploadProgress] = useState(0),
    [uploadError, setUploadError] = useState(false),
    [listings, setListings] = useState([]),
    [listingsError, setListingsError] = useState(false),
    [listingsLoading, setListingsLoading] = useState(false),
    [listingsVisibility, setListingsVisibility] = useState(false),
    [updateSuccess, setUpdateSuccess] = useState(false)
  ;
  
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
      // for tracking file upload progress
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
    const confirm = window.confirm('Are you sure you want to delete your account?');
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

  const handleShowListings = async() => {
    try {
      setListingsLoading(true);
      setListingsError(false);
      const { data } = await axios.get(`/user/listings/${currentUser._id}`);
      setListingsLoading(false);
      setListingsVisibility(true);
      if(!data) {
        return setListingsError(true);
      }
      setListings(data);
    } catch(error) {
      setListingsError(true);
      setListingsLoading(false);
    }
  }

  const handleListingDelete = async(id) => {
    try {
      await axios.delete(`/listing/delete/${id}`);
      setListings(prev => prev.filter(listing => listing._id !== id));
    } catch (error) {
      console.warn(error.message);
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
        <Link to="/create-listing" className="add">Create Listing</Link>
      </form>
      <div className="flex justify-between mt-7 px-2">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      {error && <p className="text-red-700 font-medium text-center mt-6">{error}</p>}
      {updateSuccess && <p className="text-green-700 font-medium text-center mt-6">Profile updated successully</p>}
      {listingsVisibility 
        ? <button type="button" onClick={() => setListingsVisibility(false)} disabled={listingsLoading} className="submit-alt w-full my-6"><HiChevronDoubleUp />Hide listings<HiChevronDoubleUp /></button>
        : <button type="button" onClick={handleShowListings} disabled={listingsLoading} className="submit-alt w-full my-6"><HiChevronDoubleDown />{listingsLoading ? 'Loading':'Show listings'}<HiChevronDoubleDown /></button>
      }

      {listingsError && <p className="text-red-700 font-medium text-center mt-6">Error showing listings</p>}
      
      {listingsVisibility && listings.length > 0 && <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-center mt-7">My Listings</h2>
        {listings.map(listing => (
          <div key={listing._id} className="flex gap-3 justify-between items-center p-3 border rounded-lg hover:shadow-md">
            <Link to={`/listing/${listing._id}`}>
              <img 
                src={listing.imageUrls[0]} alt="listing cover" 
                className="w-16 h-16 object-contain" 
              />
            </Link>
            <Link to={`/listing/${listing._id}`} className="flex-1 text-slate-700 truncate hover:underline hover:underline-offset-4">
              <p>{listing.title}</p>
            </Link>
            <div className="flex gap-3 ml-2">
              <button type="button"
                onClick={() => handleListingDelete(listing._id)}
                className="p-2 text-red-700 border border-red-700 rounded-md hover:text-white hover:bg-red-700"
              ><HiTrash /></button>
              <button type="button" 
                className="p-2 text-slate-700 border border-slate-700 rounded-md hover:text-white hover:bg-slate-700"
              ><HiPencil /></button>
            </div>
          </div>
        ))}
      </div>}
    </div>
  )
}

export default Profile