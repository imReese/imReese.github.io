"use client";

import { useEffect, useState, useCallback } from "react";

import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
}

export default function TypingAnimation({
  text,
  duration = 200,
  className,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [i, setI] = useState<number>(0);

  const updateText = useCallback(() => {
    if (i < text.length) {
      setDisplayedText(text.substring(0, i + 1));
      setI(i + 1);
      return true;
    }
    return false;
  }, [i, text]);

  useEffect(() => {
    // 使用requestAnimationFrame而不是setInterval以获得更好的性能
    let animationId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      
      if (time - lastTime >= duration) {
        if (updateText()) {
          lastTime = time;
        } else {
          cancelAnimationFrame(animationId);
          return;
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [duration, updateText]);

  return (
    <h1
      className={cn(
        "font-sans text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm",
        className,
      )}
      style={{ 
        willChange: 'transform', // 优化重绘性能
      }}
    >
      {displayedText || text}
    </h1>
  );
}
