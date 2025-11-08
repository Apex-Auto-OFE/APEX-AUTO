"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FirebaseAnalytics } from "@/components/firebase-analytics"
import { Navigation } from "@/components/navigation"
import { getAboutContent, getCompanyRules } from "@/lib/firebase-utils"
import { Target, Users, Award, Globe, Heart, TrendingUp, Shield, Sparkles } from "lucide-react"

export default function AboutPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [companyRules, setCompanyRules] = useState<string[]>([])
  const [aboutContent, setAboutContent] = useState({
    heroTitle: "ABOUT APEX AUTO",
    heroDescription: "WE ARE PIONEERS IN PREMIUM AUTOMOTIVE PRODUCTS, DELIVERING EXCEPTIONAL QUALITY AND INNOVATION THAT BRIDGES PERFORMANCE WITH STYLE.",
    storyTitle: "OUR STORY",
    storyContent: [
      "Founded in 2010, APEX AUTO emerged from a passion for automotive excellence and a commitment to providing premium products that enhance every driving experience.",
      "We started as a small team of automotive enthusiasts and industry experts, united by a shared vision of transforming the automotive aftermarket with innovative, high-quality products.",
      "Today, we're proud to be a trusted name in automotive products, serving customers worldwide with our premium offerings and exceptional service."
    ],
    missionTitle: "OUR MISSION",
    missionContent: "TO PROVIDE PREMIUM AUTOMOTIVE PRODUCTS THAT ENHANCE PERFORMANCE, STYLE, AND DRIVING EXPERIENCE, WHILE MAINTAINING THE HIGHEST STANDARDS OF QUALITY AND CUSTOMER SATISFACTION.",
    values: [
      {
        title: "INNOVATION",
        description: "We push the boundaries of fashion technology with cutting-edge design and forward-thinking solutions."
      },
      {
        title: "COMMUNITY", 
        description: "Building a global community of fashion enthusiasts who share our passion for style and innovation."
      },
      {
        title: "QUALITY",
        description: "Every product is crafted with the highest standards of quality, durability, and attention to detail."
      },
      {
        title: "SUSTAINABILITY",
        description: "Committed to sustainable fashion practices and reducing our environmental impact."
      }
    ]
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    loadCompanyRules()
    loadAboutContent()
  }, [])

  const loadAboutContent = async () => {
    try {
      const content = await getAboutContent()
      if (content) {
        setAboutContent(content)
      }
    } catch (error) {
      console.error('Error loading about content:', error)
    }
  }

  const loadCompanyRules = async () => {
    try {
      const rules = await getCompanyRules()
      if (rules && rules.length > 0) {
        setCompanyRules(rules)
      } else {
        const defaultRules = [
          "All products must meet our premium quality standards before listing",
          "Customer data privacy and security is our top priority",
          "We maintain sustainable and ethical sourcing practices",
          "Innovation and customer experience drive all our decisions",
          "We provide honest and transparent product descriptions"
        ]
        setCompanyRules(defaultRules)
      }
    } catch (error) {
      console.error('Error loading company rules:', error)
      const defaultRules = [
        "All products must meet our premium quality standards before listing",
        "Customer data privacy and security is our top priority",
        "We maintain sustainable and ethical sourcing practices",
        "Innovation and customer experience drive all our decisions",
        "We provide honest and transparent product descriptions"
      ]
      setCompanyRules(defaultRules)
    }
  }

  const getValueIcon = (title: string) => {
    switch (title.toUpperCase()) {
      case 'INNOVATION':
        return <Sparkles className="w-10 h-10" />
      case 'COMMUNITY':
        return <Users className="w-10 h-10" />
      case 'QUALITY':
        return <Award className="w-10 h-10" />
      case 'SUSTAINABILITY':
        return <Globe className="w-10 h-10" />
      default:
        return <Heart className="w-10 h-10" />
    }
  }

  return (
    <div
      className={`min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <FirebaseAnalytics />
      <Navigation isPageLoaded={isPageLoaded} currentPage="about" />

      {/* Hero Section */}
      <section className="px-8 py-16 border-b-2 border-black dark:border-white">
        <div className="max-w-5xl mx-auto">
          <div
            className={`text-center transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-widest uppercase mb-6">
              {aboutContent.heroTitle}
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {aboutContent.heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div
            className={`border-2 border-black dark:border-white p-8 md:p-10 bg-gray-50 dark:bg-black transition-all duration-700 hover:shadow-2xl ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-2">
              {aboutContent.storyTitle}
            </h2>
            <div className="w-16 h-1 bg-black dark:bg-white mb-6"></div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
              {aboutContent.storyContent && aboutContent.storyContent.length > 0 ? (
                aboutContent.storyContent.map((paragraph: string, index: number) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>Loading story content...</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-8 py-12 bg-gray-50 dark:bg-black border-y-2 border-black dark:border-white">
        <div className="max-w-4xl mx-auto">
          <div
            className={`text-center transition-all duration-700 hover:scale-105 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="border-2 border-black dark:border-white p-8 md:p-10 bg-white dark:bg-black">
              <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-4">
                {aboutContent.missionTitle}
              </h2>
              <div className="w-16 h-1 bg-black dark:bg-white mx-auto mb-6"></div>
              <p className="text-sm md:text-base text-gray-700 dark:text-white leading-relaxed">
                {aboutContent.missionContent}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div
            className={`text-center mb-10 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-3">
              OUR VALUES
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {aboutContent.values && aboutContent.values.length > 0 ? aboutContent.values.map((value: any, index: number) => (
              <div
                key={value.title}
                className={`border-2 border-black dark:border-white p-6 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-500 group cursor-pointer hover:scale-105 hover:shadow-2xl ${
                  isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${900 + index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-black dark:text-white group-hover:scale-110 transition-transform duration-300">
                    {getValueIcon(value.title)}
                  </div>
                  <h3 className="text-lg font-bold tracking-widest uppercase">
                    {value.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            )) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Loading values...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Company Rules Section */}
      {companyRules.length > 0 && (
        <section className="px-8 py-12 bg-gray-50 dark:bg-black border-t-2 border-black dark:border-white">
          <div className="max-w-5xl mx-auto">
            <div
              className={`mb-8 text-center transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "1200ms" }}
            >
              <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-3">
                COMPANY RULES
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Our commitment to excellence
              </p>
            </div>
            
            <div className="space-y-4">
              {companyRules.map((rule, index) => (
                <div
                  key={index}
                  className={`border-2 border-black dark:border-white p-5 bg-white dark:bg-black transition-all duration-700 hover:shadow-lg hover:scale-102 ${
                    isPageLoaded ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${1300 + index * 80}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-bold text-gray-300 dark:text-gray-700 min-w-[2rem]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm text-gray-700 dark:text-white leading-relaxed pt-1">
                      {rule}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer
        className={`border-t-2 border-black dark:border-white px-8 py-16 transition-all duration-700 ${
          isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "1800ms" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 dark:text-gray-500 text-xs font-mono tracking-widest uppercase">
            © 2025 APEX AUTO, INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  )
}
