import { useState, useRef, useEffect, useCallback } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

export const FloatingDock = ({ items = [], className = "" }) => {
  const mouseX = useMotionValue(Infinity);
  const mobileTimerRef = useRef(null);
  const location = useLocation();

  const isMobile = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);

  const triggerMobileReset = useCallback(
    (delay = 350) => {
      if (!isMobile()) return;
      if (mobileTimerRef.current) clearTimeout(mobileTimerRef.current);
      mobileTimerRef.current = setTimeout(() => {
        mouseX.set(Infinity);
      }, delay);
    },
    [isMobile, mouseX]
  );

  // Automatically reset size on page route change
  useEffect(() => {
    mouseX.set(Infinity);
  }, [location.pathname, mouseX]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (mobileTimerRef.current) clearTimeout(mobileTimerRef.current);
    };
  }, []);

  return (
    <div className={cn("fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50", className)}>
      <div className="relative p-[2px] rounded-2xl bg-[length:400%_400%] bg-rainbow-gradient animate-rainbow-border">
        <motion.div
          onMouseMove={(e) => {
            mouseX.set(e.pageX);
            triggerMobileReset(350);
          }}
          onMouseLeave={() => mouseX.set(Infinity)}
          onTouchStart={(e) => {
            if (e.touches && e.touches[0]) {
              mouseX.set(e.touches[0].pageX);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches && e.touches[0]) {
              mouseX.set(e.touches[0].pageX);
            }
          }}
          onTouchEnd={() => {
            triggerMobileReset(350);
          }}
          onTouchCancel={() => {
            if (isMobile()) {
              mouseX.set(Infinity);
            }
          }}
          className="relative z-10 flex items-end gap-4 px-6 py-4 rounded-2xl bg-white dark:bg-neutral-900 text-black dark:text-white shadow-lg transition-all duration-75"
        >
          {items.map((item) => (
            <DockIcon
              key={item.title}
              mouseX={mouseX}
              isMobile={isMobile}
              triggerMobileReset={triggerMobileReset}
              {...item}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const DockIcon = ({ mouseX, title, icon, href, isMobile, triggerMobileReset }) => {
  const ref = useRef(null);
  const hoverTimerRef = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const size = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const iconSize = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  const animatedSize = useSpring(size, {
    mass: 0.05,
    stiffness: 1200,
    damping: 50,
  });

  const animatedIconSize = useSpring(iconSize, {
    mass: 0.05,
    stiffness: 1200,
    damping: 50,
  });

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    setHovered(true);
    if (isMobile && isMobile()) {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = setTimeout(() => {
        setHovered(false);
      }, 350);
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleClick = () => {
    if (isMobile && isMobile()) {
      triggerMobileReset(300);
      setHovered(false);
    }
  };

  return (
    <Link to={href} onClick={handleClick}>
      <div className="relative p-[2px] rounded-full bg-[length:400%_400%] bg-rainbow-gradient animate-rainbow-border">
        <motion.div
          ref={ref}
          style={{ width: animatedSize, height: animatedSize }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative z-10 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 text-black dark:text-white shadow-md transition-transform duration-75 ease-out"
        >
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 6, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 3, x: "-50%" }}
                transition={{ duration: 0.08 }}
                className="absolute -top-8 left-1/2 px-2 py-1 text-xs rounded bg-white dark:bg-neutral-900 text-black dark:text-white border border-black/10 dark:border-white/10 backdrop-blur-md shadow"
              >
                {title}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            style={{ width: animatedIconSize, height: animatedIconSize }}
            className="flex items-center justify-center"
          >
            {icon}
          </motion.div>
        </motion.div>
      </div>
    </Link>
  );
};