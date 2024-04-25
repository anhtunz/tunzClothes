import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Notification from './toast';
import CaroselHomePage from './home/carosel';
import ClothesList from './home/ListClothes/List_Clothes';
import ClothesTabs from './home/ListClothes/ClothesTabs';
import ChatDialog from './Chat';
import { getTop4ProductsBySold } from "../APi";
import { List, Modal, Flex, Col, Row, Carousel, Tag, Button, Space } from "antd";
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
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const top4Product = await getTop4ProductsBySold();
      setTop4Product(top4Product)
    } catch (error) {
      console.log("Error: ", error.message);
    }
  }


  return (
    <Flex
      vertical
      gap={10}
    >
      {successState && <Notification position="top-right" />}
      <CaroselHomePage />
      <Row style={{
        marginLeft: 30
      }}>
        <ClothesList
          title={"Sản phẩm bán chạy"}
          products={top4Product}
        />
      </Row>
      <ClothesTabs />
    </Flex>
  );
}

export default HomePage;
