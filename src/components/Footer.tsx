import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-red-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-red-900 font-bold text-lg">M</span>
              </div>
              <span className="text-white font-bold text-xl">SSF Muhimmath Daawa Sector</span>
            </div>
            <p className="text-red-200 mb-4 max-w-md">
              Fostering a generation of compassionate leaders through education, da'wa, and community service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-red-200 hover:text-yellow-300 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-red-200 hover:text-yellow-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-red-200 hover:text-yellow-300 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-red-200 hover:text-yellow-300 transition-colors">About Us</Link></li>
              <li><Link to="/gallery" className="text-red-200 hover:text-yellow-300 transition-colors">Gallery</Link></li>
              <li><Link to="/results" className="text-red-200 hover:text-yellow-300 transition-colors">Results</Link></li>
              <li><Link to="/news" className="text-red-200 hover:text-yellow-300 transition-colors">News</Link></li>
              <li><Link to="/contact" className="text-red-200 hover:text-yellow-300 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-yellow-300" />
                <span className="text-red-200 text-sm">Muhimmathul Muslimeen Education Center Kasaragod</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-yellow-300" />
                <span className="text-red-200 text-sm">+91 9400060851</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-yellow-300" />
                <span className="text-red-200 text-sm">eyemedia313@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-red-800 mt-8 pt-8 text-center">
          <p className="text-red-200"> Developed By <a href="https://ibrahimkhaleel.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-500 transition-colors">Ibrahim Khaleel Kattathar</a>.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
