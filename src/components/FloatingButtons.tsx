import { motion } from "motion/react";
import { useState, useEffect } from "react";

export function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareInvitation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Undangan Pernikahan Andi & Sari',
        text: 'Anda diundang ke pernikahan Andi & Sari',
        url: window.location.href
      });
    } else {
      // Fallback untuk browser yang tidak support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link undangan telah disalin!');
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-3">
      {/* Share Button */}
      <motion.button
        className="btn btn-circle btn-secondary shadow-lg"
        onClick={shareInvitation}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3, duration: 0.5 }}
      >
        📤
      </motion.button>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          className="btn btn-circle btn-accent shadow-lg"
          onClick={scrollToTop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          ⬆️
        </motion.button>
      )}
    </div>
  );
}
