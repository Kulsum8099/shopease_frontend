"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const slides = [
    {
        id: 1,
        image: "/images/homepage/hero-1.png",
        title: "Simple Upgrades for Every Space",
        subtitle: "STYLISH HOME UPDATES",
        primaryButton: "Shop Now",
        secondaryButton: "Explore Categories",
        textPosition: "left",
        textAlign: "text-left",
        justifyContent: "justify-start",
    },
    {
        id: 2,
        image: "/images/homepage/hero-2.png",
        title: "Curated for Every Mood",
        subtitle: "FIND YOUR STYLE",
        primaryButton: "Shop Now",
        secondaryButton: "Explore Categories",


        textPosition: "center",
        textAlign: "text-center",
        justifyContent: "justify-center",
    },
    {
        id: 3,
        image: "/images/homepage/hero-3.jpeg",
        title: "Power Up Your Everyday",
        subtitle: "TECH YOU'LL LOVE",
        primaryButton: "Shop Now",
        secondaryButton: "Explore Categories",


        textPosition: "right", // Text on the right side
        textAlign: "text-right",
        justifyContent: "justify-end",
    },
]

export function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [isAnimating, setIsAnimating] = useState(false)

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000) // Change slide every 5 seconds

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    // Handle slide change animation
    useEffect(() => {
        setIsAnimating(true)
        const timer = setTimeout(() => setIsAnimating(false), 100)
        return () => clearTimeout(timer)
    }, [currentSlide])

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
        setIsAutoPlaying(false)
        // Resume auto-play after 10 seconds
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    const currentSlideData = slides[currentSlide]

    return (
        <section className="relative h-[600px] overflow-hidden">
            {/* Slides Container */}
            <div
                className="flex transition-transform duration-1000 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={slide.id} className="relative min-w-full h-full">
                        <Image
                            src={slide.image || "/placeholder.svg"}
                            alt={slide.title}
                            fill
                            priority={index === 0}
                            className="object-cover transition-transform duration-1000 ease-out"
                        />

                        {/* Dynamic Text Overlay/Shade */}
                        <div
                            className={`absolute inset-0 transition-opacity duration-1000 ${slide.textPosition === "left"
                                ? "bg-gradient-to-r from-black/60 via-black/30 to-transparent"
                                : slide.textPosition === "right"
                                    ? "bg-gradient-to-l from-black/60 via-black/30 to-transparent"
                                    : "bg-gradient-to-b from-transparent via-black/40 to-transparent"
                                }`}
                        />
                    </div>
                ))}
            </div>

            {/* Content with Dynamic Positioning */}
            <div className={`absolute inset-0 flex items-center ${currentSlideData.justifyContent} px-8 md:px-16`}>
                <div
                    className={`${currentSlideData.textAlign} text-white max-w-xl transition-all duration-1000 ease-out transform ${isAnimating ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
                        } ${currentSlideData.textPosition === "left"
                            ? "ml-0 lg:ml-20"
                            : currentSlideData.textPosition === "right"
                                ? "mr-0 lg:mr-20"
                                : "mx-auto"
                        }`}
                >
                    {/* Subtitle with smooth animation */}
                    <p
                        className={`text-sm font-medium tracking-wider mb-4 opacity-90 transition-all duration-1200 delay-200 ease-out transform ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                            }`}
                    >
                        {currentSlideData.subtitle}
                    </p>

                    {/* Main Title with smooth animation */}
                    <h1
                        className={`text-4xl md:text-6xl font-bold mb-8 leading-tight transition-all duration-1400 delay-400 ease-out transform ${isAnimating ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
                            }`}
                        style={{
                            textShadow: "2px 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)",
                        }}
                    >
                        {currentSlideData.title}
                    </h1>

                    {/* Buttons with smooth animation */}
                    <div
                        className={`flex flex-col sm:flex-row gap-4 ${currentSlideData.textPosition === "center"
                            ? "justify-center"
                            : currentSlideData.textPosition === "right"
                                ? "justify-end"
                                : "justify-start"
                            } transition-all duration-1600 delay-600 ease-out transform ${isAnimating ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
                            }`}
                    >
                        <Link href={"/products"} className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            >
                                {currentSlideData.primaryButton}
                            </Button>
                        </Link>

                        {/* <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-white/10"
                        >
                            {currentSlideData.secondaryButton}
                        </Button> */}
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group hover:scale-110"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            <button
                onClick={goToNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group hover:scale-110"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-500 ease-out ${index === currentSlide
                            ? "w-8 h-3 bg-white rounded-full scale-125"
                            : "w-3 h-3 bg-white/50 hover:bg-white/75 rounded-full hover:scale-110"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                <div
                    className="h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-100 ease-linear"
                    style={{
                        width: isAutoPlaying ? `${((currentSlide + 1) / slides.length) * 100}%` : "0%",
                    }}
                />
            </div>
        </section>
    )
}
