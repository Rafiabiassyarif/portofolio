import { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("py-24 relative", className)}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full px-6 md:px-12 lg:px-24 2xl:px-32 relative z-10"
      >
        {children}
      </motion.div>
    </section>
  );
}

export function SectionHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-3xl md:text-5xl font-bold mb-12 tracking-tight", className)}>
      {children}
    </h2>
  );
}
