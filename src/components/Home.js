import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Notification from './toast';
import CaroselHomePage from './home/carosel';
import ClothesList from './home/ListClothes/List_Clothes';
import ClothesTabs from './home/ListClothes/ClothesTabs';
import ChatDialog from './Chat';
import { getAllCatergory, getAllChildCategory, getUserData, getTop4ProductsBySold } from "../APi";

function HomePage() {
  const location = useLocation();
  const successState = location.state?.successLogin;
  console.log(successState);

  useEffect(() => {
    if (successState) {
      const type = 'success';
      toast('Đăng nhập thành công', {
        type: type
      });
    }
  }, [location.state]);
  const [top4Product, setTop4Product] = useState([])
  useEffect(() => {
    async function fetchData() {
      const top4Product = await getTop4ProductsBySold();
      setTop4Product(top4Product)
    }
    fetchData();
  },[])
  return (
    <div>
      {successState && <Notification position="top-right" />}
      <CaroselHomePage />
      <ClothesList
        title={"Sản phẩm bán chạy"}
        products={top4Product}
      />
      <ClothesTabs />
      <ChatDialog />
    </div>
  );
}

export default HomePage;
