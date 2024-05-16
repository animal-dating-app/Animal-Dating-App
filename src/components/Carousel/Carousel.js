import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AnimalGalleryCard } from "../Cards";
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
    draggable: true, // Enable dragging to navigate
    responsive: [
      {
        breakpoint: 1200, // Adjust settings for screens smaller than 1200px
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992, // Adjust settings for screens smaller than 992px
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Adjust settings for screens smaller than 768px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const navigate = useNavigate();

  const handleCardClick = (animal) => {
    if (onClickAnimal) {
      onClickAnimal(animal);
    } else {
      navigate("/pet", { state: { pet: animal } });
    }
  };

  return (
    <div className="container-carousel ">
      <Slider {...sliderSettings}>
        {animals.map((animal) => (
          <div key={animal.id} onClick={() => handleCardClick(animal)}>
            <AnimalGalleryCard animal={animal} className="Custom-Carousel" />
          </div>
        ))}
      </Slider>
<<<<<<< HEAD
      <style jsx>{`
        .container-carousel .card:hover {
          transform: scale(1.05);
          z-index: 10;
          background-color: rgb(221, 237, 234);
        }
=======
      <style>{`
>>>>>>> 17ac27a24cf1f9b8fffc7d592aed1689711c8808

        .container-carousel .card {
          position: relative;
          max-width: 300px;
          background: white;
          color: black;
          margin: 40px auto;
          box-shadow: 0 3px 10px #00000033;
          height: 550px;
        }

        .container-carousel {
          justify-content: center;
          align-items: center;
          gap: 32px;
          margin-bottom: 40px;
        }

        .container-carousel ul {
          margin-bottom: 30px;
        }
      `}</style>
    </div>
  );
};

export default Carousel;
