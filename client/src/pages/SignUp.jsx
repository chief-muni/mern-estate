import { Link } from "react-router-dom"

function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input type="text" id="username" className="border p-3 rounded-lg" placeholder="username" />
        <input type="email" id="email" className="border p-3 rounded-lg" placeholder="email" />
        <input type="password" id="password" className="border p-3 rounded-lg" placeholder="password" />
        <button type="submit">Sign Up</button>
      </form>
      <div className="flex gap-2 mt-5 justify-center">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  )
}

export default SignUp