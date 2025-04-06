// Loader.js
import React from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container-loa73">
      <motion.div
        className="loader-loa73"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default Loader;