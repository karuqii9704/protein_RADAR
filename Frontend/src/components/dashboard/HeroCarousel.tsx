'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiGet } from '@/lib/api';

interface Slide {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  linkType: string | null;
  linkId: string | null;
  linkUrl: string | null;
  order: number;
}

// Default slides when no data from API
const defaultSlides: Slide[] = [
  {
    id: 'default-1',
    title: 'Dashboard Keuangan Masjid',
    description: 'Transparansi Pengelolaan Dana Masjid',
    image: '/images/web-home.png',
    linkType: null,
    linkId: null,
    linkUrl: null,
    order: 0,
  },
];

export default function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await apiGet<Slide[]>('/api/slides');
        if (res.success && res.data && res.data.length > 0) {
          setSlides(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch slides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const getSlideLink = (slide: Slide): string | null => {
    if (slide.linkUrl) return slide.linkUrl;
    if (slide.linkType && slide.linkId) {
      switch (slide.linkType) {
        case 'artikel':
          return `/artikel/${slide.linkId}`;
        case 'news':
        case 'berita':
          return `/news/${slide.linkId}`;
        case 'program':
          return `/programs/${slide.linkId}`;
        default:
          return null;
      }
    }
    return null;
  };

  const renderSlideContent = (slide: Slide, index: number) => {
    const link = getSlideLink(slide);
    
    const content = (
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          index === currentSlide ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="relative w-full h-full bg-gradient-to-br from-green-600 to-green-800">
          {slide.image && (
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover opacity-40"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-4xl font-bold mb-3">{slide.title}</h2>
            {slide.description && (
              <p className="text-xl text-white/90">{slide.description}</p>
            )}
          </div>
        </div>
      </div>
    );

    if (link) {
      return (
        <Link key={slide.id} href={link} className="cursor-pointer">
          {content}
        </Link>
      );
    }

    return <div key={slide.id}>{content}</div>;
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-3xl shadow-2xl">
      {/* Loading skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 animate-pulse" />
      )}

      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => renderSlideContent(slide, index))}
      </div>

      {/* Navigation Arrows - only show if multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator - only show if multiple slides */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
