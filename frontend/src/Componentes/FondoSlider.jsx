import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useEffect,useRef } from "react";

export default function FondoSlider() {
  const swiperRef = useRef(null);
  
  useEffect(() => {
    const handleResize = () => {
      if (swiperRef.current) {
        swiperRef.current.swiper.update();
        swiperRef.current.swiper.autoplay.start();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("resize", handleResize); };
  }, []);
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        slidesPerView={1}
        className="h-full w-full"
      >
        <SwiperSlide>
          <div className="h-full min-h-screen bg-[url('/src/Image/fondo4.png')] bg-cover bg-center"></div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-full min-h-screen bg-[url('/src/Image/Fondo8.png')] bg-cover bg-center"></div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="h-full min-h-screen bg-[url('/src/Image/Fondo3.png')] bg-cover bg-center"></div>
        </SwiperSlide>
         <SwiperSlide>
          <div className="h-full min-h-screen bg-[url('/src/Image/Fondo9.png')] bg-cover bg-center"></div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}