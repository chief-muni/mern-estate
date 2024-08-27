import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import Slider from "../components/Slider";
import ListingCardGroup from "../components/ListingCardGroup";

function Home() {
  const
    [offerListings, setOfferListings] = useState([]),
    [saleListings, setSaleListings] = useState([]),
    [rentListings, setRentListings] = useState([])
  ;

  useEffect(() => {
    const fetchOfferListings = async() => {
      try {
        const { data } = await axios.get('/listing?isOffer=true&limit=4');
        setOfferListings(data);
        // Cascading data delivery by embedding function calls
        fetchRentListings();
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async() => {
      try {
        const { data } = await axios.get('/listing?type=rent&limit=4');
        setRentListings(data);
        // console.log({rent: data});
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListings = async() => {
      try {
        const { data } = await axios.get('/listing?type=sale&limit=4');
        setSaleListings(data);
        // console.log({sale: data});
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-6xl text-slate-700 font-bold">Find your next <span className="text-slate-500">perfect</span><br />
        home with ease</h1>
        <div className="text-gray-500 text-xs sm:text-sm">
          RD&apos;s New Horizon Estate is the best place to find a space to call home
          <br />
          We have a wide range of properties for you to choose from
        </div>
        <Link to="/search" className="link-text">Find your home</Link>
      </div>
      <Slider list={offerListings} />
      <ListingCardGroup list={offerListings} label="Offers" search="isOffer=true" />
      <Slider list={rentListings} />
      <ListingCardGroup list={rentListings} label="Rentals" search="type=rent" />
      <Slider list={saleListings} />
      <ListingCardGroup list={saleListings} label="Sales" search="type=sale" />
    </div>
  )
}

export default Home
