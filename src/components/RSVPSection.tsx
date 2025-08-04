import { motion, useInView } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { createRSVP, getRSVPs, getRSVPStats, type NewRSVP, type RSVP } from "../lib/api";

interface RSVPStats {
  total: number;
  attending: number;
  notAttending: number;
  totalGuests: number;
}

function useScrollAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return { ref, isInView };
}

export function RSVPSection() {
  const { ref, isInView } = useScrollAnimation();
  const [formData, setFormData] = useState<NewRSVP>({
    name: '',
    email: '',
    phone: '',
    attendance: 'hadir',
    guestCount: '1',
    // message: '',
    isPublic: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [stats, setStats] = useState<RSVPStats>({ total: 0, attending: 0, notAttending: 0, totalGuests: 0 });

  useEffect(() => {
    loadRSVPs();
    loadStats();
  }, []);

  const loadRSVPs = async () => {
    const result = await getRSVPs(true);
    if (result.success && result.data) {
      setRsvps(result.data);
    }
  };

  const loadStats = async () => {
    const result = await getRSVPStats();
    if (result.success && result.data) {
      setStats(result.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await createRSVP(formData);
    
    if (result.success) {
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        attendance: 'hadir',
        guestCount: '1',
        // message: '',
        isPublic: true,
      });
      loadRSVPs();
      loadStats();
    } else {
      setSubmitStatus('error');
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: NewRSVP) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <section ref={ref} className="py-16 px-4 sm:px-8 bg-primary/10">
      <div className="max-w-md mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-serif text-primary mb-4">RSVP</h2>
          <div className="divider divider-primary w-24 mx-auto"></div>
          <p className="text-neutral">Konfirmasi kehadiran Anda</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="stat bg-base-100 rounded-lg shadow-lg p-4">
            <div className="stat-title text-sm">Hadir</div>
            <div className="stat-value text-primary text-xl">{stats.attending}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-lg p-4">
            <div className="stat-title text-sm">Total Tamu</div>
            <div className="stat-value text-secondary text-xl">{stats.totalGuests}</div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          className="card bg-base-100 shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                name="name"
                placeholder="Nama Lengkap *" 
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

              <input 
                type="tel" 
                name="phone"
                placeholder="No. Telepon (opsional)" 
                className="input input-bordered w-full" 
                value={formData.phone || ''}
                onChange={handleInputChange}
              />
              
              <select 
                name="attendance"
                className="select select-bordered w-full"
                value={formData.attendance}
                onChange={handleInputChange}
                required
              >
                <option value="hadir">Hadir</option>
                <option value="tidak_hadir">Tidak Hadir</option>
              </select>
              
              {formData.attendance === 'hadir' && (
                <input 
                  type="number" 
                  name="guestCount"
                  placeholder="Jumlah Tamu" 
                  className="input input-bordered w-full" 
                  min="1"
                  max="10"
                  value={formData.guestCount || ''}
                  onChange={handleInputChange}
                />
              )}
              
              <textarea 
                name="message"
                className="textarea textarea-bordered w-full" 
                placeholder="Ucapan & Doa (opsional)"
                rows={4}
                // value={formData.message || ''}
                onChange={handleInputChange}
              />

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Publikasikan RSVP saya</span> 
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
                  'Kirim RSVP'
                )}
              </motion.button>

              {submitStatus === 'success' && (
                <div className="alert alert-success">
                  <span>✅ RSVP berhasil dikirim!</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="alert alert-error">
                  <span>❌ Gagal mengirim RSVP. Silakan coba lagi.</span>
                </div>
              )}
            </form>
          </div>
        </motion.div>

        {/* RSVP List */}
        {rsvps.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h3 className="text-xl font-serif text-primary mb-4 text-center">Konfirmasi Kehadiran</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {rsvps.map((rsvp, index) => (
                <motion.div
                  key={rsvp.id}
                  className="card bg-base-100 shadow-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="card-body p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-primary">{rsvp.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-neutral">
                          <span className={`badge ${rsvp.attendance === 'hadir' ? 'badge-success' : 'badge-error'} badge-sm`}>
                            {rsvp.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                          </span>
                          {rsvp.attendance === 'hadir' && rsvp.guestCount && (
                            <span className="text-xs">• {rsvp.guestCount} tamu</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-neutral">
                        {new Date(rsvp.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    {/* {rsvp.message && (
                      <p className="text-sm text-neutral mt-2 italic">"{rsvp.message}"</p>
                    )} */}
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
