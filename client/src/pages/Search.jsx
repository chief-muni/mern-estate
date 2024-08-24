function Search() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-4 sm:p-7 border-b-2 md:border-r-2 md:border-b-0 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap" htmlFor="searchTerm">Search Term:</label>
            <input type="text" 
              id="searchTerm" 
              className="search"
              placeholder="Search..."
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label htmlFor="type">Type</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="isOffer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label htmlFor="amenities">Amenities</label>
            <div className="flex gap-2">
              <input type="checkbox"  id="hasParking" />
              <span>Car Park</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox"  id="isFurnished" />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort">Sort</label>
            <select id="sort_order">
              <option value="">Price high to low</option>
              <option value="">Price low to high</option>
              <option value="">Latest</option>
              <option value="">oldest </option>
            </select>
          </div>
          <button type="submit" className="mb-7">Search</button>
        </form>
      </div>
      <div className="p-4 sm:p-7">
        <h1 className="text-3xl font-semibold border-b pb-3 mt-5 sm:mt-0 text-slate-700">Listing results</h1>
      </div>
    </div>
  )
}

export default Search