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

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
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
            {/* <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App