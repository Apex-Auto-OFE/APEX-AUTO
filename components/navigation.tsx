"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"

interface NavigationProps {
  isPageLoaded: boolean
  currentPage?: string
}

export function Navigation({ isPageLoaded, currentPage = "home" }: NavigationProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = mounted ? (theme === "dark" ? "/apex-auto-dark.png" : "/apex-auto-light.png") : "/apex-auto-light.png"

  const navLinks = [
    { href: "/home", label: "HOME", page: "home", delay: "200ms" },
    { href: "/products", label: "PRODUCTS", page: "products", delay: "250ms" },
    { href: "/about", label: "ABOUT", page: "about", delay: "300ms" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 px-8 py-4 border-b-2 border-black dark:border-white bg-white dark:bg-black backdrop-blur-sm transition-all duration-700 ${
        isPageLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/home" className="flex items-center space-x-3 group">
            <img 
              src={logoSrc} 
              alt="APEX AUTO" 
              className="h-8 w-auto transition-transform duration-300 group-hover:scale-110" 
            />
            <span className="text-xl font-bold tracking-widest uppercase text-black dark:text-white transition-all duration-300 group-hover:tracking-[0.3em]">
              APEX AUTO
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <a
              key={link.page}
              href={link.href}
              className={`relative px-6 py-2 text-xs font-medium tracking-widest uppercase transition-all duration-500 group ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              } ${
                currentPage === link.page
                  ? "text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
              style={{ transitionDelay: link.delay }}
            >
              {link.label}
              {/* Active indicator */}
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-white transition-all duration-300 ${
                  currentPage === link.page
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                }`}
              />
            </a>
          ))}
        </nav>

        {/* Right side - Theme Toggle & Mobile Menu */}
        <div className="flex items-center space-x-4">
          <div
            className={`transition-all duration-700 ${
              isPageLoaded ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          mobileMenuOpen ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col space-y-2 border-t-2 border-black dark:border-white pt-4">
          {navLinks.map((link, index) => (
            <a
              key={link.page}
              href={link.href}
              className={`px-4 py-3 text-sm font-medium tracking-widest uppercase border-2 transition-all duration-300 ${
                currentPage === link.page
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                  : "bg-transparent border-gray-300 dark:border-gray-700 text-black dark:text-white hover:border-black dark:hover:border-white"
              }`}
              style={{
                transitionDelay: mobileMenuOpen ? `${100 + index * 50}ms` : "0ms",
                transform: mobileMenuOpen ? "translateX(0)" : "translateX(-20px)",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
