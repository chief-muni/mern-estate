import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ContactLandlord({ listing, setContact }) {
  const 
    [landlord, setLandlord] = useState(null),
    [message, setMessage] = useState('')
  ;
  useEffect(() => {
    axios.get(`/user/${listing.userRef}`).then(({ data }) => {
      setLandlord(data);
      console.log(data);
    });
  }, [listing.userRef]);
  return <>
    {landlord && 
    <div className="w-full flex flex-col gap-2">
      <h3 className="text-xl my-2">Contact {landlord.username} for <span className="font-semibold">{listing.title.toLowerCase()}</span></h3>
      <textarea 
        id="message" 
        onChange={e => setMessage(e.target.value)}
        className="w-full  border-gray-300" 
        placeholder={`write message here...`}
        rows="3"
      ></textarea>
      <div className="flex justify-between items-center mt-7">
        <button type="reset" 
          className="cancel submit-alt"
          onClick={() => setContact(false)}
        >Cancel</button>
        <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.title}&body=${message}`} className="submit">
          Send Message
        </Link>
      </div>
    </div>
    }
  </>
}

export default ContactLandlord