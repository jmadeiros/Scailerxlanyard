"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import HAL900AnimatedText from "./HAL900-AnimatedText";

const AnimatedHeading = () => {
  const [displayText, setDisplayText] = useState("");
  const texts = ["scailer", "a better way to"];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const pauseForScailer = 5000;
  const pauseForBetterWay = 8000;
  const [leftBracketStyle, setLeftBracketStyle] = useState({});
  const [rightBracketStyle, setRightBracketStyle] = useState({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const deleteText = (text: string, onComplete: () => void, pauseTime: number) => {
      const startDeletion = () => {
        let currentIndex = text.length;
        const interval = setInterval(
          () => {
            if (currentIndex > 0) {
              setDisplayText((prev) => prev.slice(0, currentIndex - 1));
              currentIndex--;
            } else {
              clearInterval(interval);
              setTimeout(onComplete, 200);
            }
          },
          text === "scailer" ? 60 : 30,
        );
      };

      if (text === "scailer") {
        setTimeout(startDeletion, pauseTime);
      } else {
        setTimeout(startDeletion, pauseTime);
      }
    };

    const animateBrackets = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const moveDistance = containerWidth / 2;
        const widthAdjustment = 17;

        setLeftBracketStyle({
          transform: `translateX(${moveDistance + widthAdjustment}px) rotateY(180deg)`,
          transition: "transform 0.5s ease-in-out",
        });
        setRightBracketStyle({
          transform: `translateX(-${moveDistance + widthAdjustment}px) rotateY(-180deg)`,
          transition: "transform 0.5s ease-in-out",
        });

        setTimeout(() => {
          setLeftBracketStyle({});
          setRightBracketStyle({});
          setTimeout(() => {
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
          }, 300);
        }, 500);
      }
    };

    const typeText = (text: string, onComplete: () => void, isFirstAnimation: boolean) => {
      let currentIndex = 0;
      const interval = setInterval(
        () => {
          if (currentIndex < text.length) {
            setDisplayText((prev) => text.slice(0, currentIndex + 1));
            currentIndex++;
          } else {
            clearInterval(interval);
            deleteText(
              text,
              () => {
                animateBrackets();
              },
              isFirstAnimation ? pauseForScailer : pauseForBetterWay,
            );
          }
        },
        text === "scailer" ? 100 : 50,
      );
    };

    const startAnimation = () => {
      const currentText = texts[currentTextIndex];
      typeText(currentText, () => {}, currentTextIndex === 0);
    };

    const timeout = setTimeout(startAnimation, 500);
    return () => clearTimeout(timeout);
  }, [currentTextIndex]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes wordScroll {
        0%, 15% {
          transform: translateY(0);
        }
        25%, 40% {
          transform: translateY(-33.33%);
        }
        50%, 90% {
          transform: translateY(-66.66%);
        }
        100% {
          transform: translateY(-66.66%);
        }
      }
      .scroll-words {
        display: inline-flex;
        flex-direction: column;
        overflow: hidden;
        height: 1.35em; 
      }
      .scroll-words-inner {
        animation: wordScroll 8s cubic-bezier(0.4, 0.0, 0.2, 1) infinite; 
        display: flex;
        flex-direction: column;
      }
      .scroll-words span {
        display: flex;
        align-items: flex-start;
        height: 1.35em;
        line-height: 1;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const formatText = (text: string) => {
    if (text.toLowerCase().includes("scailer")) {
      return text.split(/(ai)/i).map((part, index) =>
        part.toLowerCase() === "ai" ? (
          <span key={index} className="text-scailer-green">
            {part}
          </span>
        ) : (
          <span key={index} className="text-white">
            {part}
          </span>
        ),
      );
    }
    if (text.startsWith("a better way")) {
      return (
        <span className="text-white">
          {text}
          <div className="scroll-words text-4xl md:text-5xl lg:text-6xl ml-3 inline-flex items-baseline">
            <div className="scroll-words-inner">
              <span>build</span>
              <span>grow</span>
              <span className="font-bold">scale.</span>
            </div>
          </div>
        </span>
      );
    }
    return <span className="text-white">{text}</span>;
  };

  return (
    <div className="text-center my-4 md:my-6 lg:my-12 px-4">
      <div ref={containerRef} className="inline-flex items-center justify-center">
        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl flex items-center tracking-tight text-white font-medium whitespace-pre-wrap sm:whitespace-nowrap">
          <span
            className="font-normal text-scailer-green text-4xl sm:text-6xl md:text-8xl lg:text-9xl mr-2 md:mr-4 flex items-center"
            style={{ ...leftBracketStyle, transformStyle: "preserve-3d" }}
          >
            {"{"}
          </span>
          <div className="flex items-baseline">
            <span
              className={`flex-shrink-0 transition-all duration-300 ${
                displayText.startsWith("a better way")
                  ? "text-2xl sm:text-3xl md:text-5xl lg:text-6xl"
                  : "text-3xl sm:text-5xl md:text-7xl lg:text-8xl"
              }`}
            >
              {formatText(displayText)}
            </span>
          </div>
          <span
            className="font-normal text-scailer-green text-4xl sm:text-6xl md:text-8xl lg:text-9xl ml-2 md:ml-4 flex items-center"
            style={{ ...rightBracketStyle, transformStyle: "preserve-3d" }}
          >
            {"}"}
          </span>
        </h1>
      </div>
    </div>
  );
};

interface HAL900HeroProps {
  onLearnMore: () => void;
}

const HAL900Hero = ({ onLearnMore }: HAL900HeroProps) => {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-[80vh] md:min-h-screen pt-24 md:pt-32 pb-12 md:pb-16 px-4 flex flex-col items-center justify-center bg-scailer-dark">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 md:mb-8"
        >
          <AnimatedHeading />
        </motion.div>
      </div>
      <HAL900AnimatedText startAnimation={startAnimation} onLearnMore={onLearnMore} />
    </section>
  );
};

export default HAL900Hero; 