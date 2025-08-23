import React, { useState } from 'react';
import { 
  Gift, 
  Users, 
  CheckCircle, 
  Building, 
  ArrowRight, 
  Star,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin,
  FileText,
  Menu,
  X
} from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Users,
      title: "Multi-Role Management",
      description: "Dedicated dashboards for admins, reviewers, and applicants with role-based access control."
    },
    {
      icon: CheckCircle,
      title: "Streamlined Review Process",
      description: "Efficient application review workflow with real-time status updates and notifications."
    },
    {
      icon: Building,
      title: "Provider Network",
      description: "Comprehensive management of service providers with detailed profiles and performance tracking."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with encrypted data transmission and secure authentication."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Service Provider",
      content: "GiftApp transformed how I manage my business applications. The process is so much smoother now.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      content: "The multi-role dashboard makes it easy to track everything. Highly recommended!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Administrator",
      content: "Managing applications has never been easier. The interface is intuitive and powerful.",
      rating: 5
    }
  ];

  const handleNavigation = (path) => {
    // In your actual app, replace this with your navigation logic
    // For example: navigate(path) if using useNavigate
    window.location.href = path;
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                GiftApp
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Contact
              </button>
              <button 
                onClick={() => handleNavigation('/login')}
                className="px-4 py-2 text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => handleNavigation('/register')}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-4 py-3 space-y-3 border-t border-gray-100 bg-white">
              <button 
                onClick={() => scrollToSection('features')} 
                className="block w-full p-3 text-left text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="block w-full p-3 text-left text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="block w-full p-3 text-left text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                Contact
              </button>
              <button 
                onClick={() => handleNavigation('/login')}
                className="block w-full p-3 text-left text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => handleNavigation('/register')}
                className="block w-full p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg text-center transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <Gift className="w-4 h-4 mr-2" />
              Welcome to the Future of Service Management
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Streamline Your
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Service Applications
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              GiftApp revolutionizes how service providers, reviewers, and administrators collaborate. 
              Join thousands of professionals who trust our platform for seamless application management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => handleNavigation('/register')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleNavigation('/login')}
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-all duration-300"
              >
                Already have an account?
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                  <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Applicants</h3>
                  <p className="text-sm text-gray-600">Submit and track applications</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                  <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Reviewers</h3>
                  <p className="text-sm text-gray-600">Review and approve applications</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                  <Building className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Admins</h3>
                  <p className="text-sm text-gray-600">Manage users and providers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Every Role
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides everything you need to manage service applications efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by Professionals Worldwide
          </h2>
          <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
            Join our growing community of service providers and administrators.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-purple-100">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-purple-100">Applications Processed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-purple-100">Uptime</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-purple-100">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what professionals are saying about GiftApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps and transform your application management process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Sign Up</h3>
              <p className="text-gray-600 leading-relaxed">
                Create your account and choose your role - whether you're an applicant, reviewer, or administrator.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Submit Application</h3>
              <p className="text-gray-600 leading-relaxed">
                Fill out your detailed application with business information and supporting documents.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Get Approved</h3>
              <p className="text-gray-600 leading-relaxed">
                Track your application status in real-time and receive notifications about updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Join thousands of professionals who have streamlined their application process with GiftApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleNavigation('/register')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleNavigation('/login')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We're here to help you succeed with your applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
              <Phone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">support@giftapp.com</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-purple-50 rounded-2xl">
              <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Business St, City, State</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">GiftApp</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Streamlining service provider applications with cutting-edge technology and user-friendly design.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className="text-gray-400 hover:text-white transition-colors">Testimonials</button></li>
                <li><button onClick={() => handleNavigation('/login')} className="text-gray-400 hover:text-white transition-colors">Login</button></li>
                <li><button onClick={() => handleNavigation('/register')} className="text-gray-400 hover:text-white transition-colors">Register</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors">Contact Us</button></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 GiftApp. All rights reserved. Built with ❤️ for service professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;