import React, { useMemo, useCallback } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const SLIDE_IMAGES = [
  "https://bizweb.dktcdn.net/100/403/653/themes/787129/assets/slider_5.jpg?1724563342300",
  "https://bizweb.dktcdn.net/100/403/653/themes/787129/assets/banner_t_03.jpg?1724563342300",
];

const SIDE_IMAGES = [
  "https://bizweb.dktcdn.net/100/403/653/themes/787129/assets/banner_t_04.jpg?1724563342300",
  "https://bizweb.dktcdn.net/100/403/653/themes/787129/assets/banner_t_02.jpg?1724563342300",
];

const arrowStyles = {
  base: "absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white bg-opacity-70 rounded-full p-3 shadow-lg",
  left: "left-4",
  right: "right-4",
};

const CustomArrow = ({ direction, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.2, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
    whileTap={{ scale: 0.9 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className={`${arrowStyles.base} ${
      direction === "prev" ? arrowStyles.left : arrowStyles.right
    }`}
    onClick={onClick}
  >
    {direction === "prev" ? (
      <FaChevronLeft className="text-gray-800 text-2xl" />
    ) : (
      <FaChevronRight className="text-gray-800 text-2xl" />
    )}
  </motion.div>
);

const CustomDot = ({ onClick, active }) => (
  <motion.button
    whileHover={{ scale: 1.3 }}
    whileTap={{ scale: 0.8 }}
    animate={{ scale: active ? 1.2 : 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`w-3 h-3 mx-2 rounded-full ${
      active ? "bg-white" : "bg-gray-400 bg-opacity-50"
    }`}
    onClick={onClick}
  />
);

const SlideImage = ({ src, alt }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={src}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.7 }}
      className="focus:outline-none"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-auto lg:h-[300px] rounded-lg"
      />
    </motion.div>
  </AnimatePresence>
);

const SideImage = ({ src, alt, rotate }) => (
  <motion.div
    className="flex-1 hidden lg:block overflow-hidden rounded-lg shadow-xl"
    whileHover={{ scale: 1.08, rotate }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
  >
    <img
      src={src}
      alt={alt}
      className="w-full h-full rounded-lg transform hover:scale-110 transition duration-500"
    />
  </motion.div>
);

const Banner = () => {
  const settings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      arrows: true,
      prevArrow: <CustomArrow direction="prev" />,
      nextArrow: <CustomArrow direction="next" />,
      appendDots: (dots) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ position: "absolute", bottom: "20px", width: "100%" }}
        >
          <ul style={{ margin: "0px", padding: "0px", textAlign: "center" }}>
            {dots}
          </ul>
        </motion.div>
      ),
      customPaging: () => <CustomDot />,
      dotsClass: "slick-dots",
    }),
    []
  );

  const renderSlides = useCallback(
    () =>
      SLIDE_IMAGES.map((src, index) => (
        <SlideImage key={src} src={src} alt={`Slide ${index + 1}`} />
      )),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col lg:flex-row gap-4"
    >
      <motion.div
        className="flex-grow lg:w-[70%] relative overflow-hidden rounded-lg shadow-2xl"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Slider {...settings}>{renderSlides()}</Slider>
      </motion.div>
      <div className="flex flex-col lg:w-[30%] gap-4">
        {SIDE_IMAGES.map((src, index) => (
          <SideImage
            key={src}
            src={src}
            alt={`Side Image ${index + 1}`}
            rotate={index % 2 === 0 ? 1 : -1}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Banner;
