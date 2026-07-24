import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 800;

    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(p);
      if (p >= 100) {
        setIsComplete(true);
        setTimeout(onComplete, 200);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      {!isComplete && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-primary border-r-2 border-r-transparent opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xl tracking-widest text-foreground">
                R<span className="text-primary">A</span>
              </div>
            </div>
            <div className="w-48 h-0.5 bg-muted rounded-full overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
