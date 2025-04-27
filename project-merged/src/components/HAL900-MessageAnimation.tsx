"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { TrendingUp, Users, Target, Zap, Globe, FileText, Image, BarChart } from "lucide-react";

const messages = [
  {
    color: "bg-[#22C55E]",
    iconColor: "text-[#22C55E]",
    lines: 3,
    icon: TrendingUp,
    attachments: [
      { type: "chart", icon: BarChart },
      { type: "document", icon: FileText },
    ],
  },
  {
    color: "bg-[#0EA5E9]",
    iconColor: "text-[#0EA5E9]",
    lines: 2,
    icon: Globe,
    attachments: [{ type: "image", icon: Image }],
  },
  {
    color: "bg-[#8B5CF6]",
    iconColor: "text-[#8B5CF6]",
    lines: 4,
    icon: Users,
    attachments: [
      { type: "document", icon: FileText },
      { type: "chart", icon: BarChart },
    ],
  },
  {
    color: "bg-[#F59E0B]",
    iconColor: "text-[#F59E0B]",
    lines: 1,
    icon: Target,
    attachments: [
      { type: "image", icon: Image },
      { type: "document", icon: FileText },
    ],
  },
  {
    color: "bg-[#EC4899]",
    iconColor: "text-[#EC4899]",
    lines: 3,
    icon: Zap,
    attachments: [{ type: "chart", icon: BarChart }],
  },
];

const AttachmentIcon = ({ type, icon: Icon, color }: { type: string; icon: any; color: string }) => (
  <div className="w-5 md:w-8 h-5 md:h-8 bg-[#2a2a2a] rounded-md flex items-center justify-center">
    <Icon className={`w-2.5 md:w-4 h-2.5 md:h-4 ${color}`} />
  </div>
);

export default function HAL900MessageAnimation() {
  const [messageQueue, setMessageQueue] = useState<((typeof messages)[0] & { id: number })[]>([]);
  const [heights, setHeights] = useState<{ [key: number]: number }>({});
  const observers = useRef<{ [key: number]: ResizeObserver }>({});

  useEffect(() => {
    let counter = 0;

    const addMessage = () => {
      setMessageQueue((prev) => {
        const newMessage = {
          ...messages[counter % messages.length],
          id: counter,
        };
        counter++;
        return [newMessage, ...prev].slice(0, 20);
      });

      const nextDelay = Math.random() * 1000 + 500;
      setTimeout(addMessage, nextDelay);
    };

    addMessage();

    return () => {
      Object.values(observers.current).forEach((observer) => observer.disconnect());
    };
  }, []);

  const getOffsetY = (index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const messageId = messageQueue[i]?.id;
      if (messageId !== undefined) {
        offset += (heights[messageId] || 0) + 12;
      }
    }
    return offset;
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: (width: string) => ({
      width,
      transition: { duration: 0.7, ease: "easeOut" },
    }),
  };

  return (
    <div className="bg-scailer-light rounded-xl p-3 md:p-6 border border-scailer-light/20">
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
        <div className="w-5 md:w-8 h-5 md:h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-[#25D366]"
          />
        </div>
        <div>
          <h3 className="text-white text-xs md:text-base font-medium">Growth Insights Feed</h3>
        </div>
      </div>

      <div className="h-[200px] md:h-[300px] relative overflow-hidden">
        <AnimatePresence initial={false}>
          {messageQueue.map((message, index) => (
            <motion.div
              key={message.id}
              ref={(node) => {
                if (node) {
                  if (!observers.current[message.id]) {
                    observers.current[message.id] = new ResizeObserver((entries) => {
                      const height = entries[0]?.contentRect.height;
                      if (height) {
                        setHeights((prev) => ({ ...prev, [message.id]: height }));
                      }
                    });
                  }
                  observers.current[message.id].observe(node);
                }
              }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: -getOffsetY(index),
                scale: 1,
                transition: {
                  y: { type: "spring", stiffness: 120, damping: 18 },
                  opacity: { duration: 0.4 },
                  scale: { type: "spring", stiffness: 220, damping: 18 },
                },
              }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
              className="absolute left-0 right-0 bottom-0 flex gap-2 md:gap-3 items-start mb-2 md:mb-3 origin-bottom"
            >
              <div className="w-10 md:w-16 h-10 md:h-16 rounded-lg flex-shrink-0 bg-[#2a2a2a] flex items-center justify-center">
                <message.icon className={`w-5 md:w-8 h-5 md:h-8 ${message.iconColor}`} />
              </div>
              <motion.div
                className="flex-1 overflow-hidden bg-[#2a2a2a] rounded-lg"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="px-2 md:px-3 py-1.5 md:py-3">
                  <div className="space-y-1 md:space-y-2">
                    {Array.from({ length: message.lines }).map((_, idx) => (
                      <motion.div
                        key={idx}
                        className="h-1 md:h-2 rounded-full overflow-hidden bg-[#25D366]/20"
                        variants={lineVariants}
                        initial="hidden"
                        animate="visible"
                        custom={idx === 0 ? "40%" : idx === message.lines - 1 ? "60%" : "95%"}
                      />
                    ))}
                  </div>
                  {message.attachments && (
                    <div className="flex gap-1 md:gap-2 mt-1.5 md:mt-3">
                      {message.attachments.map((attachment, idx) => (
                        <div key={idx} className="w-5 md:w-8 h-5 md:h-8 bg-[#25D366]/20 rounded-md flex items-center justify-center">
                          <attachment.icon className={`w-2.5 md:w-4 h-2.5 md:h-4 ${message.iconColor}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 