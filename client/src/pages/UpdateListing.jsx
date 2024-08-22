import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdateListing() {
  const
    navigate = useNavigate(),
    [files, setFiles] = useState([]),
    [imageUploadError, setImageUploadError] = useState(false),
    [isUploading, setIsUploading] = useState(false),
    [error, setError] = useState(false),
    [isLoading, setIsLoading] = useState(false),
    { id:listingId } = useParams()
  ;
  const [formData, setFormData] = useState({
    imageUrls: [],
    title: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    isOffer: false,
    isFurnished: false,
    hasParking: false,
  });
  
  useEffect(() => {
    axios.get(`/listing/${listingId}`).then(({ data }) => setFormData(data));
  }, [listingId]);

  const handleImageUpload = () => {
    if(files.length > 0 && files.length + formData.imageUrls.length < 7) {
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
      }).catch((err) => {
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

  const handleChange = (e) => {
    // console.log({target: e.target.type});
    if(e.target.id === 'rent' || e.target.id === 'sale') {
      return setFormData({ ...formData, type: e.target.id });
    }
    if(e.target.type === 'checkbox') {
      return setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if(e.target.type === 'number') {
      return setFormData({ ...formData, [e.target.id]: parseInt(e.target.value) })
    }
    if(e.target.type === 'text' || e.target.type === 'textarea') {
      return setFormData({ ...formData, [e.target.id]: e.target.value })
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError(false);
    try {
      if(formData.regularPrice <= formData.discountPrice) return setError('Discount price must be lower than the regular price');
      if(formData.imageUrls.length < 1) return setError('You must upload at least one image');
      setIsLoading(true);
      setError(false);
      const { data } = await axios.patch(`/listing/update/${listingId}`, formData);
      setIsLoading(false);
      if(!data) {
        return setError('Listing could not be created');
      }
      // console.log(data);
      navigate(`/listing/${data._id}`);
    } catch(error) {
      setError(error.message);
      setIsLoading(false);
    }
  }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Update listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input type="text" id="title" className="form" 
            onChange={handleChange}
            value={formData.title}
            placeholder="Title" maxLength="62" minLength="10" required
          />
          <textarea 
            onChange={handleChange}
            value={formData.description}
            id="description" placeholder="Description" required 
          />
          <input type="text" id="address" className="form"
            onChange={handleChange}
            value={formData.address}
            placeholder="Address" required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input 
                type="checkbox" id="sale"
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <label htmlFor="sale">Sell</label>
            </div>
            <div className="flex gap-2">
              <input 
                type="checkbox" id="rent"
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input 
                type="checkbox" id="hasParking"
                onChange={handleChange}
                checked={formData.hasParking}
              />
              <label htmlFor="hasParking">Parking spot</label>
            </div>
            <div className="flex gap-2">
              <input 
                type="checkbox" id="isFurnished"
                onChange={handleChange}
                checked={formData.isFurnished}
              />
              <label htmlFor="isFurnished">Furnished</label>
            </div>
            <div className="flex gap-2">
              <input 
                type="checkbox" id="isOffer"
                onChange={handleChange}
                checked={formData.isOffer}
              />
              <label htmlFor="isOffer">Offer</label>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input 
                type="number" id="bedrooms"
                onChange={handleChange}
                value={formData.bedrooms}
                min="1" max="10" className="w-20" required
              />
              <label htmlFor="bedrooms">Bedrooms</label>
            </div>
            <div className="flex gap-2 items-center">
              <input 
                type="number" id="bathrooms"
                onChange={handleChange}
                value={formData.bathrooms}
                min="1" max="10" className="w-20" required
              />
              <label htmlFor="bathrooms">Bathrooms</label>
            </div>
            <div className="flex gap-2 items-center">
              <input 
                type="number" id="regularPrice"
                onChange={handleChange}
                value={formData.regularPrice}
                min="50" max="100000000" 
                className="w-36" required
              />
              <div className="flex flex-col items-center justify-center">
                <label htmlFor="regularPrice">Regular Price</label>
                {formData.type === 'rent' && <span className="text-sm">($ / Month)</span>}
              </div>
            </div>
            {formData.isOffer && (
              <div className="flex gap-2 items-center">
                <input 
                  type="number" id="discountPrice"
                  onChange={handleChange}
                  value={formData.discountPrice}
                  min="0" max="100000000" 
                  className="w-36" required
                />
                <div className="flex flex-col items-center justify-center">
                  <label htmlFor="discountPrice">Discounted Price</label>
                  {formData.type === 'rent' && <span className="text-sm">($ / Month)</span>}
                </div>
              </div>
            )}
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
              className="add-alt"
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
          <button type="submit" className="mt-4" disabled={isLoading || isUploading}>{isLoading ? 'Updating...' : `Update Listing`}</button>
          {error && <p className="text-red-700 text-sm">{error}</p> }
        </div>
      </form>
    </main>
  )
}

export default UpdateListing