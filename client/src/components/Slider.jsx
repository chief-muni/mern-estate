import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Slider({ list }) {
  return (
    <Carousel
        showThumbs={false}
        showIndicators={false}
        showStatus={false}
        autoPlay={true}
        infiniteLoop={true}
        showArrows={false}
        useKeyboardArrows={true}
        swipeable={false}
        interval={5000}
        animationHandler="fade"
      >
        {list.length > 0 && list.map(listing => (
          <div key={listing._id}>
            <img src={listing.imageUrls[0]} alt="offer Listing slide" className="h-[500px] w-full object-cover" />
          </div>
        ))}
      </Carousel>
  )
}

export default Slider