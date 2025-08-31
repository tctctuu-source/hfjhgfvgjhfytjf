import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';

import { Result } from '../types';
import Poster1 from './posters/Poster1';
import Poster2 from './posters/Poster2';
import Poster3 from './posters/Poster3';
import Poster4 from './posters/Poster4';
import Poster5 from './posters/Poster5';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    program: { event: string; category: string };
    winners: Result[];
  } | null;
}

const posters = [Poster1, Poster2, Poster3, Poster4, Poster5];

const PosterModal: React.FC<PosterModalProps> = ({ isOpen, onClose, data }) => {
  const [activeStyle, setActiveStyle] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

  const ActivePoster = posters[activeStyle];

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(posterRef.current, { cacheBust: true, quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `muhimmath-result-${data.program.event.toLowerCase().replace(/\s/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
      alert('Sorry, there was an error downloading the poster.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Result: ${data.program.event}`,
      text: `Check out the results for ${data.program.event} - ${data.program.category} from Muhimmath!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Failed to share', err);
      alert('Sharing failed. You can copy the link from the address bar.');
    }
  };

  const nextStyle = () => setActiveStyle((prev) => (prev + 1) % posters.length);
  const prevStyle = () => setActiveStyle((prev) => (prev - 1 + posters.length) % posters.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gray-800 rounded-2xl w-full max-w-5xl h-full max-h-[95vh] flex flex-col lg:flex-row overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Poster Preview */}
            <div className="flex-grow bg-gray-900 flex items-center justify-center p-4 lg:p-8 overflow-auto">
              <div ref={posterRef} className="w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] shadow-2xl">
                <ActivePoster program={data.program} winners={data.winners} />
              </div>
            </div>

            {/* Controls */}
            <div className="w-full lg:w-72 bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-700 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-white text-xl font-bold mb-1">Result Poster</h3>
                <p className="text-gray-400 text-sm mb-6">Download or share this result</p>

                <div className="space-y-4">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors disabled:opacity-50"
                  >
                    {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    {isDownloading ? 'Downloading...' : 'Download Poster'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Result
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm text-center mb-2">Change Style</p>
                <div className="flex items-center justify-between">
                  <button onClick={prevStyle} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 text-white"><ArrowLeft size={20} /></button>
                  <span className="text-white font-mono">{activeStyle + 1} / {posters.length}</span>
                  <button onClick={nextStyle} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 text-white"><ArrowRight size={20} /></button>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 z-10"><X size={24} /></button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PosterModal;
