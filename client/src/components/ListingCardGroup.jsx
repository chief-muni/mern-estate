import { Link } from "react-router-dom";
import ListingCard from "./ListingCard";

function ListingCardGroup({ list, label='Offers', search='isOffer=true' }) {
  return (
    <div className="container flex flex-col gap-8 my-10 p-3 md:px-0">
      {list.length > 0 && (
        <div className="">
          <div className="my-3">
            <h2 className="text-2xl text-slate-600 font-semibold">Recent {label}</h2>
            <Link to={`/search?${search}`} className="link-text">Show more {label}</Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {list.map(listing => (<ListingCard listing={listing} key={listing._id} />))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ListingCardGroup