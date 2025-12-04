"use client";
import { cn } from "../../lib/utils.js";
import { motion } from "motion/react";
import React from "react";

export const Meteors = ({ number = 30, className }) => {
  const meteors = new Array(number).fill(true);

  return (
    <motion.div
      className={cn("absolute inset-0 w-screen h-screen overflow-hidden", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {meteors.map((_, idx) => {
        // Spread meteors evenly across the viewport width
        const position = idx * (window.innerWidth / number);

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-1/2 before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
              className
            )}
            style={{
              top: "-40px", // start above the screen
              left: position + "px",
              animationDelay: `${Math.random() * 5}s`, // random delay
              animationDuration: `${Math.floor(Math.random() * (10 - 5) + 5)}s`, // random duration
            }}
          />
        );
      })}
    </motion.div>
  );
};