import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { persistor, store } from './redux/store';
import { Provider } from 'react-redux';
import Home from './pages/Home';
import SignUpAndSignIn from './pages/SignUpAndSignIn';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import { PersistGate } from 'redux-persist/integration/react';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';

const isDevMode = import.meta.env.VITE_NODE_ENV === 'development';
// console.log(isDevMode);

axios.defaults.baseURL = isDevMode ? import.meta.env.VITE_API_URL : 'http://localhost:5000/api/v1';
axios.defaults.withCredentials = true;

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} >
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" index element={<Home />}  />
            <Route path="/sign-in" element={<SignUpAndSignIn />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<Search />} />
            <Route path="/listing/:id" element={<Listing />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/update-listing/:id" element={<UpdateListing />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App