"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const HAL900Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-scailer-dark/80 backdrop-blur-lg border-b border-scailer-light/20"
    >
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center text-xl md:text-2xl font-bold">
          <span>sc</span>
          <span className="text-scailer-green">ai</span>
          <span>ler</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="text-white/80 hover:text-white transition-colors">
              Solutions
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="bg-scailer-light rounded-lg p-2 shadow-xl min-w-[200px]"
                sideOffset={5}
              >
                <DropdownMenu.Item className="px-4 py-2 hover:bg-scailer-dark rounded cursor-pointer">
                  Business Analysis
                </DropdownMenu.Item>
                <DropdownMenu.Item className="px-4 py-2 hover:bg-scailer-dark rounded cursor-pointer">
                  Growth Strategy
                </DropdownMenu.Item>
                <DropdownMenu.Item className="px-4 py-2 hover:bg-scailer-dark rounded cursor-pointer">
                  Market Expansion
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <Link href="/about" className="text-white/80 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/pricing" className="text-white/80 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex bg-white text-scailer-dark px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors"
          >
            Try for free
          </motion.button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        className="md:hidden overflow-hidden bg-scailer-dark border-t border-scailer-light/20"
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4">
            <div className="relative">
              <button className="w-full text-left text-white/80 hover:text-white transition-colors py-2">
                Solutions
              </button>
              <div className="pl-4 mt-2 space-y-2">
                <Link
                  href="/solutions/business-analysis"
                  className="block text-white/60 hover:text-white transition-colors py-2"
                >
                  Business Analysis
                </Link>
                <Link
                  href="/solutions/growth-strategy"
                  className="block text-white/60 hover:text-white transition-colors py-2"
                >
                  Growth Strategy
                </Link>
                <Link
                  href="/solutions/market-expansion"
                  className="block text-white/60 hover:text-white transition-colors py-2"
                >
                  Market Expansion
                </Link>
              </div>
            </div>
            <Link href="/about" className="text-white/80 hover:text-white transition-colors py-2">
              About
            </Link>
            <Link href="/pricing" className="text-white/80 hover:text-white transition-colors py-2">
              Pricing
            </Link>
            <Link href="/contact" className="text-white/80 hover:text-white transition-colors py-2">
              Contact
            </Link>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-white text-scailer-dark px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors mt-2"
            >
              Try for free
            </motion.button>
          </nav>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default HAL900Header; 