import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../src/fontwaesome/css/all.css'
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import "@fortawesome/fontawesome-free/css/all.min.css";
import MenClothes from './components/men/MenClothes';
import HomePage from './components/Home';
import LoginPage from './layout/login/login';
import SignUpPage from './layout/signup';
import CategoryPage from './components/Category';
import SearchPage from './pages/seachPage';
import DetailsClothes from './components/Detail/Details';
import AdminLayout from './admin/Admin';
import AddUserPage from './admin/AddUser';
import ManageUserPage from './admin/ManageUser';
import Logout from './layout/logout';
import ProfilePage from './components/profile/profile';
import ChangePass from './components/profile/ChangePass';
import ChangeProfilePage from './components/profile/ChangeProfile';
import AddProductPage from './admin/AddProduct';
import ManageProductPage from './admin/ManageProduct';
import CheckoutPage from './components/Checkout';
import HistoryPurchasePage from './components/profile/HistoryPurchase';
import ManageOrderPage from './admin/ManageOrder';
import ManageSuccessfulBillsOrderPage from './admin/ManageSuccessfulOrders';
import ManageStatisticalPage from './admin/ManageStatistical';

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
          <Route index element={<HomePage />} />
          <Route path='products/:productID' element={<DetailsClothes />}></Route>
          <Route path='user' element={<ProfilePage />}>
            <Route path='change-pass' index element={<ChangePass />}></Route>
            <Route path='change-pass' index element={<ChangePass />}></Route>
            <Route path='history-purchase' element={<HistoryPurchasePage />}></Route>
          </Route>
          <Route path='user/profile' element={<ChangeProfilePage />} ></Route>
          <Route path='checkout' element={<CheckoutPage />} ></Route>
        </Route>
        <Route path='manage-page' element={<AdminLayout />}>
          <Route path='add-new-user' element={<AddUserPage />} ></Route>
          <Route path='manage-user' element={<ManageUserPage />} ></Route>
          <Route path='add-new-product' element={<AddProductPage />} ></Route>
          <Route path='manage-product' element={<ManageProductPage />} ></Route>
          <Route path='manage-order' element={<ManageOrderPage />} ></Route>
          <Route path='manage-success-bills' element={<ManageSuccessfulBillsOrderPage />} ></Route>
          <Route path='manage-statistical' element={<ManageStatisticalPage />} ></Route>
        </Route>

        <Route path='login' element={<LoginPage />}></Route>
        <Route path='logout' element={<Logout />}></Route>
        <Route path='register' element={<SignUpPage />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
