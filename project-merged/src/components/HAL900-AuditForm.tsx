"use client"

import React, { useState, useEffect, useRef } from "react"
import { Check, Loader2, User, AlertCircle, ArrowRight, TrendingUp, Users, Target, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ValidationState {
  isValid: boolean
  message: string
}

interface FormData {
  name: string
  companyName: string
  email: string
}

const messages = [
  {
    icon: <TrendingUp className="w-5 h-5" />,
    text: "Optimize your conversion funnel for a 25% increase in lead generation.",
    metrics: ["25% Increase", "Lead Gen"],
  },
  {
    icon: <Users className="w-5 h-5" />,
    text: "Implement personalized customer journeys to boost retention by 40%.",
    metrics: ["40% Retention", "Personalization"],
  },
  {
    icon: <Target className="w-5 h-5" />,
    text: "Leverage AI-driven targeting to improve ad spend efficiency by 30%.",
    metrics: ["30% Efficiency", "AI Targeting"],
  },
  {
    icon: <Zap className="w-5 h-5" />,
    text: "Automate key processes to increase team productivity by 50%.",
    metrics: ["50% Productivity", "Automation"],
  },
  {
    icon: <Globe className="w-5 h-5" />,
    text: "Expand into new markets to drive a 60% growth in customer base.",
    metrics: ["60% Growth", "Market Expansion"],
  },
]

function MessageFeed({ animationTriggered }: { animationTriggered: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()
  const mountTimeRef = useRef(Date.now())

  useEffect(() => {
    console.log(`[MessageFeed] Component mounted at ${new Date().toISOString()}`)
    
    intervalRef.current = setInterval(() => {
      const timeSinceMount = Date.now() - mountTimeRef.current
      console.log(`[MessageFeed] Interval triggered at ${timeSinceMount}ms since mount`)
      console.log(`[MessageFeed] Current index before update: ${currentIndex}`)
      
      setCurrentIndex((prev) => {
        const newIndex = (prev + 1) % messages.length
        console.log(`[MessageFeed] Updating index from ${prev} to ${newIndex}`)
        return newIndex
      })
    }, 5000)

    return () => {
      console.log(`[MessageFeed] Component cleanup - clearing interval`)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    console.log(`[MessageFeed] Index changed to ${currentIndex}`)
  }, [currentIndex])

  useEffect(() => {
    if (animationTriggered) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [animationTriggered])

  return (
    <>
      <motion.div
        className="bg-[#2a2a2a] rounded-lg mt-4 overflow-hidden"
        animate={animationTriggered ? { height: 0, opacity: 0 } : { height: "90px", opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="p-2 h-full flex items-center"
          >
            <motion.div
              className="flex gap-2 w-full"
              animate={
                animationTriggered
                  ? {
                      x: "100%",
                      rotate: 10,
                      scale: 0.8,
                    }
                  : {}
              }
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="w-6 h-6 rounded-lg bg-scailer-green/20 flex items-center justify-center flex-shrink-0">
                {React.cloneElement(messages[currentIndex].icon as React.ReactElement, {
                  className: "w-3 h-3 text-scailer-green"
                })}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="text-[13px] text-white mb-1.5 leading-[1.4]">{messages[currentIndex].text}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {messages[currentIndex].metrics.map((metric) => (
                    <span
                      key={metric}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-scailer-green/20 text-scailer-green font-medium whitespace-nowrap"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-scailer-green/20 rounded-full"
            >
              <span className="text-scailer-green font-medium">On its way!</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function HAL900AuditForm() {
  const [loading, setLoading] = useState(false)
  const [animationTriggered, setAnimationTriggered] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    companyName: "",
    email: "",
  })
  const [validation, setValidation] = useState({
    name: { isValid: false, message: "" },
    companyName: { isValid: false, message: "" },
    email: { isValid: false, message: "" },
  })

  const validateName = (name: string) => {
    const letterOnlyRegex = /^[A-Za-z\s]+$/
    if (!letterOnlyRegex.test(name)) {
      return { isValid: false, message: "Name can only contain letters" }
    }
    if (name.length < 2) {
      return { isValid: false, message: "Name must be at least 2 characters" }
    }
    if (name.length > 50) {
      return { isValid: false, message: "Name must be less than 50 characters" }
    }
    return { isValid: true, message: "Looks good!" }
  }

  const validateCompanyName = (companyName: string) => {
    const companyRegex = /^[A-Za-z0-9\s&.-]+$/
    if (!companyRegex.test(companyName)) {
      return { isValid: false, message: "Company name can only contain letters, numbers, spaces, and characters: & . -" }
    }
    if (companyName.length < 2) {
      return { isValid: false, message: "Company name must be at least 2 characters" }
    }
    if (companyName.length > 100) {
      return { isValid: false, message: "Company name must be less than 100 characters" }
    }
    return { isValid: true, message: "Looks good!" }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return { isValid: false, message: "Email is required" }
    }
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email" }
    }
    return { isValid: true, message: "Valid email!" }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    let validationResult: ValidationState
    switch (field) {
      case "name":
        validationResult = validateName(value)
        break
      case "companyName":
        validationResult = validateCompanyName(value)
        break
      case "email":
        validationResult = validateEmail(value)
        break
      default:
        validationResult = { isValid: false, message: "" }
    }

    setValidation((prev) => ({
      ...prev,
      [field]: validationResult,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validation.name.isValid && validation.companyName.isValid && validation.email.isValid) {
      setLoading(true)
      setAnimationTriggered(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setLoading(false)
      // Here you would typically send the form data to your backend
    }
  }

  const isFormValid = validation.name.isValid && validation.companyName.isValid && validation.email.isValid

  return (
    <div className="w-full max-w-sm mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-scailer-light rounded-xl p-3 md:p-6 border border-scailer-light/20"
      >
        <div className="flex items-center gap-1.5 md:gap-3 mb-1 md:mb-2">
          <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-scailer-green/10 flex items-center justify-center">
            <User className="w-2.5 h-2.5 md:w-4 md:h-4 text-scailer-green" />
          </div>
          <div>
            <h2 className="text-xs md:text-base text-white font-medium">Get Your Free Growth Roadmap</h2>
            <p className="text-[10px] md:text-sm text-gray-400">Tailored strategies for rapid, sustainable growth</p>
          </div>
        </div>

        <div className="mt-3 md:mt-6 mb-2 md:mb-4">
          <div className="h-0.5 md:h-1.5 w-full bg-scailer-light rounded-full overflow-hidden">
            <div
              className="h-full bg-scailer-green rounded-full transition-all duration-300"
              style={{
                width: `${(Object.values(validation).filter((v) => v.isValid).length / 3) * 100}%`,
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 md:space-y-4">
          <div className="space-y-2 md:space-y-4">
            <div className="relative">
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                onKeyPress={(e) => {
                  const key = e.key;
                  if (!/^[A-Za-z\s]$/.test(key)) {
                    e.preventDefault();
                  }
                }}
                className={cn(
                  "w-full pl-2 md:pl-3 pr-7 md:pr-9 py-1 md:py-2 text-[11px] md:text-sm bg-[#2a2a2a] border-0 text-white placeholder:text-gray-500",
                  "focus:ring-1 focus:ring-scailer-green/50",
                  "rounded-lg transition-all duration-200",
                  "[&:-webkit-autofill]:bg-[#2a2a2a]",
                  "[&:-webkit-autofill]:text-white",
                  "[&:-webkit-autofill]:[-webkit-text-fill-color:white]",
                  "[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#2a2a2a_inset]",
                  "[&:-webkit-autofill]:border-[#2a2a2a]",
                  "[&:-webkit-autofill]:[-webkit-background-clip:text]",
                  "focus:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#2a2a2a_inset]",
                  "hover:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#2a2a2a_inset]"
                )}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              {formData.name && (
                <div className="absolute right-1.5 md:right-3 top-1/2 -translate-y-1/2">
                  {validation.name.isValid ? (
                    <Check className="h-2.5 w-2.5 md:h-4 md:w-4 text-scailer-green" />
                  ) : (
                    <AlertCircle className="h-2.5 w-2.5 md:h-4 md:w-4 text-red-400" />
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <Input
                type="text"
                id="companyName"
                name="companyName"
                placeholder="Enter your company name"
                onKeyPress={(e) => {
                  const key = e.key;
                  if (!/^[A-Za-z0-9\s&.-]$/.test(key)) {
                    e.preventDefault();
                  }
                }}
                className={cn(
                  "w-full pl-2 md:pl-3 pr-7 md:pr-9 py-1 md:py-2 text-[11px] md:text-sm bg-[#2a2a2a] border-0 text-white placeholder:text-gray-500",
                  "focus:ring-1 focus:ring-scailer-green/50",
                  "rounded-lg transition-all duration-200",
                  "[&:-webkit-autofill]:bg-[#2a2a2a]",
                  "[&:-webkit-autofill]:text-white",
                  "[&:-webkit-autofill]:[-webkit-text-fill-color:white]",
                  "[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#2a2a2a_inset]",
                  "[&:-webkit-autofill]:border-[#2a2a2a]",
                  "[&:-webkit-autofill]:[-webkit-background-clip:text]",
                  "focus:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#2a2a2a_inset]",
                  "hover:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#2a2a2a_inset]"
                )}
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
              />
              {formData.companyName && (
                <div className="absolute right-1.5 md:right-3 top-1/2 -translate-y-1/2">
                  {validation.companyName.isValid ? (
                    <Check className="h-2.5 w-2.5 md:h-4 md:w-4 text-scailer-green" />
                  ) : (
                    <AlertCircle className="h-2.5 w-2.5 md:h-4 md:w-4 text-red-400" />
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                onKeyPress={(e) => {
                  const key = e.key;
                  if (!/^[A-Za-z0-9@._+-]$/.test(key)) {
                    e.preventDefault();
                  }
                }}
                className={cn(
                  "w-full pl-2 md:pl-3 pr-7 md:pr-9 py-1 md:py-2 text-[11px] md:text-sm bg-[#2a2a2a] border-0 text-white placeholder:text-gray-500",
                  "focus:ring-1 focus:ring-scailer-green/50",
                  "rounded-lg transition-all duration-200",
                  "[&:-webkit-autofill]:bg-[#2a2a2a]",
                  "[&:-webkit-autofill]:text-white",
                  "[&:-webkit-autofill]:[-webkit-text-fill-color:white]",
                  "[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#2a2a2a_inset]",
                  "[&:-webkit-autofill]:border-[#2a2a2a]",
                  "[&:-webkit-autofill]:[-webkit-background-clip:text]",
                  "focus:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#2a2a2a_inset]",
                  "hover:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#2a2a2a_inset]"
                )}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {formData.email && (
                <div className="absolute right-1.5 md:right-3 top-1/2 -translate-y-1/2">
                  {validation.email.isValid ? (
                    <Check className="h-2.5 w-2.5 md:h-4 md:w-4 text-scailer-green" />
                  ) : (
                    <AlertCircle className="h-2.5 w-2.5 md:h-4 md:w-4 text-red-400" />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-1 md:pt-2">
            <motion.div
              animate={animationTriggered ? { height: 0, opacity: 0, marginTop: 0 } : { height: "auto", opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className={cn(
                  "w-full py-1 md:py-2 text-[11px] md:text-sm text-white font-medium",
                  isFormValid ? "bg-scailer-green hover:bg-[#128C7E]" : "bg-[#2a2a2a]",
                  "disabled:text-white/30 disabled:cursor-not-allowed transition-all duration-200 rounded-lg"
                )}
              >
                <motion.div
                  className="flex items-center justify-center"
                  animate={
                    loading
                      ? {
                          scale: 0.95,
                          opacity: 0.8,
                        }
                      : {
                          scale: 1,
                          opacity: 1,
                        }
                  }
                  transition={{ duration: 0.2 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-1 md:mr-2 h-2.5 w-2.5 md:h-4 md:w-4 animate-spin" />
                      <span>Creating your roadmap...</span>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-1 md:gap-2">
                      <span className="hidden md:inline">Get Your Free Growth Roadmap</span>
                      <span className="md:hidden">Get Roadmap</span>
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  )}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </form>

        <div className="hidden md:block">
          <MessageFeed animationTriggered={animationTriggered} />
        </div>
      </motion.div>
    </div>
  )
} 