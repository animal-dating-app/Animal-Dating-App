import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { AnimalHomecard } from "../Cards"; 
import {AnimalGalleryCard } from "../Cards";
import { useNavigate } from "react-router-dom";

const Carousel = ({ animals, onClickAnimal }) => {
  // Slick Carousel settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // adjust the number of slides to show
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Set the speed of the carousel
    draggable: true,               // Enable dragging to navigate
    responsive: [
      {
        breakpoint: 1200,          // Adjust settings for screens smaller than 1200px
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 992,           // Adjust settings for screens smaller than 992px
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,           // Adjust settings for screens smaller than 768px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };
  

    const navigate = useNavigate();
  
    const handleCardClick = (animal) => {
      if (onClickAnimal) {
        onClickAnimal(animal);
      } else {
        navigate('/pet', { state: { pet: animal } });
      }
    };


  return (
    <div className="container-carousel"  >
      <Slider {...sliderSettings}>
        {animals.map((animal) => (
          <div key={animal.id} onClick={() => handleCardClick(animal)}>
          <AnimalGalleryCard animal={animal} className = "Custom-Carousel"  />
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

      .container-carousel .card:hover  {
        transform: scale(1.05);
        z-index: 10;
      }

      .container-carousel .card-img-top {
        max-width: 300px; /* Adjust the width as needed */
        max-height: 300px;
      }

      .container-carousel .card{
        position: relative;
        width: 300px;
        max-width: 300px;
          background: white;
          color: black;
          border-radius: 3px;
          margin:  40px auto;
          box-shadow: 0 3px 10px #00000033;
      }

      .container-carousel{
        justify-content: center;
        align-items: center;
        gap: 32px;
      }

    
    
      
      


  
      `}</style>
    </div>
  );
};

export default Carousel;
