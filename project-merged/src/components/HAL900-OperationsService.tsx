"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion"
import { Zap, Check, ArrowRight, Target, User, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import HAL900MessageAnimation from "./HAL900-MessageAnimation"

const implementationSteps = [
  {
    step: "Step 1",
    title: "Identify Bottlenecks",
    description: "We identify inefficiencies in your business through data analysis and targeted discussions.",
    details:
      "Our comprehensive analysis looks at your entire workflow, identifying both obvious and hidden bottlenecks that are limiting your potential.",
  },
  {
    step: "Step 2",
    title: "Custom AI-Powered Solutions",
    description:
      "We design tailored automation and AI-driven systems that integrate seamlessly into your existing processes.",
    details:
      "We leverage cutting-edge AI technologies that are specifically configured to address your unique business challenges.",
  },
  {
    step: "Step 3",
    title: "Rapid Implementation",
    description:
      "No long wait times. We deploy solutions quickly, ensuring minimal disruption. Our onboarding is smooth, and we start optimizing your workflows almost immediately.",
    details:
      "While traditional implementations can take months, our streamlined approach gets you up and running in weeks or even days.",
  },
  {
    step: "Step 4",
    title: "Continuous Optimization & Scaling",
    description: "We continuously refine and scale your automation systems as your business evolves.",
    details:
      "We don't just set it and forget it. Our ongoing optimization ensures your systems evolve as your business grows and market conditions change.",
  },
]

const operationsSteps = [
  {
    step: "Step 1",
    title: "Assess Your Needs",
    description: "We analyze your current operations and identify opportunities for automation and optimization.",
    details:
      "Our assessment includes a thorough review of your workflows, tools, and team structure to identify the highest-impact opportunities.",
  },
  {
    step: "Step 2",
    title: "Design Custom Solutions",
    description: "We create a tailored operations strategy that addresses your specific business challenges.",
    details:
      "Our solutions are designed to integrate seamlessly with your existing systems while providing the flexibility to scale as your business grows.",
  },
  {
    step: "Step 3",
    title: "Implementation & Training",
    description:
      "We deploy the solutions and provide comprehensive training to ensure your team can maximize their effectiveness.",
    details:
      "Our implementation process is designed to minimize disruption while ensuring your team has the knowledge and skills to leverage the new systems.",
  },
  {
    step: "Step 4",
    title: "Ongoing Support & Optimization",
    description: "We provide continuous support and regularly optimize your operations as your business evolves.",
    details:
      "Our team remains available to address any issues and continuously refine your operations to adapt to changing business needs.",
  },
]

const ProcessIcon = ({ progress }: { progress: number }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    style={{ transform: `scale(${progress})` }}
  >
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="#25D366"
      strokeWidth="2"
    />
    <path
      d="M12 8C12 8 14 10 14 12C14 14 12 16 12 16C12 16 10 14 10 12C10 10 12 8 12 8Z"
      stroke="#25D366"
      strokeWidth="2"
    />
  </svg>
)

const TimelineStep = ({
  step,
  index,
  isExpanded,
  onToggle,
}: { step: any; index: number; isExpanded: boolean; onToggle: () => void }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      className="relative mb-1"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Timeline dot */}
      <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center justify-center w-5 h-5 bg-[#25D366] rounded-full">
          <div className="w-2 h-2 bg-[#2a2a2a] rounded-full" />
        </div>
      </div>

      {/* Content box - positioned to left or right based on index */}
      <div className={`flex ${isEven ? "justify-start" : "justify-end"}`}>
        <motion.div
          className={`w-[45%] cursor-pointer ${isEven ? "mr-[5%]" : "ml-[5%]"}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggle}
        >
          <div className="px-3 pt-3 pb-2 bg-[#3a3a3a]/50 rounded-lg shadow-sm">
            <div className="flex items-start gap-2 mb-2">
              <span className="font-bold text-[#25D366] text-sm">{step.step}</span>
              <h3 className="text-base font-semibold text-white">{step.title}</h3>
            </div>
            <p className="text-gray-300 text-sm mb-2">{step.description}</p>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="mt-2 text-xs text-gray-400">{step.details}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function HAL900OperationsService() {
  // All refs defined at the top level
  const strategicRef = useRef<HTMLDivElement>(null)
  const opsRef = useRef<HTMLDivElement>(null)
  const implementationRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const opsTimelineRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const strategicContentRef = useRef<HTMLDivElement>(null)
  const opsContentRef = useRef<HTMLDivElement>(null)
  const implementationContentRef = useRef<HTMLDivElement>(null)
  const whySpeedMattersRef = useRef<HTMLDivElement>(null)

  // All state defined at the top level
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [expandedOpsStep, setExpandedOpsStep] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState<"strategic" | "ops" | "implementation">("strategic")
  const [prevSection, setPrevSection] = useState<"strategic" | "ops" | "implementation">("strategic")
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const [resetScroll, setResetScroll] = useState(false)

  // All hooks called unconditionally at the top level
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "center start"],
  })

  const { scrollYProgress: opsScrollYProgress } = useScroll({
    target: opsTimelineRef,
    offset: ["start end", "center start"],
  })

  const opsScaleX = useSpring(opsScrollYProgress, {
    stiffness: 200,
    damping: 20,
    restDelta: 0.001,
  })

  const { scrollYProgress: strategicScrollProgress } = useScroll({
    target: strategicContentRef,
    offset: ["start start", "end start"],
  })

  const { scrollYProgress: opsScrollProgress } = useScroll({
    target: opsContentRef,
    offset: ["start start", "end start"],
  })

  const { scrollYProgress: implementationScrollProgress } = useScroll({
    target: implementationContentRef,
    offset: ["start start", "end start"],
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 20,
    restDelta: 0.001,
  })

  const yTransform = useTransform(scrollYProgress, [0, 1], [0, 80])
  const progressTransform = useTransform(scrollYProgress, [0, 1], [0.5, 1])

  // Set initial active section
  useEffect(() => {
    setActiveSection("strategic")
  }, [])

  // Reset scroll position when changing sections
  useEffect(() => {
    if (resetScroll) {
      if (activeSection === "strategic" && strategicContentRef.current) {
        strategicContentRef.current.scrollTop = 0
      } else if (activeSection === "ops" && opsContentRef.current) {
        opsContentRef.current.scrollTop = 0
      } else if (activeSection === "implementation" && implementationContentRef.current) {
        implementationContentRef.current.scrollTop = 0
      }
      setResetScroll(false)
    }
  }, [resetScroll, activeSection])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>, section: "strategic" | "ops" | "implementation") => {
    // Determine direction based on section order
    const sections = ["strategic", "ops", "implementation"]
    const currentIndex = sections.indexOf(activeSection)
    const targetIndex = sections.indexOf(section)

    setDirection(targetIndex > currentIndex ? "forward" : "backward")
    setPrevSection(activeSection)
    setActiveSection(section)
    setResetScroll(true)
    // No automatic scrolling
  }

  // Animation variants for consistent scrolling in both directions
  const containerVariants = {
    enter: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? "150%" : "-150%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20,
        mass: 1,
      },
    },
    exit: (direction: "forward" | "backward") => ({
      x: direction === "forward" ? "-150%" : "150%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20,
        mass: 1,
      },
    }),
  }

  return (
    <section id="optimized-section" className="w-full bg-[#222222] py-20 pb-40 mt-12 overflow-hidden">
      <div className="container mx-auto px-4 relative max-w-6xl">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#25D366]/5 rounded-full blur-3xl -z-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#25D366]/5 rounded-full blur-3xl -z-10 opacity-50"></div>

        <div className="max-w-5xl mx-auto">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-24"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16 leading-tight max-w-4xl mx-auto">
              The difference between <span className="text-[#25D366]">thriving</span> and{" "}
              <br className="hidden md:block" />
              <span className="text-gray-500">stagnant</span> isn't effort—it's strategy.
            </h2>

            <p className="text-gray-300 text-xl mb-24 max-w-3xl mx-auto font-light tracking-wide leading-relaxed">
              <span className="text-[#25D366] font-bold">AI and automation</span> have the power to drive exponential
              growth, but with countless tools available, the path forward often feels overwhelming. You see the
              potential, but without a clear strategy,{" "}
              <span className="text-gray-500 font-bold">opportunity quickly turns into complexity</span>.
            </p>

            <div className="mb-28 max-w-3xl mx-auto text-center">
              <h3 className="text-white text-3xl font-medium mb-6">That's where we come in.</h3>
              <div className="h-1 w-32 bg-[#25D366] rounded-full mx-auto"></div>
            </div>

            {/* Button container */}
            <div className="flex flex-wrap justify-center gap-4 mt-20">
              <motion.button
                onClick={() => scrollToSection(strategicRef, "strategic")}
                className={`flex items-center gap-2 px-5 py-3 rounded-full ${
                  activeSection === "strategic"
                    ? "bg-[#25D366] text-white"
                    : "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20"
                } transition-colors text-base font-medium`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Target className="w-5 h-5" />
                <span>Strategic Growth</span>
                <ChevronLeft
                  className={`w-5 h-5 transition-transform rotate-90 ${activeSection === "strategic" ? "rotate-[270deg]" : ""}`}
                />
              </motion.button>

              <motion.button
                onClick={() => scrollToSection(opsRef, "ops")}
                className={`flex items-center gap-2 px-5 py-3 rounded-full ${
                  activeSection === "ops"
                    ? "bg-[#25D366] text-white"
                    : "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20"
                } transition-colors text-base font-medium`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-5 h-5" />
                <span>Operations as a Service</span>
                <ChevronLeft
                  className={`w-5 h-5 transition-transform rotate-90 ${activeSection === "ops" ? "rotate-[270deg]" : ""}`}
                />
              </motion.button>

              <motion.button
                onClick={() => scrollToSection(implementationRef, "implementation")}
                className={`flex items-center gap-2 px-5 py-3 rounded-full ${
                  activeSection === "implementation"
                    ? "bg-[#25D366] text-white"
                    : "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20"
                } transition-colors text-base font-medium`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="w-5 h-5" />
                <span>Rapid Implementation</span>
                <ChevronLeft
                  className={`w-5 h-5 transition-transform rotate-90 ${activeSection === "implementation" ? "rotate-[270deg]" : ""}`}
                />
              </motion.button>
            </div>
          </motion.div>

          <div className="relative min-h-[1500px] h-[1500px] overflow-hidden overflow-x-hidden" ref={containerRef}>
            {/* Strategic Growth Section */}
            <AnimatePresence mode="popLayout" custom={direction}>
              {activeSection === "strategic" && (
                <motion.div
                  ref={strategicRef}
                  key="strategic"
                  custom={direction}
                  variants={containerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute top-0 left-0 w-full"
                >
                  {/* Header that slides in with the section */}
                  <motion.div className="text-center mb-12">
                    <div className="inline-block bg-[#25D366]/10 px-3 py-1 rounded-full mb-4">
                      <span className="text-[#25D366] text-sm font-medium">STRATEGIC GROWTH</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Unlock Your Growth Potential</h3>
                    <div className="h-1 w-24 bg-[#25D366] mx-auto rounded-full mb-10"></div>
                  </motion.div>

                  {/* Content that animates on scroll */}
                  <div ref={strategicContentRef} className="pb-16">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="text-center mb-12"
                    >
                      <p className="text-2xl text-white font-medium mb-2">
                        Our mission is to bridge the gap between where you are now and where you <br />
                        could be.
                      </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto mb-12">
                      <ul className="space-y-8">
                        {[
                          "We remove bottlenecks, streamline operations, and implement AI-powered systems that drive growth with speed and precision.",
                          "We analyse how you work, spot the gaps, and deliver solutions that fit seamlessly into your business.",
                        ].map((item, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                          >
                            <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                              <Check className="w-5 h-5 text-[#25D366]" />
                            </div>
                            <p className="text-gray-300 text-lg">{item}</p>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="text-center py-16"
                    >
                      <div className="max-w-3xl mx-auto px-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                          Our job? Spotting the gaps, cutting the waste, and showing you how to win with tech.
                        </h3>

                        {/* Arrow pointing to Operations as a Service - with independent animation and delay */}
                        <div className="mt-12 flex flex-col items-center">
                          <motion.p
                            className="text-[#25D366] mb-2 font-medium"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                          >
                            Discover our approach
                          </motion.p>
                          <motion.div
                            className="flex items-center justify-center cursor-pointer"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.5, duration: 0.7 }}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => scrollToSection(opsRef, "ops")}
                          >
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4 12H20M20 12L14 6M20 12L14 18"
                                stroke="#25D366"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </motion.div>
                          <motion.p
                            className="text-gray-400 text-sm mt-2"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                          >
                            Operations as a Service
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Operations as a Service Section */}
              {activeSection === "ops" && (
                <motion.div
                  ref={opsRef}
                  key="ops"
                  custom={direction}
                  variants={containerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute top-0 left-0 w-full"
                >
                  {/* Header that slides in with the section */}
                  <motion.div className="text-center mb-12">
                    <div className="inline-block bg-[#25D366]/10 px-3 py-1 rounded-full mb-4">
                      <span className="text-[#25D366] text-sm font-medium">OPERATIONS AS A SERVICE</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">A better way to build ops</h3>
                    <div className="h-1 w-24 bg-[#25D366] mx-auto rounded-full mb-10"></div>
                  </motion.div>

                  {/* Content that animates on scroll */}
                  <div ref={opsContentRef} className="pb-16">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6 }}
                      className="text-center mb-16"
                    >
                      <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-6">
                        Traditional hiring can be slow, costly, and demands significant upfront commitment. Our approach
                        is different:
                      </p>
                    </motion.div>

                    {/* Three column feature layout */}
                    <div className="max-w-4xl mx-auto mb-20 grid grid-cols-1 md:grid-cols-3 gap-10">
                      {[
                        {
                          title: "On-demand automation expertise",
                          description:
                            "Access specialized skills exactly when you need them, without the overhead of full-time hires.",
                          icon: Zap,
                        },
                        {
                          title: "Simple implementation process",
                          description:
                            "Clear, straightforward steps from onboarding to execution, with no unnecessary complexity.",
                          icon: Target,
                        },
                        {
                          title: "Systems you need at an affordable rate",
                          description:
                            "Flexible pricing that scales with your needs, delivering enterprise-level solutions at startup-friendly prices.",
                          icon: User,
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex flex-col items-center text-center"
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                        >
                          <div className="w-16 h-16 rounded-full bg-[#25D366]/20 flex items-center justify-center mb-6">
                            <item.icon className="w-7 h-7 text-[#25D366]" />
                          </div>
                          <h4 className="text-xl font-medium text-white mb-4">{item.title}</h4>
                          <p className="text-gray-400 text-base max-w-xs mx-auto">{item.description}</p>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="text-center py-16"
                    >
                      <div className="max-w-3xl mx-auto px-4">
                        <p className="text-gray-400 text-lg mb-6">What sets us apart?</p>

                        <p className="text-[#25D366] text-2xl font-bold mb-3">
                          Thoughtful solutions. Seamless execution.
                        </p>

                        <p className="text-white text-2xl font-bold">Building systems that grow with your business.</p>

                        {/* Arrow pointing to Rapid Implementation - with independent animation and delay */}
                        <div className="mt-12 flex flex-col items-center">
                          <motion.p
                            className="text-[#25D366] mb-2 font-medium"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                          >
                            See how we do it
                          </motion.p>
                          <motion.div
                            className="flex items-center justify-center cursor-pointer"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.5, duration: 0.7 }}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => scrollToSection(implementationRef, "implementation")}
                          >
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4 12H20M20 12L14 6M20 12L14 18"
                                stroke="#25D366"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </motion.div>
                          <motion.p
                            className="text-gray-400 text-sm mt-2"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                          >
                            Rapid Implementation
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Rapid Implementation Section */}
              {activeSection === "implementation" && (
                <motion.div
                  ref={implementationRef}
                  key="implementation"
                  custom={direction}
                  variants={containerVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute top-0 left-0 w-full"
                >
                  {/* Header that slides in with the section */}
                  <motion.div className="text-center mb-12">
                    <div className="inline-block bg-[#25D366]/10 px-3 py-1 rounded-full mb-4">
                      <span className="text-[#25D366] text-sm font-medium">RAPID IMPLEMENTATION</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Why Speed Matters</h3>
                    <div className="h-1 w-24 bg-[#25D366] mx-auto rounded-full mb-10"></div>
                  </motion.div>

                  {/* Content that animates on scroll */}
                  <div ref={implementationContentRef} className="pb-16">
                    {/* Why Speed Matters section - moved above the timeline */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-center mb-16"
                    >
                      <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        In today's fast-paced business environment, the ability to quickly implement and iterate on
                        solutions is a competitive advantage.
                      </p>
                      <p className="text-[#25D366] text-xl font-bold mb-2">
                        "We achieved in 2 weeks what would have taken us 3 months internally."
                      </p>
                      <p className="text-white text-sm mb-12">— Client Testimonial</p>
                    </motion.div>

                    {/* What sets us apart section */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-center mb-12"
                    >
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Approach</h3>
                      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        A proven process that delivers results twice as fast.
                      </p>
                    </motion.div>

                    {/* New Timeline Implementation */}
                    <div className="relative py-2 mb-8" ref={timelineRef}>
                      {/* Vertical line */}
                      <motion.div
                        className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-[#25D366]/20"
                        style={{ scaleY: scaleX }}
                      />

                      {/* Process icon - removed as it's not in the reference image */}

                      <div className="py-4">
                        {implementationSteps.map((step, index) => (
                          <TimelineStep
                            key={index}
                            step={step}
                            index={index}
                            isExpanded={expandedStep === index}
                            onToggle={() => setExpandedStep(expandedStep === index ? null : index)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Implementation Button */}
                    <div className="text-center mb-16 mt-8">
                      <p className="text-[#25D366] text-3xl font-bold mb-12 tracking-tight">
                        When you're ready to scale, we're the team you call.
                      </p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                        <Button className="bg-[#25D366] hover:bg-[#128C7E] text-black font-bold text-lg px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg shadow-[#25D366]/20">
                          Start Your Implementation
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
} 