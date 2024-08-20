import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

function CreateListing() {
  const
    [files, setFiles] = useState([]),
    [imageUploadError, setImageUploadError] = useState(false),
    [isUploading, setIsUploading] = useState(false),
    [formData, setFormData] = useState({
      imageUrls: [],
    })
  ;
  console.log(formData);

  const handleImageUpload = (e) => {
    if(files.length > 1 && files.length + formData.imageUrls.length < 7) {
      setIsUploading(true);
      setImageUploadError(false);

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]))
      }
      Promise.all(promises).then((urls) => {
        setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
        setImageUploadError(false);
        setIsUploading(false);
      }).catch(err => {
        setImageUploadError(`Image upload failed (2mb max per image)`);
        setIsUploading(false)
      });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setIsUploading(false)
    }
  }

  const storeImage = async(file) => {
    return new Promise((resolve, reject) => {
      const 
        storage = getStorage(app),
        fileName = new Date().getTime() + file.name,
        storageRef = ref(storage, fileName),
        uploadTask = uploadBytesResumable(storageRef, file)
      ;
      uploadTask.on('state_changed', null, (error) => { // null to replace snapshot
        reject(error);
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        })
      })
    })
  }

  const handleRemoveImage = (index) => {
    setFormData({ ...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index )})
  }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a listing</h1>
      <form className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input type="text" id="name" className="form" 
            placeholder="Name" maxLength="62" minLength="10" required
          />
          <textarea id="description" placeholder="Description" required />
          <input type="text" id="address" className="form" 
            placeholder="Address" required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" />
              <label htmlFor="sale">Sell</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="hasParking" />
              <label htmlFor="hasParking">Parking spot</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="isFurnished" />
              <label htmlFor="isFurnished">Furnished</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="isOffer" />
              <label htmlFor="isOffer">Offer</label>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input type="number" id="bedrooms" 
                min="1" max="10" className="w-20" required
              />
              <label htmlFor="bedrooms">Bedrooms</label>
            </div>
            <div className="flex gap-2 items-center">
              <input type="number" id="bathrooms" 
                min="1" max="10" className="w-20" required
              />
              <label htmlFor="bathrooms">Bathrooms</label>
            </div>
            <div className="flex gap-2 items-center">
              <input type="number" id="regularPrice" 
                min="1" max="10" className="w-36" required
              />
              <div className="flex flex-col items-center justify-center">
                <label htmlFor="regularPrice">Regular Price</label>
                <span className="text-sm">($ / Month)</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input type="number" id="discountPrice" 
                min="1" max="10" className="w-36" required
              />
              <div className="flex flex-col items-center justify-center">
                <label htmlFor="discountPrice">Discounted Price</label>
                <span className="text-sm">($ / Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">Images: <span className="ml-1 font-normal text-gray-600">the first image will be the cover. (max 6)</span></p>
          <div className="flex gap-3">
            <input type="file" 
              onChange={e => setFiles(e.target.files)}
              className="border border-gray-300 p-3 rounded-lg" 
              id="images" accept="image/*" multiple 
            />
            <button type="button" 
              onClick={handleImageUpload}
              disabled={isUploading}
              className="add p-3 bg-transparent border border-green-700 text-green-700 uppercase hover:text-white hover:bg-green-700 rounded-lg transition-all duration-300"
            >{isUploading ? 'Uploading...': 'Upload'}</button>
          </div>
          {imageUploadError && <p className="text-red-700 text-sm">{imageUploadError}</p>}
          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div className="flex justify-between items-center border p-3 rounded-lg"  key={url}>
                <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                <button type="button" 
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75 font-medium"
                >Delete</button>
              </div>
            ))
          }
          <button type="submit" className="mt-4" disabled={isUploading}>Create Listing</button>
        </div>
      </form>
    </main>
  )
}

export default CreateListing
