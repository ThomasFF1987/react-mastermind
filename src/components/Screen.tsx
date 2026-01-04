import React, { useEffect, useRef, useState } from "react";
import config from "./Configuration";

function Screen({ children }: { children: React.ReactNode }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    function updateFontSize() {
      if (screenRef.current) {
        const height = screenRef.current.clientHeight;
        const newheight = height * config.screen.fontsizecoeff;
        if(newheight < config.screen.minfontsize) setFontSize(config.screen.minfontsize);
        else setFontSize(newheight);
      }
    }
    updateFontSize();
    window.addEventListener("resize", updateFontSize);
    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  return (
    <div
      ref={screenRef}
      className="game-screen"
      style={{ fontSize: `${fontSize}px` }}
    >
      {children}
    </div>
  );
}

export default Screen;