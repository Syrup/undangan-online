import { motion, useInView } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { createWish, getWishes, type NewWish, type Wish } from "../lib/api";

function useScrollAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return { ref, isInView };
}

export function WishesSection() {
  const { ref, isInView } = useScrollAnimation();
  const [formData, setFormData] = useState<NewWish>({
    name: '',
    email: '',
    message: '',
    isPublic: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    loadWishes();
  }, []);

  const loadWishes = async () => {
    const result = await getWishes(true);
    if (result.success && result.data) {
      setWishes(result.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await createWish(formData);
    
    if (result.success) {
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        message: '',
        isPublic: true,
      });
      loadWishes();
    } else {
      setSubmitStatus('error');
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: NewWish) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <section ref={ref} className="py-16 px-4 sm:px-8 bg-accent/10">
      <div className="max-w-md mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-serif text-primary mb-4">Ucapan & Doa</h2>
          <div className="divider divider-primary w-24 mx-auto"></div>
          <p className="text-neutral">Berikan ucapan dan doa terbaik untuk kami</p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="card bg-base-100 shadow-lg mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                name="name"
                placeholder="Nama Anda *" 
                className="input input-bordered w-full" 
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              
              <input 
                type="email" 
                name="email"
                placeholder="Email (opsional)" 
                className="input input-bordered w-full" 
                value={formData.email || ''}
                onChange={handleInputChange}
              />
              
              <textarea 
                name="message"
                className="textarea textarea-bordered w-full" 
                placeholder="Ucapan & Doa untuk kedua mempelai *"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                required
              />

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Publikasikan ucapan saya</span> 
                  <input 
                    type="checkbox" 
                    name="isPublic"
                    className="checkbox checkbox-primary" 
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              
              <motion.button 
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Mengirim...
                  </>
                ) : (
                  'Kirim Ucapan'
                )}
              </motion.button>

              {submitStatus === 'success' && (
                <div className="alert alert-success">
                  <span>✅ Ucapan berhasil dikirim!</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="alert alert-error">
                  <span>❌ Gagal mengirim ucapan. Silakan coba lagi.</span>
                </div>
              )}
            </form>
          </div>
        </motion.div>

        {/* Wishes List */}
        {wishes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className="text-xl font-serif text-primary mb-6 text-center">
              Ucapan dari Teman & Keluarga ({wishes.length})
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {wishes.map((wish, index) => (
                <motion.div
                  key={wish.id}
                  className="card bg-base-100 shadow-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="card-body p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-primary">{wish.name}</h4>
                      <span className="text-xs text-neutral">
                        {new Date(wish.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-neutral leading-relaxed">
                      "{wish.message}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
