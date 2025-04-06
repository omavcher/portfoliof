import { motion } from "framer-motion";
import "./Marquee.css";

function Marquee() {
  // Defining the motion animation for the marquee
  const marqueeAnimation = {
    initial: { x: "0%" },  // Starting position
    animate: { x: "-100%" }, // Ending position
    transition: {
      repeat: Infinity,
      ease: "linear",
      duration: 10,
    },
  };

  return (
    <div className="marquee-container" data-scroll data-scroll-section data-scroll-speed=".1">
      <div className="marquee-wrapper">
        <motion.h1
          {...marqueeAnimation}
          className="marquee-text"
        >
          Om Avcher
        </motion.h1>
        <motion.h1
          {...marqueeAnimation}
          className="marquee-text"
        >
          Om Avcher
        </motion.h1>
      </div>
    </div>
  );
}

export default Marquee;
