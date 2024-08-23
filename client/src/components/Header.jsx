import { useEffect, useState } from "react";
import { HiHomeModern, HiMiniMagnifyingGlass } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const 
    { currentUser } = useSelector(state => state.user),
    [searchTerm, setSearchTerm] = useState(''),
    navigate = useNavigate()
  ;
  const handleSubmit = (e) => {
    e.preventDefault();
    // Constructing search params
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200  border-b border-gray-300  w-full" >
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="flex flex-wrap items-end font-bold sm:text-xl">
            <HiHomeModern className="text-slate-400 text-3xl" />&nbsp;
            <span className="text-slate-700">RD <span className="hidden sm:inline-block">Estates</span> </span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="flex items-center bg-slate-100 p-3 rounded-lg">
          <input type="text" id="search" 
            className="w-24 sm:w-64 bg-transparent focus:outline-none" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button>
            <HiMiniMagnifyingGlass />
          </button>
        </form>
        <ul className="flex gap-4 items-center">
          <li className="hidden sm:inline text-slate-700 hover:underline hover:underline-offset-4 cursor-pointer"><Link to="/">Home</Link></li>
          <li className="hidden sm:inline text-slate-700 hover:underline hover:underline-offset-4 cursor-pointer"><Link to="/about">About</Link></li>
          {currentUser ? 
            (<Link to="/profile"><img className="w-10 h-10 object-cover rounded-full border hover:shadow-md" src={currentUser.avatar || 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png'} alt="profile" /></Link>) 
            : <li className=" text-slate-700 hover:underline hover:underline-offset-4 cursor-pointer"><Link to="/sign-in">Sign-in</Link></li>
          }
        </ul>
      </div>
    </header>
  )
}

export default Header