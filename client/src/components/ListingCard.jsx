import { Link } from "react-router-dom";
import { MdLocationOn } from 'react-icons/md';
import { capitalize, pluralize } from "../utils/helper";

function ListingCard({ listing }) {
  const defaultImg = import.meta.env.VITE_DEFAULT_HOUSE_IMAGE;

  return (
    <div className="bg-white shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden rounded-2xl w-full sm:w-[320px] border-t-2 border-white">
      <Link to={`/listing/${listing._id}`} className="" >
        <img src={listing.imageUrls[0] || defaultImg} alt="listing cover" className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300" />
        <div className="p-3 flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-slate-700 truncate">{capitalize(listing.title, 'in', 'with')}</h3>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate">{listing.address}</p>
          </div>
          <p className="line-clamp-2 text-sm text-gray-600">{listing.description}</p>
          <p className="mt-2 font-semibold text-slate-500">
            ${listing.isOffer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className="flex gap-4 text-slate-700 font-bold text-xs">
            <div className="">
              {listing.bedrooms} {pluralize(listing.bedrooms, 'bed')}
            </div>
            <div className="">
              {listing.bathrooms} {pluralize(listing.bathrooms, 'bath')}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ListingCard
