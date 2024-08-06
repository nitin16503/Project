"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './autoCarousel.css';
import { BASE_URL } from '@/src/utils/config';

interface CarouselItem {
  text: string;
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  authorDesignation: string;
  image: string;
}

interface AutoCarouselProps {
  slides: CarouselItem[];
  interval?: number;
}

const AutoCarousel: React.FC<AutoCarouselProps> = ({ slides, interval = 3000 }) => {
  const carsouselImage = '/images/group.svg'
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, interval);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [slides.length, interval]);

  return (
    <div className="autoCarouselContainer">
      <div className="autoCarousel">
        <div className="slidesContainer" >
          {slides.map((slide, index) => (
            index === currentSlide && (
              <div key={index} className="slide">
                <Image
                  src={carsouselImage}
                  alt={`Image`}
                  width={152} //-30
                  height={114}
                  className="carsouselImage"
                />
                <div className="textContainer">
                  <p className="text1">{slide.text}</p>
                  <div className="author">
                    <Image
                      src={`${BASE_URL}/${slide?.author?.avatar}`}
                      //src={`/images/ellipse_1.svg`}
                      alt={`Author ${index + 1}`}
                      width={40} // Set the desired width
                      height={40} //-20
                      className="image avatar"
                    />
                    <p className="text2">
                      <span className="authorName">{slide?.author?.name}</span>
                      <span className="authordesignation">{slide.author?.title}</span>
                    </p>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
        <div className="dotsContainer">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentSlide ? 'activeDot' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoCarousel;

