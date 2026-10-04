import { useState,useEffect } from "react";
import img1 from "../assets/img11.jpg";
import img2 from "../assets/istockphoto-1340887693-612x612.jpg";
import img3  from '../assets/istockphoto-1399746184-612x612.jpg'
import img4  from "../assets/istockphoto-1399746184-612x612.jpg";
import img5 from "../assets/istockphoto-1444391306-612x612.webp"
const images = [
    img1,
    img2,
    img3,
    img4,
    img5
  
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000); // change slide every 3 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  return (
    <div style={{ position: "relative", width: "100%", margin: "auto" }}>
      <img
        src={images[current]}
        alt="slide"
        style={{ width: "100%", height:"385px", borderRadius: "10px", transition: "0.5s" }}
      />
      <button
        onClick={prevSlide}
        style={{ position: "absolute", top: "50%", left: "10px" }}
      >
        ◀
      </button>
      <button
        onClick={nextSlide}
        style={{ position: "absolute", top: "50%", right: "10px" }}
      >
        ▶
      </button>

      {/* Dots Navigation */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {images.map((_, idx) => (
          <span
            key={idx}
            onClick={() => setCurrent(idx)}
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              margin: "0 5px",
              borderRadius: "50%",
              background: current === idx ? "black" : "lightgray",
              cursor: "pointer",
            }}
          ></span>
        ))}
      </div>
    </div>
  );
}

 
export default Slider;
