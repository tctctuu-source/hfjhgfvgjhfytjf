import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Users, Newspaper, Image, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { HomepageBackground, GalleryItem, NewsItem } from '../types';

const Home: React.FC = () => {
  const [background, setBackground] = useState<HomepageBackground | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState({ bg: true, gallery: true, news: true });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (err: any, context: string) => {
      console.error(`Error fetching ${context}:`, err);
      setError("Could not load page content. Please ensure your Supabase project is connected and the credentials are correct.");
    };

    const fetchBackground = async () => {
      const { data, error } = await supabase
        .from('homepage_background')
        .select('*')
        .eq('is_active', true)
        .single();
      if (error) handleError(error, 'background');
      else setBackground(data);
      setLoading(prev => ({ ...prev, bg: false }));
    };

    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) handleError(error, 'gallery');
      else setGallery(data || []);
      setLoading(prev => ({ ...prev, gallery: false }));
    };

    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) handleError(error, 'news');
      else setNews(data || []);
      setLoading(prev => ({ ...prev, news: false }));
    };

    fetchBackground();
    fetchGallery();
    fetchNews();
  }, []);

  const HeroBackground = () => {
    if (loading.bg) {
      return <div className="absolute inset-0 bg-red-900 flex items-center justify-center"><Loader2 className="w-12 h-12 text-white animate-spin" /></div>;
    }
    if (!background || error) {
      return <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-red-700"></div>;
    }
    if (background.type === 'video') {
      return (
        <video
          className="absolute z-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={background.url}
        />
      );
    }
    return (
      <div
        className="absolute z-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${background.url})` }}
      />
    );
  };

  return (
    <div className="relative">
      {error && (
        <div className="bg-yellow-400 text-black p-3 text-center fixed top-16 left-0 right-0 z-[100] flex items-center justify-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroBackground />
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-white text-2xl md:text-3xl font-light mb-4 font-serif">SSF Daawa Sector</h2>
            <h1 className="text-yellow-400 text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-wider font-serif">
              Meem Fest
            </h1>
            <p className="text-white text-xl md:text-2xl font-light">
              <span className="text-yellow-300">2025</span> July 02 <span className="text-yellow-300">Muhimmathul Muslimeen Education Centre </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/results"
              className="bg-yellow-500 text-red-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors shadow-lg"
            >
              View Results
            </Link>
            <Link
              to="/about"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/30"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Explore SSF Muhimmath Daawa Sector</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the various aspects of our institution through these quick access points
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Trophy, title: 'Results', description: 'Check competition results and winners', link: '/results', color: 'bg-yellow-500' },
              { icon: Newspaper, title: 'Latest News', description: 'Stay updated with event announcements', link: '/news', color: 'bg-blue-500' },
              { icon: Image, title: 'Gallery', description: 'View photos from past events', link: '/gallery', color: 'bg-green-500' },
              { icon: Users, title: 'About Us', description: 'Learn about our mission and history', link: '/about', color: 'bg-purple-500' },
              { icon: Calendar, title: 'Events', description: 'Upcoming programs and schedule', link: '/news', color: 'bg-red-500' },
              { icon: MapPin, title: 'Contact', description: 'Get in touch with organizers', link: '/contact', color: 'bg-indigo-500' }
            ].map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                <Link to={item.link} className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow group">
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Gallery Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Gallery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A glimpse into the vibrant moments of Muhimmath.</p>
          </div>
          {loading.gallery ? <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div> :
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Link to="/gallery" className="block relative rounded-lg overflow-hidden group">
                    <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          }
          <div className="text-center mt-12">
            <Link to="/gallery" className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2 justify-center mx-auto w-fit">
              View More Photos <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">News & Announcements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Stay informed with the latest updates from our team.</p>
          </div>
          {loading.news ? <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div> :
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.15 }}>
                  <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 h-full flex flex-col">
                    <img src={item.image_url || 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/8B0000/FFFFFF?text=News'} alt={item.title} className="w-full h-40 object-cover" />
                    <div className="p-6 flex-grow flex flex-col">
                      <p className="text-sm text-red-600 font-semibold mb-2">{item.category}</p>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex-grow">{item.title}</h3>
                      <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          }
          <div className="text-center mt-12">
            <Link to="/news" className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2 justify-center mx-auto w-fit">
              View More News <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
