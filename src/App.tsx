import "./index.css";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { useInView } from "motion/react";
import { CountdownTimer } from "./components/CountdownTimer";
import { QuoteSection } from "./components/QuoteSection";
import { RSVPWishesSection } from "./components/RSVPWishesSection";
import { GallerySection } from "./components/GallerySection";
import { Preloader } from "./components/Preloader";
import { DynamicMeta, generateDynamicMeta, WeddingSchema } from "./components/DynamicMeta";
import { ShareButton } from "./components/ShareButton";
import weddingData from "./data/weddingData.json";

function useScrollAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return { ref, isInView };
}

function HeroSection({ isPlaying, toggleMusic, isAudioLoading, guestName }: { isPlaying: boolean; toggleMusic: () => void; isAudioLoading: boolean; guestName?: string }) {
  const [buttonsVisible, setButtonsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonsVisible(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const scrollToQuote = () => {
    const quoteSection = document.getElementById('quote-section');
    if (quoteSection) {
      quoteSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <motion.section 
      className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 relative text-base-100 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <motion.div
        className="text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <motion.button
          className={`btn btn-circle shadow-lg ${isPlaying ? 'btn-secondary' : 'btn-primary'} border-2 text-lg mb-6 ${isAudioLoading ? 'loading' : ''}`}
          onClick={toggleMusic}
          disabled={isAudioLoading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          {isAudioLoading ? "⏳" : (isPlaying ? "🎵" : "🎶")}
        </motion.button>
        
        <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-wide drop-shadow-lg">
          {guestName ? `${guestName}, ` : ""}{weddingData.hero.title}
        </h1>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto my-6"></div>
        <h2 className="text-2xl md:text-3xl font-script text-white mb-8 tracking-wider drop-shadow-lg">{weddingData.hero.coupleNames}</h2>
        
        <motion.div
          className="space-y-2 text-white drop-shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p className="text-lg font-elegant tracking-wide">{weddingData.hero.date}</p>
          <p className="text-base font-elegant opacity-80">Pukul {weddingData.hero.time}</p>
        </motion.div>

        <motion.button
          className="btn btn-primary mt-8 rounded-full px-8 font-elegant tracking-wider text-white border-2 border-white bg-white/20 backdrop-blur-sm hover:bg-white hover:text-primary transition-all duration-300"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToQuote}
        >
          Buka Undangan
        </motion.button>

        {/* Share Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="mt-4"
        >
          <ShareButton 
            guestName={guestName}
            className="rounded-full px-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function CoupleSection() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 px-4 sm:px-8 lg:px-16 relative z-10">
      <div className="max-w-md lg:max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-serif text-white mb-4 drop-shadow-lg">Mempelai</h2>
          <div className="divider divider-white w-24 mx-auto"></div>
        </motion.div>

        <div className="space-y-12 lg:flex lg:space-y-0 lg:space-x-8 lg:items-center lg:justify-center">
          <motion.div
            className="card bg-white/20 backdrop-blur-sm shadow-lg text-white border border-white/30 lg:w-80"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="card-body text-center">
              <div className="avatar mb-4">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={weddingData.couple.groom.photo} alt="Mempelai Pria" />
                </div>
              </div>
              <h3 className="card-title text-white justify-center">{weddingData.couple.groom.name}</h3>
              <b className="text-sm text-white/80">Putra dari</b>
              <p className="text-sm font-medium text-white">{weddingData.couple.groom.parents}</p>
            </div>
          </motion.div>

          <motion.div
            className="text-center lg:mx-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="text-6xl text-white drop-shadow-lg">💕</div>
          </motion.div>

          <motion.div
            className="card bg-white/20 backdrop-blur-sm shadow-lg text-white border border-white/30 lg:w-80"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="card-body text-center">
              <div className="avatar mb-4">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={weddingData.couple.bride.photo} alt="Mempelai Wanita" />
                </div>
              </div>
              <h3 className="card-title text-white justify-center">{weddingData.couple.bride.name}</h3>
              <b className="text-sm text-white/80">Putri dari</b>
              <p className="text-sm font-medium text-white">{weddingData.couple.bride.parents}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function EventSection() {
  const { ref, isInView } = useScrollAnimation();
  const openMaps = () => {
    window.open(weddingData.maps.url, "_blank");
  }

  return (
    <section ref={ref} className="py-16 px-4 sm:px-8 lg:px-16 relative z-10">
      <div className="max-w-md lg:max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-serif text-white mb-4 drop-shadow-lg">Acara</h2>
          <div className="divider divider-white w-24 mx-auto"></div>
        </motion.div>

        <div className="space-y-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
          {weddingData.events.map((event, index) => (
            <motion.div
              key={index}
              className="card bg-white/20 backdrop-blur-sm shadow-lg border border-white/30"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <div className="card-body text-center">
                <h3 className="card-title text-white justify-center">{event.type}</h3>
                <div className="space-y-2 text-white">
                  <p>📅 {event.date}</p>
                  <p>⏰ {event.time}</p>
                  <p>📍 {event.venue}</p>
                  <p className="text-sm">{event.address}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <button className="btn btn-primary mt-8 rounded-full px-8 font-elegant tracking-wider text-white border-2 border-white bg-white/20 backdrop-blur-sm hover:bg-white hover:text-primary transition-all duration-300" onClick={openMaps}>
            📍 Buka Maps
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function StorySection() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 px-4 sm:px-8 lg:px-16 relative z-10">
      <div className="max-w-md lg:max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-serif text-white mb-4 drop-shadow-lg">Our Story</h2>
          <div className="divider divider-white w-24 mx-auto"></div>
          <p className="text-white text-sm">Perjalanan cinta kami</p>
        </motion.div>

        <div className="space-y-8">
          {weddingData.story.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
  
              {index < weddingData.story.length - 1 && (
                <div className="absolute left-1/2 top-20 w-0.5 h-16 bg-primary/30 transform -translate-x-1/2 z-0"></div>
              )}

              <div className={`card bg-white/20 backdrop-blur-sm shadow-lg relative z-10 text-white border border-white/30`}>
                <div className="card-body text-center p-6">
      
                  <motion.div
                    className="text-4xl mb-3"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                  >
                    {step.icon}
                  </motion.div>
                  
      
                  <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                  <div className="badge badge-primary badge-sm mb-3">{step.date}</div>
                  
      
                  <p className="text-sm text-white leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center mt-12 p-6 bg-white/20 backdrop-blur-sm rounded-lg shadow-lg border border-white/30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="text-2xl mb-3">🌟</div>
          <p className="text-sm text-white/90 italic">
            "Cinta sejati tidak pernah berakhir. Cinta yang berakhir bukanlah cinta sejati."
          </p>
          <p className="text-xs text-primary mt-2 font-medium">- Andi & Sari</p>
        </motion.div>
      </div>
    </section>
  );
}

function FooterSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-8 px-4 sm:px-8 lg:px-16 relative z-10">
      <div className="max-w-md lg:max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-2xl font-serif mb-4 text-white drop-shadow-lg">Terima Kasih</h3>
          <p className="mb-4 font-elegant opacity-90 text-white">{weddingData.footer.thankYouMessage}</p>
          
          <motion.button
            className="btn btn-circle btn-primary mb-4 border-2 hover:bg-transparent hover:text-primary"
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            ⬆️
          </motion.button>
          
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto my-4"></div>
          <p className="text-sm opacity-75 font-elegant text-white">{weddingData.footer.signature}</p>
          <p className="text-xs opacity-50 mt-2 font-elegant text-white">{weddingData.footer.madeWithLove}</p>
        </motion.div>
      </div>
    </footer>
  );
}

export function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get dynamic meta data from URL parameters
  const [dynamicMetaData, setDynamicMetaData] = useState<{
    guestName: string | null;
    customDescription: string;
    customImage: string;
    customUrl: string;
  } | null>(null);

  useEffect(() => {
    // Generate dynamic meta tags based on URL parameters
    const metaData = generateDynamicMeta();
    setDynamicMetaData(metaData);
  }, []);

  useEffect(() => {
    if (audioRef.current && isLoaded) {
      const audio = audioRef.current;
      audio.volume = 0.5; // Set volume to 50%
      audio.loop = true; // Enable loop
      
      // Add event listeners for better state management
      const handleCanPlay = () => {
        console.log('Audio can play');
      };
      
      const handleError = (e: Event) => {
        console.error('Audio error:', e);
        setIsPlaying(false);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
      };
      
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      audio.addEventListener('ended', handleEnded);
      
      // Autoplay with user interaction check
      const playAudio = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          // Autoplay was prevented, user interaction required
          console.log("Autoplay prevented, user interaction required");
          setIsPlaying(false);
        }
      };
      
      // Try to autoplay after a short delay
      const timer = setTimeout(playAudio, 1000);
      
      return () => {
        clearTimeout(timer);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [isLoaded]);

  const toggleMusic = async () => {
    if (audioRef.current && !isAudioLoading) {
      setIsAudioLoading(true);
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          // Reset audio to beginning if it has ended
          if (audioRef.current.ended) {
            audioRef.current.currentTime = 0;
          }
          
          // Ensure any previous play promise is resolved
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error playing/pausing audio:', error);
        // If there's an error, try to reset the audio state
        setIsPlaying(false);
      } finally {
        setIsAudioLoading(false);
      }
    }
  };

  const handleLoadComplete = () => {
    setIsLoaded(true);
  };

  return (
    <>
      {/* Dynamic Meta Tags */}
      {dynamicMetaData && (
        <DynamicMeta
          title={dynamicMetaData.guestName 
            ? `${dynamicMetaData.guestName}, Anda diundang ke Pernikahan ${weddingData.hero.coupleNames}`
            : undefined
          }
          description={dynamicMetaData.customDescription}
          image={dynamicMetaData.customImage}
          url={dynamicMetaData.customUrl}
          guestName={dynamicMetaData.guestName || undefined}
        />
      )}
      
      {/* Wedding Schema for SEO */}
      <WeddingSchema />
      
      <AnimatePresence>
        {!isLoaded && (
          <Preloader onLoadComplete={handleLoadComplete} />
        )}
      </AnimatePresence>
      
      {isLoaded && (
        <motion.div 
          className="min-h-screen w-full wedding-container font-elegant relative overflow-hidden"
          style={{
            backgroundColor: '#000000',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/api/files/first.jpg)`
          }}
          data-theme="elegant"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <audio ref={audioRef} preload="auto">
            <source src="/api/files/music.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <HeroSection 
            isPlaying={isPlaying} 
            toggleMusic={toggleMusic} 
            isAudioLoading={isAudioLoading}
            guestName={dynamicMetaData?.guestName || undefined}
          />
          <QuoteSection />
          <CoupleSection />
          <CountdownTimer />
          <EventSection />
          <StorySection />
          <GallerySection />
          <RSVPWishesSection />
          <FooterSection />
        </motion.div>
      )}
    </>
  );
}

export default App;
