import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper";
// import SwiperCore from 'swiper';
import Swiper from "swiper";
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function Listing() {
  const
    { id:listingId } = useParams(),
    [listing, setListing] = useState(null),
    [isLoading, setIsLoading] = useState(false),
    [error, setError] = useState(false)
  ;
  const swiper = new Swiper('.swiper', {
    modules: [Navigation],
    direction: 'horizontal',
    loop: true,
  });

  // SwiperCore.use([Navigation]);

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
  console.log(listing);

  return (
    <main>
      {isLoading && <p className="text-center my-7 text-2xl" >Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl w-full mx-auto" >Something went wrong <button type="button" onClick={loadListing} className="underline">Please try again</button><br /><br />
          <Link to="/" className="text-lg text-red-700 hover:underline">&larr; Go Home</Link>
        </p>
      )}

      {listing && !isLoading && !error && (<>
        <div className="swiper w-full h-[300px]">
          <div className="swiper-wrapper">
            {listing.imageUrls.map(url => (
              <div className="swiper-slide bg-cover" style={{ background: `url(${url}) center no-repeat` }} key={url}>
              </div>
            ))}
          </div>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>
        <h1 className="text-3xl text-center mt-10">{listing.title}</h1>
      </>
      )}
    </main>
  )
}

export default Listing;