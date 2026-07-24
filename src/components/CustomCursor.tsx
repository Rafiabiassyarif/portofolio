import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight, Github, Mail, Eye } from "lucide-react";

const isTouchDevice = typeof window !== 'undefined'
  && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export function CustomCursor() {
  const [hoverType, setHoverType] = useState<string | null>(null);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const rafId = useRef<number | null>(null);
  const pendingX = useRef(-100);
  const pendingY = useRef(-100);

  // Skip entirely on touch devices
  if (isTouchDevice) return null;

  const springConfig = { damping: 28, stiffness: 500 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      pendingX.current = e.clientX - 16;
      pendingY.current = e.clientY - 16;
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        cursorX.set(pendingX.current);
        cursorY.set(pendingY.current);
        rafId.current = null;
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      const button = target.closest("button");

      if (link) {
        const href = (link as HTMLAnchorElement).href || "";
        if (href.includes("github.com")) setHoverType("github");
        else if (href.includes("mailto:")) setHoverType("email");
        else if ((link as HTMLAnchorElement).target === "_blank") setHoverType("external");
        else setHoverType("link");
      } else if (button) {
        setHoverType("button");
      } else {
        setHoverType(null);
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [cursorX, cursorY]);

  const renderIcon = () => {
    switch (hoverType) {
      case "github": return <Github className="w-3.5 h-3.5 text-white" />;
      case "email": return <Mail className="w-3.5 h-3.5 text-white" />;
      case "external": return <ArrowUpRight className="w-3.5 h-3.5 text-white" />;
      case "view": return <Eye className="w-3.5 h-3.5 text-white" />;
      default: return null;
    }
  };

  const icon = renderIcon();

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 pointer-events-none z-[9999] flex items-center justify-center overflow-hidden will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: hoverType ? (icon ? 2 : 1.5) : 1,
          borderColor: hoverType ? "rgba(59, 130, 246, 0.8)" : "rgba(139, 92, 246, 0.5)",
          backgroundColor: icon ? "rgba(59, 130, 246, 0.9)" : "rgba(59, 130, 246, 0.1)",
        }}
        transition={{ scale: { duration: 0.2 } }}
      >
        {icon && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.15 }}
          >
            {icon}
          </motion.div>
        )}
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-[10000] will-change-transform"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: 13,
          translateY: 13,
          scale: hoverType ? 0 : 1,
        }}
      />
    </>
  );
}
