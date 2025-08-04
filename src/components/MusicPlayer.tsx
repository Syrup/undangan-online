import { motion } from "motion/react";
import { useState } from "react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
    // Implementasi audio player bisa ditambahkan di sini
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
    >
      <motion.button
        className={`btn btn-circle btn-primary shadow-lg ${isPlaying ? 'btn-secondary' : ''}`}
        onClick={toggleMusic}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={isPlaying ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
      >
        {isPlaying ? "🎵" : "🎶"}
      </motion.button>
    </motion.div>
  );
}
