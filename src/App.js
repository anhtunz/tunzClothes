import Footer from "./components/Footer";
import Header from "./components/Header";
import { Outlet, Link } from "react-router-dom";
function App() {
  return (
    <div className="App" >
      <div className="app-header">
        <Header />
      </div>
      <div className="app-content">
        <Outlet />
      </div>
      <div
        style={{
          height : '300px'
        }}
      >
      </div>
      <div className="app-footer"></div>
        <Footer />
    </div>
  );
}

export default App;
