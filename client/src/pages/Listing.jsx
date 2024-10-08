import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ContactLandlord from "../components/ContactLandlord";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';

function Listing() {
  const
    { id:listingId } = useParams(),
    [listing, setListing] = useState(null),
    [isLoading, setIsLoading] = useState(false),
    [error, setError] = useState(false),
    [copied, setCopied] = useState(false),
    [contact, setContact] = useState(false),
    { currentUser } = useSelector(state => state.user)
  ;

  const loadListing = () => {
    setError(false);
    setIsLoading(true);
    axios.get(`/listing/${listingId}`).then(({ data }) => {
      setListing(data);
      setIsLoading(false);
    }).catch((err) => {
      setError(true);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    loadListing();
  }, [listingId]);

  return (
    <main>
      {isLoading && <p className="text-center my-7 text-2xl" >Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl w-full mx-auto" >Something went wrong <button type="button" onClick={loadListing} className="underline">Please try again</button><br /><br />
          <Link to="/" className="text-lg text-red-700 hover:underline">&larr; Go Home</Link>
        </p>
      )}

      {listing && !isLoading && !error && (<div>
        <Carousel
          showThumbs={false}
          showIndicators={true}
          showStatus={false}
          autoPlay={true}
          infiniteLoop={true}
          showArrows={false}
          useKeyboardArrows={true}
          swipeable={false}
          interval={5000}
          animationHandler="fade"
        >
          {listing.imageUrls.map(url => (<div key={url}>
            {/* <div className="h-[60vh] max-h-dvh bg-cover" style={{ background: `url(${url}) center no-repeat` }} key={url}></div> */}
            <img src={url} className="h-[600px] object-cover" alt="listing slide"/>
            </div>
          ))}
        </Carousel>
        <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
          <FaShare
            className='text-slate-500'
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          />
        </div>
        {copied && (
          <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
            Link copied!
          </p>
        )}
        <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.title} - ${' '}
              {listing.isOffer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.isOffer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-US')} (Off)
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && currentUser._id !== listing.userRef && !contact && (
              <button type="button" 
                className="submit"
                onClick={() => setContact(true)}
              >Contact Landlord</button>
            )}
            {contact && <ContactLandlord listing={listing} setContact={setContact} />}
          </div>

      </div>
      )}
    </main>
  )
}

export default Listing;