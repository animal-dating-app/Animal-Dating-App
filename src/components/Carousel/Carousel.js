import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AnimalHomecard } from "../Cards"; 

const Carousel = ({ animals }) => {
  // Slick Carousel settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // adjust the number of slides to show
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Set the speed of the carousel
  };

  return (
    <div className="container">
      <Slider {...sliderSettings}>
        {animals.map((animal) => (
          <div key={animal.id}>
            <AnimalHomecard animal={animal} />
          </div>
        ))}
      </Slider>
      <style jsx>{`
      .slick-dots {
        bottom: 10px;
      }
      
      .slick-dots li button::before {
        font-size: 12px; 
        color: black; 
        opacity: 0.7; 
      }
      
      .slick-dots li.slick-active button::before {
        color: grey; 
        opacity: 1; 
      }
      
      `}</style>
    </div>
  );
};

export default Carousel;
