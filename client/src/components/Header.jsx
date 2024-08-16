import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Header() {
  const { currentUser } = useSelector(state => state.user);

  return (
    <header className="bg-slate-200  border-b border-gray-300" >
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="flex flex-wrap font-bold text-sm sm:text-xl">
            <span className="text-slate-500">Real Dev </span>&nbsp;
            <span className="text-slate-700"> Estates</span>
          </h1>
        </Link>
        <form className="flex items-center bg-slate-100 p-3 rounded-lg">
          <input type="text" id="search" 
            className="w-24 sm:w-64 bg-transparent focus:outline-none" 
            placeholder="Search..." 
          />
          <HiMiniMagnifyingGlass />
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