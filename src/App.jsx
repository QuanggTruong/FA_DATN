import { BrowserRouter } from "react-router-dom";
import Router from "./router/router";
import { FloatButton } from "antd";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SlArrowUpCircle } from "react-icons/sl";

function App() {
  return (
    <BrowserRouter>
      <Router />
      <FloatButton.BackTop icon={<SlArrowUpCircle />} />
    </BrowserRouter>
  );
}

export default App;
