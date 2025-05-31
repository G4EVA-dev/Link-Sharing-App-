"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Star, ArrowRight, Github, Linkedin, Twitter, Instagram, Zap, Shield, TrendingUp, Users, Globe, Sparkles, CheckCircle, PlayCircle, ChevronDown, Menu, X, Link } from 'lucide-react';
import Image from 'next/image';


export default function ShowfolioLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [countersStarted, setCountersStarted] = useState(false);
  const [counts, setCounts] = useState({ users: 0, views: 0, uptime: 0, countries: 0 });
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Count-up animation for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
          setCountersStarted(true);
          
          const animateCount = (target: number, key: string, suffix: string = '') => {
            const increment = target / 100;
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              setCounts(prev => ({ ...prev, [key]: Math.floor(current) }));
            }, 20);
          };

          animateCount(2000000, 'users');
          animateCount(50000000, 'views');
          animateCount(99.9, 'uptime');
          animateCount(150, 'countries');
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [countersStarted]);

  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Universal Link Hub",
      description: "Consolidate all your social profiles, portfolios, and important links into one beautifully designed, shareable URL.",
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Dynamic Portfolio Showcase",
      description: "Present your projects with interactive galleries, smooth transitions, and professional layouts that captivate visitors.",
      gradient: "from-purple-400 to-pink-400"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Track clicks, analyze visitor behavior, and optimize your digital presence with detailed insights and performance metrics.",
      gradient: "from-green-400 to-emerald-400"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Professional Branding",
      description: "Custom domains, branded templates, and enterprise-grade features to maintain your professional image.",
      gradient: "from-orange-400 to-red-400"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Optimized for speed with global CDN, ensuring your profile loads instantly anywhere in the world.",
      gradient: "from-yellow-400 to-orange-400"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Work with your team to manage multiple profiles, share analytics, and maintain consistent branding.",
      gradient: "from-indigo-400 to-purple-400"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior UX Designer",
      company: "Figma",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      content: "Showfolio transformed how I present my work. The seamless integration of my portfolio with social links has increased my client inquiries by 300%.",
      rating: 5
    },
    {
      name: "Awa Eric Angelo",
      role: "CEO",
      company: "AngieTeck",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      content: "As a developer, I appreciate the clean code and fast loading times. My GitHub projects now get 5x more visibility through my Showfolio link.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Creative Director",
      company: "Adobe",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      content: "The analytics dashboard is incredible. I can see exactly which projects resonate with my audience and optimize accordingly. Game changer!",
      rating: 5
    },
    {
      name: "Glenn Tanzee",
      role: "Product Manager",
      company: "ShowFolio",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      content: "Showfolio's professional templates helped me land my dream job. The interviewer was impressed by my polished online presence.",
      rating: 5
    },
    {
      name: "Alex Thompson",
      role: "Startup Founder",
      company: "TechCrunch 40 Under 40",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      content: "Managing multiple ventures became effortless with Showfolio. One link showcases everything I'm building. Investors love the clarity.",
      rating: 5
    },
    {
      name: "Lisa Park",
      role: "Brand Strategist",
      company: "Nike",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      content: "The customization options are endless. I've created a brand experience that perfectly reflects my personality and professional values.",
      rating: 5
    }
  ];

  const stats = [
    { 
      number: countersStarted ? `${(counts.users / 1000000).toFixed(1)}M+` : "2M+", 
      label: "Active Users", 
      icon: <Users className="w-6 h-6" /> 
    },
    { 
      number: countersStarted ? `${(counts.views / 1000000).toFixed(0)}M+` : "50M+", 
      label: "Profile Views", 
      icon: <Globe className="w-6 h-6" /> 
    },
    { 
      number: countersStarted ? `${counts.uptime.toFixed(1)}%` : "99.9%", 
      label: "Uptime", 
      icon: <Shield className="w-6 h-6" /> 
    },
    { 
      number: countersStarted ? `${counts.countries}+` : "150+", 
      label: "Countries", 
      icon: <TrendingUp className="w-6 h-6" /> 
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">ShowFolio</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-200 hover:text-white transition-colors font-medium">Features</a>
              <a href="#testimonials" className="text-gray-200 hover:text-white transition-colors font-medium">Testimonials</a>
              <a href="#pricing" className="text-gray-200 hover:text-white transition-colors font-medium">Pricing</a>
              <a href='/auth/signup' >
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full text-sm font-medium text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
              </a>
             
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="bg-black/95 backdrop-blur-xl h-full pt-20 px-6">
            <div className="flex flex-col space-y-6">
              <a href="#features" className="text-xl text-gray-200 hover:text-white font-medium">Features</a>
              <a href="#testimonials" className="text-xl text-gray-200 hover:text-white font-medium">Testimonials</a>
              <a href="#pricing" className="text-xl text-gray-200 hover:text-white font-medium">Pricing</a>
              <a href="/auth/signup">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-full text-lg font-medium w-full text-white">
                Get Started
              </button></a>
              
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              <div className="w-1 h-1 bg-white/30 rounded-full" />
            </div>
          ))}
        </div>

        {/* Floating Elements */}
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-reverse"
          style={{
            transform: `translateY(${-scrollY * 0.1}px)`,
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
         
          <div className="mb-6 animate-fadeInUp">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-gray-100">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>Trusted by 2M+ professionals worldwide</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 animate-fadeInUp-delay-200">
            <span className="bg-gradient-to-r from-white via-pink-100 to-gray-200 bg-clip-text text-transparent">
              Your Digital Identity,
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-pink-100 to-gray-150 bg-clip-text text-transparent">
              Elevated.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl px-3 text-gray-200 mb-12 max-w-3xl mx-auto animate-fadeInUp-delay-400 leading-relaxed">
            Connect all your social platforms, showcase your best work, and share your story through one beautiful, professional link.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fadeInUp-delay-600">
            <button className="group bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-2 text-white hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              <span>Start Building Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group flex items-center space-x-2 text-gray-200 hover:text-white transition-colors">
              <PlayCircle className="w-6 h-6" />
              <span>Watch Demo</span>
            </button>
          </div>

          <div className="mt-16 animate-fadeInUp-delay-800">
            <p className="text-sm text-gray-300 mb-4 font-medium">Trusted by teams at</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              {['Google', 'Microsoft', 'Apple', 'Meta', 'Netflix'].map((company) => (
                <div key={company} className="text-lg font-semibold text-gray-300">{company}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-300" />
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-6 bg-gradient-to-r from-purple-900/10 to-pink-900/10 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <div className="text-purple-300">
                      {stat.icon}
                    </div>
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Everything you need to
              </span>
              <br />
              <span className="bg-gradient-to-r from-white to-pink-300 bg-clip-text text-transparent">
                stand out online
              </span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Powerful features designed to showcase your work, connect with your audience, and grow your professional presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl hover:border-white/30 transition-all duration-500 hover:transform hover:scale-105"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className={`inline-flex p-3 bg-gradient-to-r ${feature.gradient} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-pink-500 group-hover:bg-clip-text transition-all duration-500">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 group-hover:text-gray-100 transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} id="testimonials" className="py-32 px-6 bg-gradient-to-b from-transparent to-purple-900/10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Loved by creators
              </span>
              <br />
              <span className="bg-gradient-to-r from-white to-pink-300 bg-clip-text text-transparent">
                worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who&apos;ve transformed their online presence with Showfolio.
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-testimonial-drift">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl hover:border-white/30 transition-all duration-500 hover:transform hover:-translate-y-2 animate-testimonial-float"
                  style={{
                    animationDelay: `${index * 0.5}s`
                  }}
                >
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-200 mb-8 leading-relaxed group-hover:text-white transition-colors duration-300">
                    &quot;{testimonial.content}&quot;
                  </p>
                  
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300"
                      width={48}
                      height={48}
                    />
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-pink-300 group-hover:bg-clip-text transition-all duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-300 text-sm">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-orange-900/20" />
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              <div className="w-1 h-1 bg-white/40 rounded-full" />
            </div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
              Ready to elevate your
            </span>
            <br />
            <span className="bg-gradient-to-r from-white to-pink-300 bg-clip-text text-transparent">
              digital presence?
            </span>
          </h2>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join millions of professionals who trust Showfolio to showcase their work and connect with their audience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="group bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-2 text-white hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              <span>Start Your Free Showfolio</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-gray-300">No credit card required • Setup in 2 minutes</p>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-200">Free</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-200">No setup fees</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-200">Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white">ShowFolio</span>
              </div>
              <p className="text-gray-200 mb-6 leading-relaxed">
                Your ultimate digital identity platform for creators, professionals, and teams.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Github className="w-5 h-5 text-gray-200" />
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Twitter className="w-5 h-5 text-gray-200" />
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Linkedin className="w-5 h-5 text-gray-200" />
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5 text-gray-200" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-200 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-gray-300 pt-8 border-t border-white/10">
            &copy; 2025 ShowFolio. All rights reserved. Built with ♥ for creators worldwide.
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes testimonial-float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-10px) rotate(0.5deg); 
          }
          66% { 
            transform: translateY(5px) rotate(-0.5deg); 
          }
        }

        @keyframes testimonial-drift {
          0% { transform: translateX(0px); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 6s ease-in-out infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }

        .animate-fadeInUp-delay-200 {
          animation: fadeInUp 1s ease-out 0.2s both;
        }

        .animate-fadeInUp-delay-400 {
          animation: fadeInUp 1s ease-out 0.4s both;
        }

        .animate-fadeInUp-delay-600 {
          animation: fadeInUp 1s ease-out 0.6s both;
        }

        .animate-fadeInUp-delay-800 {
          animation: fadeInUp 1s ease-out 0.8s both;
        }

        .animate-testimonial-float {
          animation: testimonial-float 8s ease-in-out infinite;
        }

        .animate-testimonial-drift {
          animation: testimonial-drift 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}