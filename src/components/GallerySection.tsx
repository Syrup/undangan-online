import { motion, useInView, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
// import satu from "../data/1.jpg";
// import dua from "../data/2.jpg";
// import tiga from "../data/3.jpg";
// import empat from "../data/4.jpg";
// import lima from "../data/5.jpg";
// import enam from "../data/6.jpg";
// import tujuh from "../data/7.jpg";
// import delapan from "../data/8.jpg";
// import sembilan from "../data/9.jpg";
// import sepuluh from "../data/10.jpg";
// import sebelas from "../data/11.jpg";
// import duabelas from "../data/12.jpg";
// import tigabelas from "../data/13.jpg";
// import empatbelas from "../data/14.jpg";
// import limabelas from "../data/15.jpg";
// import enambelas from "../data/16.jpg";
// import tujuhbelas from "../data/17.jpg";
// import delapanbelas from "../data/18.jpg";
// import weddingData from "../data/weddingData.json";

function useScrollAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return { ref, isInView };
}

// Generate array of image paths from 1.jpg to 18.jpg
const generateGalleryImages = () => {
  return Array.from({ length: 18 }, (_, index) => `/api/files/${index + 1}.jpg`);
};

// const galleryImages = [
//   satu, dua, tiga, empat, lima, enam, 
//   tujuh, delapan, sembilan, sepuluh, sebelas, duabelas,
//   tigabelas, empatbelas, limabelas, enambelas, tujuhbelas, delapanbelas
// ]

export function GallerySection() {
  const { ref, isInView } = useScrollAnimation();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const galleryImages = generateGalleryImages();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isModalOpen || selectedImage === null) return;

      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateImage('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateImage('next');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen, selectedImage]);

  const openModal = (index: number) => {
    setSelectedImage(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;

    if (direction === 'prev') {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    } else {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <>
      <section ref={ref} className="py-16 px-4 sm:px-8 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif text-white mb-4 drop-shadow-lg">Gallery</h2>
            <div className="divider divider-white w-24 mx-auto"></div>
            <p className="text-white">Ketuk gambar untuk melihat lebih besar</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {galleryImages.map((src, index) => (
              <motion.div
                key={index}
                className="aspect-square overflow-hidden rounded-lg shadow-lg cursor-pointer group bg-white/20 backdrop-blur-sm border border-white/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openModal(index)}
              >
                <div className="relative w-full h-full">
                  <img 
                    src={src} 
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    >
                      <svg 
                        className="w-8 h-8 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                        />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal - DaisyUI */}
      <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-full max-h-full w-screen h-screen p-0 bg-transparent shadow-none">
          {/* Backdrop with DaisyUI modal-backdrop */}
          <div className="modal-backdrop bg-black/80" onClick={closeModal}></div>
          
          {/* Modal Content */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 btn btn-circle btn-ghost text-white hover:bg-white/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 z-20 btn btn-circle btn-ghost text-white hover:bg-white/20"
              disabled={galleryImages.length <= 1}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 z-20 btn btn-circle btn-ghost text-white hover:bg-white/20"
              disabled={galleryImages.length <= 1}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image */}
            {selectedImage !== null && (
              <motion.div
                className="max-w-full max-h-full flex items-center justify-center"
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={galleryImages[selectedImage]}
                  alt={`Gallery ${selectedImage + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  style={{ maxHeight: 'calc(100vh - 8rem)' }}
                />
              </motion.div>
            )}

            {/* Image Counter */}
            {selectedImage !== null && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="badge badge-neutral badge-lg">
                  {selectedImage + 1} / {galleryImages.length}
                </div>
              </div>
            )}

            {/* Thumbnail Navigation */}
            {selectedImage !== null && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 max-w-full overflow-x-auto">
                <div className="flex gap-2 px-4">
                  {galleryImages.map((src, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === selectedImage 
                          ? 'border-primary scale-110' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                      whileHover={{ scale: index === selectedImage ? 1.1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={src}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
