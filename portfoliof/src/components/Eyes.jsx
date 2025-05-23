import { useEffect, useState } from "react";
import "./Eyes.css"; // Import the regular CSS file
import api from "../config/api";
import Loader from './Loader'

function Eyes() {
  const [pupilPosition, setPupilPosition] = useState({ left: 0, top: 0 });
  

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;

      const maxDistance = 200000;

      const maxPupilX = Math.min(maxDistance, Math.max(-maxDistance, deltaX / 15));
      const maxPupilY = Math.min(maxDistance, Math.max(-maxDistance, deltaY / 15));

      setPupilPosition({
        left: maxPupilX,
        top: maxPupilY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const getRandomPosition = () => {
    const randomX = Math.floor(Math.random() * (window.innerWidth - 100));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 100));
    return { left: randomX, top: randomY };
  };

  const getRandomColor = () => {
    const colors = ["#d1ee77", "#f4e835", "#145a52", "#6E9493", "#D2DE63", "#E7E7E7", "#0D564D"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      document.querySelectorAll(".cirels").forEach((circle) => {
        const newPosition = getRandomPosition();
        const newColor = getRandomColor();

        circle.style.transition = "transform 2s ease-in-out";
        circle.style.transform = `translate(${newPosition.left}px, ${newPosition.top}px)`;
        circle.style.backgroundColor = newColor;
      });
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);


  return (
    <div data-scroll className="eyes">
      <div className="eyes-background">
        <div className="cirels c-1"></div>
        <div className="cirels c-2"></div>
        <div className="cirels c-3"></div>
        <div className="cirels c-3"></div>
        <div className="cirels c-3"></div>
        <div className="cirels c-3"></div>
        <div className="cirels c-3"></div>
        <div className="cirels c-3"></div>

        <div className="eye-circle-bulr-dilem">
          <div className="op-cv-6">
            <div className="eyes-container">
              {/* Left Eye */}
              <div className="eye right">
                <div className="eye-inner">
                  <div
                    className="pupil"
                    style={{
                      transform: `translate(${pupilPosition.left}px, ${pupilPosition.top}px)`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Right Eye */}
              <div className="eye left">
                <div className="eye-inner">
                  <div
                    className="pupil"
                    style={{
                      transform: `translate(${pupilPosition.left}px, ${pupilPosition.top}px)`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <a 
              href={'https://drive.google.com/file/d/1NjPaj_cFZq2m9voZSklklxhNzLu0twRL/view?usp=sharing'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="button-40" 
              role="button"
              style={{
                textDecoration:"none",
                marginBottom:'0.8rem'
              }}
            >
              <span className="text">View CV</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Eyes;