import Footer from "./components/Footer";
import Header from "./components/Header";
import { Outlet, Link } from "react-router-dom";
import { List, Modal, Flex, Col, Row, Carousel, Tag, Button, Space } from "antd";
function App() {
  return (
    <Flex vertical className="App" >
      <div className="app-header">
        <Header />
      </div>

      <Outlet />
      <div style={{
        height: '500px'
      }}></div>
      <Footer />
    </Flex>
  );
}

export default App;
