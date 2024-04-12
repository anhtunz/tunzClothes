import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import "@fortawesome/fontawesome-free/css/all.min.css";
import MenClothes from './components/men/MenClothes';
import WomenClothes from './components/women/WomenClothes';
import HomePage from './components/Home';
import LoginPage from './layout/login/login';
import SignUpPage from './layout/signup';
import CategoryPage from './components/Category';
import SearchPage from './pages/seachPage';
import DetailsClothes from './components/Detail/Details';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route
            path='collection'
            element={<MenClothes />}
          />
          <Route path='collection/:categoryID' element={<CategoryPage />}></Route>
          <Route path='search/:query' element={<SearchPage />}></Route>
          <Route path='products/:productID' element={<DetailsClothes />}></Route>
          <Route index element={<HomePage />} />
        </Route>
        <Route path='login' element={<LoginPage />}></Route>
        <Route path='register' element={<SignUpPage />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
