"use client"

import { Database, Cloud, Zap, Network, Cpu, Server, Shield, ArrowRight } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const iconColors = ["#9CA3AF", "#0EA5E9", "#22C55E", "#EF4444", "#EC4899", "#F59E0B"]
const timelineColor = "#8B5CF6"

// Add the purple dot keyframes
const purpleDotKeyframes = `
  @keyframes streamDot {
    0% {
      top: -150px;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      top: 470px;
      opacity: 0;
    }
  }
`

const mobileStyles = `
  @media (max-width: 768px) {
    .w-6 {
      width: 1.5rem;
    }
    .h-6 {
      height: 1.5rem;
    }
    .w-4 {
      width: 1rem;
    }
    .h-4 {
      height: 1rem;
    }
    .mobile-icon-adjust {
      transform: translateX(0);
      transition: transform 0.3s ease-in-out;
    }
    .mobile-icon-adjust:nth-child(2) {
      transform: translateX(25%);
    }
    .mobile-icon-adjust:nth-child(3) {
      transform: translateX(15%);
    }
    .mobile-icon-adjust:nth-child(4) {
      transform: translateX(-5%);
    }
    .mobile-icon-adjust:nth-child(5) {
      transform: translateX(-15%);
    }
  }
`

// Add all keyframes to document
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = purpleDotKeyframes + mobileStyles
  document.head.appendChild(style)
}

const ColoredIcon = ({ icon: Icon, color }: { icon: any; color: string }) => {
  return <Icon className="w-4 h-4 md:w-10 md:h-10" color={color} />
}

