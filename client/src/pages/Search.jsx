import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import { HiChevronDoubleDown } from "react-icons/hi2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Search() {
  const 
    [loading, setLoading] = useState(false),
    [loadingMore, setLoadingMore] = useState(false),
    [error, setError] = useState(false),
    [listings, setListings] = useState([]),
    [showMore, setShowMore] = useState(false),
    navigate = useNavigate(),
    pageCount = 9
  ;
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    sort: 'createdAt',
    order: 'desc',
    hasParking: false,
    isFurnished: false,
    isOffer: false
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const 
      searchTermFromUrl = urlParams.get('searchTerm'),
      typeFromUrl = urlParams.get('type'),
      sortFromUrl = urlParams.get('sort'),
      orderFromUrl = urlParams.get('order'),
      hasParkingFromUrl = urlParams.get('hasParking'),
      isFurnishedFromUrl = urlParams.get('isFurnished'),
      isOfferFromUrl = urlParams.get('isOffer')
    ;
    if(
      searchTermFromUrl ||
      typeFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      hasParkingFromUrl ||
      isFurnishedFromUrl ||
      isOfferFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
        hasParking: hasParkingFromUrl === 'true' ? true : false,
        isFurnished: isFurnishedFromUrl === 'true' ? true : false,
        isOffer: isOfferFromUrl === 'true' ? true : false
      });
    };

    const fetchListings = async() => {
      try {
        setLoading(true);
        setError(false);
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const { data } = await axios.get(`/listing?${searchQuery}`);
        if(!data || data.length < 1) {
          setLoading(false);
          setListings([]);
          return setError(true); 
        }
        if(data.length > pageCount - 1) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings(data);
        setLoading(false)
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    }
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }
    if(e.target.id === 'searchTerm') { 
      setSidebarData({ ...sidebarData, searchTerm: e.target.value }) 
    }
    if(e.target.id === 'hasParking' || e.target.id === 'isFurnished' || e.target.id === 'isOffer') {
      setSidebarData({ ...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false });  // this is to ensure urlParams still pass as booleans from string.
    }
    if(e.target.id === 'sort_order') {
      const
        sort = e.target.value.split('_')[0] || 'createdAt',
        order = e.target.value.split('_')[1] || 'desc'
      ;
      setSidebarData({ ...sidebarData, sort, order })
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Populate URL
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('type', sidebarData.type);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);
    urlParams.set('isOffer', sidebarData.isOffer);
    urlParams.set('hasParking', sidebarData.hasParking);
    urlParams.set('isFurnished', sidebarData.isFurnished);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  const onShowMoreClick = async() => {
    setLoadingMore(true);
    setShowMore(false);
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const { data } = await axios.get(`/listing?${searchQuery}`);
    setLoadingMore(false);
    if(data.length < pageCount) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  }
 
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-4 sm:p-7 border-b-2 md:border-r-2 md:border-b-0 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap" htmlFor="searchTerm">Search Term:</label>
            <input type="text" 
              id="searchTerm" 
              className="search"
              placeholder="Search..."
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label htmlFor="type">Type</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" 
                onChange={handleChange}
                checked={sidebarData.type === 'all'}
              />
              <label htmlFor="all" className="font-normal">Rent & Sale</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" 
                onChange={handleChange}
                checked={sidebarData.type === 'rent'}
              />
              <label htmlFor="rent" className="font-normal">Rent</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" 
                onChange={handleChange}
                checked={sidebarData.type === 'sale'}
              />
              <label htmlFor="sale" className="font-normal">Sale</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="isOffer" 
                onChange={handleChange}
                checked={sidebarData.isOffer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label htmlFor="amenities">Amenities</label>
            <div className="flex gap-2">
              <input type="checkbox"  id="hasParking" 
                onChange={handleChange}
                checked={sidebarData.hasParking}
              />
              <span>Car Park</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox"  id="isFurnished" 
                onChange={handleChange}
                checked={sidebarData.isFurnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort">Sort</label>
            <select id="sort_order"
              onChange={handleChange}
              defaultValue={'createdAt_desc'}
            >
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">oldest </option>
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
            </select>
          </div>
          <button type="submit" className="mb-7">Search</button>
        </form>
      </div>
      <div className="p-4 sm:p-7 relative flex-1 ">
        <h1 className="text-3xl font-semibold border-b pb-3 my-5 sm:mt-0 text-slate-700">Listing results</h1>
        <div className="flex gap-4 flex-wrap">
          {loading && <div className="w-full h-full flex justify-center items-center"><div className="loader"></div></div> }
          {error && <p className="text-xl text-red-700 my-7">⛔️ Sorry no listings found, please adjust your search filter</p>}
          {!loading && listings.length > 0 && listings.map(listing => <ListingCard listing={listing} key={listing._id} />)}
          {showMore && (
            <button type="button"
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full flex items-center justify-center"
            >Show more&nbsp;<HiChevronDoubleDown /></button>
          )}
          {loadingMore && (
            <div className="flex w-full text-2xl text-green-700 p-7 justify-center">
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search