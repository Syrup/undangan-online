import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface PreloaderProps {
  onLoadComplete: () => void;
}

interface AssetLoadStatus {
  backgroundImage: boolean;
  galleryImages: boolean[];
  audio: boolean;
}

export function Preloader({ onLoadComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Memuat...");
  const [loadStatus, setLoadStatus] = useState<AssetLoadStatus>({
    backgroundImage: false,
    galleryImages: Array(18).fill(false),
    audio: false,
  });

  useEffect(() => {
    const loadAssets = async () => {
      const totalAssets = 20; // 1 background + 18 gallery images + 1 audio
      let loadedAssets = 0;

      const updateProgress = (assetType: string, index?: number) => {
        loadedAssets++;
        const newProgress = Math.round((loadedAssets / totalAssets) * 100);
        setProgress(newProgress);
        
        // Update specific asset status
        setLoadStatus(prev => {
          const newStatus = { ...prev };
          if (assetType === 'background') {
            newStatus.backgroundImage = true;
          } else if (assetType === 'gallery' && index !== undefined) {
            newStatus.galleryImages[index] = true;
          } else if (assetType === 'audio') {
            newStatus.audio = true;
          }
          return newStatus;
        });
        
        // Update loading text based on progress
        if (newProgress < 20) {
          setLoadingText("Memuat latar belakang...");
        } else if (newProgress < 90) {
          setLoadingText(`Memuat galeri... (${loadedAssets - 1}/18)`);
        } else if (newProgress < 100) {
          setLoadingText("Memuat musik...");
        } else {
          setLoadingText("Selesai!");
          // Complete loading after a short delay
          setTimeout(() => {
            onLoadComplete();
          }, 800);
        }
      };

      // Create promises for all assets
      const assetPromises: Promise<void>[] = [];
      
      // Load background image
      assetPromises.push(
        new Promise<void>((resolve) => {
          const bgImage = new Image();
          bgImage.onload = () => {
            updateProgress('background');
            resolve();
          };
          bgImage.onerror = () => {
            console.warn('Failed to load background image');
            updateProgress('background');
            resolve();
          };
          bgImage.src = "/api/files/first.jpg";
        })
      );

      // Load gallery images (1-18)
      for (let i = 1; i <= 18; i++) {
        const imageIndex = i - 1;
        assetPromises.push(
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              updateProgress('gallery', imageIndex);
              resolve();
            };
            img.onerror = () => {
              console.warn(`Failed to load gallery image ${i}`);
              updateProgress('gallery', imageIndex);
              resolve();
            };
            img.src = `/api/files/${i}.jpg`;
          })
        );
      }

      // Load audio
      assetPromises.push(
        new Promise<void>((resolve) => {
          const audio = new Audio();
          audio.oncanplaythrough = () => {
            updateProgress('audio');
            resolve();
          };
          audio.onerror = () => {
            console.warn('Failed to load audio');
            updateProgress('audio');
            resolve();
          };
          audio.onloadeddata = () => {
            updateProgress('audio');
            resolve();
          };
          audio.src = "/api/files/music.mp3";
          audio.preload = "auto";
          audio.load();
        })
      );

      // Start loading all assets
      try {
        await Promise.all(assetPromises);
      } catch (error) {
        console.error('Error loading assets:', error);
        // Continue anyway
        setTimeout(() => {
          onLoadComplete();
        }, 1000);
      }
    };

    loadAssets();
  }, [onLoadComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-primary via-secondary to-accent flex flex-col justify-center items-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-center text-white max-w-sm mx-auto px-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Wedding rings animation */}
        <motion.div
          className="text-6xl mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          💍
        </motion.div>
        
        <h1 className="text-3xl font-serif mb-2">Wedding Invitation</h1>
        <h2 className="text-xl font-script mb-8 opacity-90">Bagas & Melani</h2>
        
        {/* Progress bar */}
        <div className="w-64 bg-white/20 rounded-full h-3 mb-4 backdrop-blur-sm overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-white to-pink-200 h-3 rounded-full shadow-lg"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        
        <p className="text-sm opacity-80 mb-2">{loadingText}</p>
        <p className="text-xs opacity-60">{progress}%</p>
        
        {/* Loading indicators */}
        <div className="mt-6 flex justify-center space-x-2">
          <motion.div
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              loadStatus.backgroundImage ? 'bg-white' : 'bg-white/30'
            }`}
            animate={loadStatus.backgroundImage ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              loadStatus.galleryImages.every(loaded => loaded) ? 'bg-white' : 'bg-white/30'
            }`}
            animate={loadStatus.galleryImages.every(loaded => loaded) ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              loadStatus.audio ? 'bg-white' : 'bg-white/30'
            }`}
            animate={loadStatus.audio ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
      
      {/* Floating hearts animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/20 text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -60, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            {i % 2 === 0 ? '💕' : '💖'}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
