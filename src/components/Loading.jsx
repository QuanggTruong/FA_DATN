import React from "react";
import { motion } from "framer-motion";
import { BsWatch } from "react-icons/bs";

const Loading = () => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-purple-300 to-purple-100 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <motion.div
          className="relative"
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Outer Ring Animation */}
          <motion.div
            className="absolute -inset-2 rounded-full"
            animate={{
              borderWidth: ["2px", "4px", "2px"],
              borderColor: ["#e5e7eb", "#d1d5db", "#e5e7eb"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Watch Icon with Gradient */}
          <div className="flex items-center justify-center relative bg-gradient-to-br from-pink-500 to-violet-600 p-4 rounded-full shadow-lg">
            <BsWatch className="text-4xl text-white text-center" />
          </div>

          {/* Ripple Effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{
              border: "2px solid #d1d5db",
            }}
          />
        </motion.div>

        {/* Stylish Loading Text */}
        <div className="mt-8 flex items-center justify-center gap-1">
          {["L", "O", "A", "D", "I", "N", "G"].map((letter, i) => (
            <motion.span
              key={i}
              className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600 text-sm tracking-wider font-bold inline-block"
              animate={{
                y: [-2, 2, -2],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                y: {
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                },
                opacity: {
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                },
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Fashion Dots */}
        <div className="flex justify-center gap-1 mt-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-gradient-to-r from-pink-500 to-violet-600"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;
