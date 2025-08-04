import { motion, useInView } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { createRSVP, getRSVPs, getRSVPStats, createWish, getWishes, type NewRSVP, type NewWish, type RSVP, type Wish } from "../lib/api";

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

export function RSVPWishesSection() {
  const { ref, isInView } = useScrollAnimation();
  
  // RSVP State
  const [rsvpData, setRsvpData] = useState<NewRSVP>({
    name: '',
    email: '',
    phone: '',
    attendance: 'hadir',
    guestCount: '0',
    isPublic: true,
  });
  
  // Wishes State
  const [wishData, setWishData] = useState<NewWish>({
    name: '',
    email: '',
    message: '',
    isPublic: true,
  });
  
  const [activeTab, setActiveTab] = useState<'rsvp' | 'wishes'>('rsvp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [stats, setStats] = useState<RSVPStats>({ total: 0, attending: 0, notAttending: 0, totalGuests: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadRSVPs(), loadWishes(), loadStats()]);
  };

  const loadRSVPs = async () => {
    const result = await getRSVPs(true);
    if (result.success && result.data) {
      setRsvps(result.data);
    }
  };

  const loadWishes = async () => {
    const result = await getWishes(true);
    if (result.success && result.data) {
      setWishes(result.data);
    }
  };

  const loadStats = async () => {
    const result = await getRSVPStats();
    if (result.success && result.data) {
      setStats(result.data);
    }
  };

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await createRSVP(rsvpData);
    
    if (result.success) {
      setSubmitStatus('success');
      setRsvpData({
        name: '',
        email: '',
        phone: '',
        attendance: 'hadir',
        guestCount: '0',
        isPublic: true,
      });
      loadData();
    } else {
      setSubmitStatus('error');
    }
    
    setIsSubmitting(false);
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await createWish(wishData);
    
    if (result.success) {
      setSubmitStatus('success');
      setWishData({
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

  const handleRSVPChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setRsvpData((prev: NewRSVP) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleWishChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setWishData((prev: NewWish) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <section ref={ref} className="py-16 px-4 sm:px-8">
      <div className="max-w-md mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-serif text-primary mb-4">RSVP & Ucapan</h2>
          <div className="divider divider-primary w-24 mx-auto"></div>
          <p className="text-base-100">Konfirmasi kehadiran dan berikan ucapan terbaik</p>
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

        {/* Tabs */}
        <motion.div
          className="tabs tabs-boxed bg-base-100 shadow-lg mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <button 
            className={`tab tab-lg flex-1 ${activeTab === 'rsvp' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('rsvp')}
          >
            RSVP
          </button>
          <button 
            className={`tab tab-lg flex-1 ${activeTab === 'wishes' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('wishes')}
          >
            Ucapan
          </button>
        </motion.div>

        {/* Forms */}
        <motion.div
          className="card bg-base-100 shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="card-body">
            {activeTab === 'rsvp' ? (
              <form onSubmit={handleRSVPSubmit} className="space-y-4">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Nama Lengkap *" 
                  className="input input-bordered w-full" 
                  value={rsvpData.name}
                  onChange={handleRSVPChange}
                  required
                />
                
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email (opsional)" 
                  className="input input-bordered w-full" 
                  value={rsvpData.email || ''}
                  onChange={handleRSVPChange}
                />

                <input 
                  type="tel" 
                  name="phone"
                  placeholder="No. Telepon (opsional)" 
                  className="input input-bordered w-full" 
                  value={rsvpData.phone || ''}
                  onChange={handleRSVPChange}
                />
                
                <select 
                  name="attendance"
                  className="select select-bordered w-full"
                  value={rsvpData.attendance}
                  onChange={handleRSVPChange}
                  required
                >
                  <option value="hadir">Hadir</option>
                  <option value="tidak_hadir">Tidak Hadir</option>
                </select>
                
                {rsvpData.attendance === 'hadir' && (
                  <input 
                    type="number" 
                    name="guestCount"
                    placeholder="Jumlah Tamu" 
                    className="input input-bordered w-full" 
                    min="1"
                    max="10"
                    // value={rsvpData.guestCount || ''}
                    onChange={handleRSVPChange}
                  />
                )}

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Publikasikan RSVP saya</span> 
                    <input 
                      type="checkbox" 
                      name="isPublic"
                      className="checkbox checkbox-primary" 
                      checked={rsvpData.isPublic}
                      onChange={handleRSVPChange}
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
              </form>
            ) : (
              <form onSubmit={handleWishSubmit} className="space-y-4">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Nama Anda *" 
                  className="input input-bordered w-full" 
                  value={wishData.name}
                  onChange={handleWishChange}
                  required
                />
                
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email (opsional)" 
                  className="input input-bordered w-full" 
                  value={wishData.email || ''}
                  onChange={handleWishChange}
                />
                
                <textarea 
                  name="message"
                  className="textarea textarea-bordered w-full" 
                  placeholder="Ucapan & Doa untuk kedua mempelai *"
                  rows={4}
                  value={wishData.message}
                  onChange={handleWishChange}
                  required
                />

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Publikasikan ucapan saya</span> 
                    <input 
                      type="checkbox" 
                      name="isPublic"
                      className="checkbox checkbox-primary" 
                      checked={wishData.isPublic}
                      onChange={handleWishChange}
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
              </form>
            )}

            {submitStatus === 'success' && (
              <div className="alert alert-success mt-4">
                <span>✅ {activeTab === 'rsvp' ? 'RSVP' : 'Ucapan'} berhasil dikirim!</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="alert alert-error mt-4">
                <span>❌ Gagal mengirim {activeTab === 'rsvp' ? 'RSVP' : 'ucapan'}. Silakan coba lagi.</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Combined List */}
        <motion.div
          className="mt-8 space-y-6"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* RSVP List */}
          {rsvps.length > 0 && (
            <div>
              <h3 className="text-lg font-serif text-primary mb-4 text-center">
                Konfirmasi Kehadiran ({rsvps.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {rsvps.map((rsvp, index) => (
                  <motion.div
                    key={rsvp.id}
                    className="card bg-base-100 shadow-sm border-l-4 border-primary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    <div className="card-body p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-primary text-sm">{rsvp.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-neutral">
                            <span className={`badge ${rsvp.attendance === 'hadir' ? 'badge-success' : 'badge-error'} badge-xs`}>
                              {rsvp.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                            </span>
                            {rsvp.attendance === 'hadir' && rsvp.guestCount && (
                              <span>• {rsvp.guestCount} tamu</span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-neutral">
                          {new Date(rsvp.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Wishes List */}
          {wishes.length > 0 && (
            <div>
              <h3 className="text-lg font-serif text-primary mb-4 text-center">
                Ucapan & Doa ({wishes.length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {wishes.map((wish, index) => (
                  <motion.div
                    key={wish.id}
                    className="card bg-base-100 shadow-sm border-l-4 border-secondary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  >
                    <div className="card-body p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-primary text-sm">{wish.name}</h4>
                        <span className="text-xs text-neutral">
                          {new Date(wish.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-neutral leading-relaxed">
                        "{wish.message}"
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
