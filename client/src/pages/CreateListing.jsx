function CreateListing() {
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
          <div className="flex gap-3 mb-4">
            <input type="file" id="images" accept="image/*" multiple className="border border-gray-300 p-3 rounded-lg" />
            <button type="button" className="add p-3 bg-transparent border border-green-700 text-green-700 uppercase hover:text-white hover:bg-green-700 rounded-lg transition-all duration-300">Upload</button>
          </div>
          <button type="submit">Create Listing</button>
        </div>
      </form>
    </main>
  )
}

export default CreateListing
