import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import Home from './pages/Home';
import SignUpAndSignIn from './pages/SignUpAndSignIn';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" index element={<Home />}  />
          <Route path="/sign-in" element={<SignUpAndSignIn />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
