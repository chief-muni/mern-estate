import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";

function Profile() {
  const 
    { currentUser } = useSelector(state => state.user),
    fileRef = useRef(null),
    [file, setFile] = useState(undefined),
    [uploadProgress, setUploadProgress] = useState(0),
    [uploadError, setUploadError] = useState(false),
    [formData, setFormData] = useState({})
  ;
  // console.log(formData);
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
      // console.log(`Upload is ${progress}% done`);
    }, (error) => { // callback on error
      console.warn(error);  //DELETE:
      setUploadError(true);
    }, () => {      // callback on complete
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log(`file available at - ${downloadURL}`);  //DELETE:
        setFormData({ ...formData, avatar:downloadURL });
      })
    });
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input type="file" 
          onChange={e => setFile(e.target.files[0])}
          ref={fileRef} id="photo" 
          hidden accept="image/*" 
        />
        <img 
          onClick={() => fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar || 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png'}
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
        <input type="text" id="username" className="border p-3 rounded-lg" placeholder="username" />
        <input type="email" id="email" className="border p-3 rounded-lg" placeholder="email" />
        <input type="password" id="password" className="border p-3 rounded-lg" placeholder="password" />
        <button type="submit">Update</button>
      </form>
      <div className="flex justify-between mt-7 px-2">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  )
}

export default Profile