const FeatureBox = ({
  icon: Icon,
  title,
  description,
  label,
  isActive,
  color,
  isLeft,
}: {
  icon: any
  title: string
  description: string
  label: string
  isActive: boolean
  color: string
  isLeft: boolean
}) => {
  const ref = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      animate={{ opacity: isActive || isHovered ? 1 : 0.5, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative ${isLeft ? "text-right md:pr-12 pr-6" : "md:pl-12 pl-6"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div className="relative overflow-hidden" transition={{ duration: 0.3 }}>
        <motion.div
          className={`flex items-center gap-2 md:gap-3 mb-2 md:mb-3 ${isLeft ? "justify-end" : ""}`}
          initial={{ y: 0 }}
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {!isLeft && (
            <motion.div
              className="relative"
              animate={
                isHovered
                  ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, -5, 5, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
              <div className="relative z-10">
                <Icon className="h-6 w-6 md:h-8 md:w-8 stroke-[1.5]" style={{ color }} />
              </div>
            </motion.div>
          )}
          <div>
            <span className="text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
          </div>
          {isLeft && (
            <motion.div
              className="relative"
              animate={
                isHovered
                  ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, -5, 5, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
              <div className="relative z-10">
                <Icon className="h-6 w-6 md:h-8 md:w-8 stroke-[1.5]" style={{ color }} />
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.h3
          className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2"
          initial={{ y: 0 }}
          animate={{ y: isHovered ? -1 : 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {title}
        </motion.h3>

        <motion.p
          className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4 leading-relaxed"
          initial={{ y: 0 }}
          animate={{ y: isHovered ? -1 : 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ x: 0 }}
          animate={{ x: isHovered ? (isLeft ? -3 : 3) : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href="#"
            className={`inline-flex items-center text-xs md:text-sm font-medium transition-colors relative group ${
              isLeft ? "flex-row-reverse" : ""
            }`}
            style={{ color: isHovered ? color : "#6B7280" }}
          >
            Learn more
            <motion.div animate={isHovered ? { x: isLeft ? -5 : 5 } : { x: 0 }} transition={{ duration: 0.2 }}>
              <ArrowRight className={`h-3 w-3 md:h-4 md:w-4 ${isLeft ? "mr-1 md:mr-2" : "ml-1 md:ml-2"}`} />
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
              style={{ backgroundColor: color }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </motion.div>
      </motion.div>
      <div className="h-8 md:h-12" />
    </motion.div>
  )
}

// Define the paths
const paths = [
  "M100 10 C 100 10, 250 505, 600 505",
  "M300 10 C 300 10, 375 505, 600 505",
  "M500 10 C 500 10, 525 505, 600 505",
  "M700 10 C 700 10, 675 505, 600 505",
  "M900 10 C 900 10, 825 505, 600 505",
  "M1100 10 C 1100 10, 950 505, 600 505",
]

const HAL900FrameworkDiagram = () => {
  const containerRef = useRef(null)
  const timelineRef = useRef(null)
  const [activeFeature, setActiveFeature] = useState(0)
  const featureRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isMounted, setIsMounted] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const lineOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.1, 0.15, 0.15, 0.1])

  const features = [
    {
      icon: Database,
      label: "Data-Driven Lead Acquisition",
      title: "Smart Lead Targeting",
      description: "Uncover high-value leads with advanced data scraping and predictive targeting.",
    },
    {
      icon: Cloud,
      label: "Process Automation",
      title: "Supercharge Your Workflow",
      description: "Streamline tasks, boost efficiency, and enhance customer interactions with intelligent automation.",
    },
    {
      icon: Zap,
      label: "Marketing Optimisation",
      title: "Precision Marketing",
      description: "Elevate campaigns with data-driven targeting, content creation, and predictive analytics.",
    },
    {
      icon: Network,
      label: "Customer Retention Systems",
      title: "Loyalty on Autopilot",
      description: "Keep customers engaged with personalized experiences and automated re-engagement strategies.",
    },
    {
      icon: Cpu,
      label: "Smart Hiring & Optimisation",
      title: "Build Your Dream Team",
      description: "Streamline hiring and workforce management with intelligent sourcing and optimisation.",
    },
    {
      icon: Server,
      label: "Website Design",
      title: "Websites That Convert",
      description: "Create high-performance, SEO-friendly sites optimized for conversions and user experience.",
    },
  ]

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const featureIndex = Math.min(Math.floor(latest * features.length), features.length - 1)
      setActiveFeature(featureIndex)
    })

    return () => unsubscribe()
  }, [scrollYProgress, features.length])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const scrollToTimeline = () => {
    if (timelineRef.current) {
      const element = timelineRef.current as HTMLElement
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  const scrollToFeature = (index: number) => {
    const featureElement = featureRefs.current[index]
    if (featureElement) {
      const offset = 100
      const elementPosition = featureElement.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    // Debug logging for container and SVG dimensions
    const container = document.querySelector('.max-w-sm');
    const svg = container?.querySelector('svg');
    const iconContainer = container?.querySelector('.flex.justify-between');
    
    if (container && svg && iconContainer) {
      console.log('Container width:', container.clientWidth);
      console.log('SVG width:', svg.clientWidth);
      console.log('SVG viewBox:', svg.getAttribute('viewBox'));
      console.log('Icon container width:', iconContainer.clientWidth);
      console.log('Icon container offset:', iconContainer.getBoundingClientRect().x);
      console.log('Visible viewport width:', window.innerWidth);
    }
  }, []);

  return (
    <section className="py-24 md:py-32 bg-scailer-dark relative">
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-24"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-12">
            <span className="block">Customisable, automated workflows</span>
            <span className="block">to scale your ops.</span>
          </h2>
          <div className="flex flex-col items-center space-y-1 mt-4 md:mt-8">
            <p className="text-white/80 text-lg md:text-xl px-4 md:px-0">
              Leverage our precision-engineered, intelligent automation frameworks to deliver
            </p>
            <p className="text-white/80 text-lg md:text-xl px-4 md:px-0">
              your business at scale, without added infrastructure overhead.
            </p>
          </div>
        </motion.div>

        {/* Main diagram with icons and lines */}
        <div className="relative w-full aspect-[16/9] max-w-sm mx-auto z-10 md:max-w-5xl">
          <svg
            viewBox="0 0 1200 675"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {paths.map((d, i) => (
                <path key={i} id={`path-${i}`} d={d} />
              ))}
            </defs>

            {/* Curved paths with smooth convergence */}
            {paths.map((d, i) => (
              <use key={i} href={`#path-${i}`} stroke={iconColors[i]} strokeWidth="3" />
            ))}

            {/* Connection circles at the bottom of each icon */}
            {[100, 300, 500, 700, 900, 1100].map((cx, i) => (
              <circle key={i} cx={cx} cy="10" r="3" fill={iconColors[i]} />
            ))}

            {/* Streaming dots for each path */}
            {paths.map((_, i) =>
              [...Array(3)].map((_, dotIndex) => (
                <circle key={`${i}-${dotIndex}`} r="4" fill={iconColors[i]}>
                  <animateMotion dur="3s" repeatCount="indefinite" begin={`${dotIndex * 1}s`}>
                    <mpath href={`#path-${i}`} />
                  </animateMotion>
                </circle>
              ))
            )}

            {/* Our Services button */}
            <g transform="translate(500, 485)" style={{ cursor: "pointer" }} onClick={scrollToTimeline}>
              <rect
                x="0"
                y="0"
                width="200"
                height="56"
                rx="28"
                fill="#1a1a1a"
                className="hover:fill-scailer-light transition-colors"
              />
              <text
                x="100"
                y="36"
                textAnchor="middle"
                fill="white"
                fontSize="20"
                fontFamily="system-ui"
                className="font-medium pointer-events-none"
              >
                Our Services
              </text>
            </g>
          </svg>

          {/* Icons at the same level with connection points */}
          <div className="absolute top-[10px] transform -translate-y-1/2 inset-x-0">
            <div className="flex justify-between items-center px-4 md:px-12">
              {[Database, Cloud, Zap, Network, Cpu, Server].map((Icon, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative",
                    index === 1 || index === 2 || index === 3 || index === 4 ? "mobile-icon-adjust" : ""
                  )}
                  onClick={() => scrollToFeature(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Scroll to ${features[index]?.label}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      scrollToFeature(index)
                    }
                  }}
                >
                  <div className="w-6 h-6 md:w-20 md:h-20 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
                    <ColoredIcon icon={Icon} color={iconColors[index]} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline section with continuous line - adjusted positioning */}
        <div className="relative max-w-5xl mx-auto" style={{ minHeight: "800px" }}>
          {/* Animated line - adjusted positioning */}
          <div className="relative pt-8" ref={timelineRef}>
            <motion.div
              className="absolute left-1/2 w-[1px] h-[950px] -top-[150px] origin-top"
              style={{
                background: "rgba(255, 255, 255, 0.3)",
                opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 0.4, 0.4, 0.3]),
              }}
            />

            {/* Streaming purple dots - adjusted positioning */}
            <div className="absolute left-1/2 -translate-x-[2px] z-[2]">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: "10px",
                    height: "10px",
                    left: "-3px",
                    animation: `streamDot 2s cubic-bezier(0.4, 0, 1, 1) infinite`,
                    animationDelay: `${i * 3}s`,
                    willChange: "top, opacity",
                    top: "-150px",
                  }}
                >
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      backgroundColor: timelineColor,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Grid layout for features */}
            <div className="relative grid grid-cols-2 gap-y-8 z-[3]">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={index % 2 === 0 ? "pr-8" : "pl-8"}
                  ref={(el) => {
                    featureRefs.current[index] = el;
                  }}
                >
                  <FeatureBox
                    {...feature}
                    isLeft={index % 2 === 0}
                    isActive={index === activeFeature}
                    color={iconColors[index]}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HAL900FrameworkDiagram