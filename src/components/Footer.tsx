import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const { content: t } = useContent();
  const navigate = useNavigate();
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Secret: click the time 5 times in a row to go to admin panel
  const handleSecretClick = () => {
    clickCount.current += 1;

    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 2000); 

    if (clickCount.current >= 5) {
      clickCount.current = 0;
      if (clickTimer.current) clearTimeout(clickTimer.current);
      navigate("/xadmin");
    }
  };

  return (
    <footer className="py-8 bg-background relative z-10 border-t border-black/5 dark:border-white/5">
      <div className="w-full px-6 md:px-12 lg:px-24 2xl:px-32 flex flex-col md:flex-row justify-between items-center text-sm font-semibold text-foreground">
        
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <span 
            className="text-foreground/60 cursor-default select-none font-bold"
            onClick={handleSecretClick}
            title="RAFI."
          >
            RAFI.
          </span>
          <span className="text-foreground/60">
            © {new Date().getFullYear()} {t.footer.copyright || "All rights reserved"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="https://www.linkedin.com/in/rafi-abi-assyarif-06b851333" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-foreground/70 transition-colors"
          >
            LinkedIn
          </a>
          <a 
            href="https://github.com/Rafiabiassyarif" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-foreground/70 transition-colors"
          >
            GitHub
          </a>
        </div>

      </div>
    </footer>
  );
}
