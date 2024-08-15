import { useSelector } from "react-redux"

function Profile() {
  const { currentUser } = useSelector(state => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img src={currentUser.avatar || 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png'} alt={`${currentUser.username} photo`} className="w-24 h-24 self-center mt-2 rounded-full object-cover cursor-pointer" />
        <input type="text" id="username" className="border p-3 rounded-lg" placeholder="username" />
        <input type="email" id="email" className="border p-3 rounded-lg" placeholder="email" />
        <input type="password" id="password" className="border p-3 rounded-lg" placeholder="password" />
        <button type="submit">Update</button>
      </form>
    </div>
  )
}

export default Profile