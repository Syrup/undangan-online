import { useState } from 'react';
import { createShareableURL } from './DynamicMeta';
import weddingData from '../data/weddingData.json';

interface ShareButtonProps {
  guestName?: string;
  className?: string;
}

export function ShareButton({ guestName, className = "" }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: guestName 
      ? `${guestName}, Anda diundang ke Pernikahan ${weddingData.hero.coupleNames}`
      : `Undangan Pernikahan ${weddingData.hero.coupleNames}`,
    text: guestName
      ? `${guestName}, dengan senang hati kami mengundang Anda untuk menghadiri pernikahan ${weddingData.couple.groom.name} & ${weddingData.couple.bride.name} pada ${weddingData.hero.date}.`
      : weddingData.sharing.text,
    url: createShareableURL(guestName)
  };

  const handleShare = async () => {
    if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = createShareableURL(guestName, 'whatsapp');
    const message = encodeURIComponent(`${shareData.text}\n\n${whatsappUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareToFacebook = () => {
    const facebookUrl = createShareableURL(guestName, 'facebook');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(facebookUrl)}`, '_blank');
  };

  const shareToTwitter = () => {
    const twitterUrl = createShareableURL(guestName, 'twitter');
    const tweet = encodeURIComponent(`${shareData.title}\n${shareData.text}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}&url=${encodeURIComponent(twitterUrl)}`, '_blank');
  };

  const shareToInstagram = () => {
    // Instagram doesn't have direct URL sharing, so we copy to clipboard
    copyToClipboard();
    alert('Link copied! Paste this in your Instagram story or bio.');
  };

  return (
    <>
      <button
        onClick={handleShare}
        className={`btn btn-primary ${className}`}
        title="Bagikan undangan"
      >
        📤 Bagikan
      </button>

      {/* Share Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Bagikan Undangan</h3>
            
            <div className="space-y-3">
              {/* Copy Link */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareData.url}
                  readOnly
                  className="input input-bordered flex-1 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className={`btn btn-sm ${copied ? 'btn-success' : 'btn-primary'}`}
                >
                  {copied ? '✓' : '📋'}
                </button>
              </div>

              {/* Share Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={shareToWhatsApp}
                  className="btn btn-success btn-sm"
                >
                  💬 WhatsApp
                </button>
                <button
                  onClick={shareToFacebook}
                  className="btn btn-primary btn-sm"
                >
                  📘 Facebook
                </button>
                <button
                  onClick={shareToTwitter}
                  className="btn btn-info btn-sm"
                >
                  🐦 Twitter
                </button>
                <button
                  onClick={shareToInstagram}
                  className="btn btn-secondary btn-sm"
                >
                  📸 Instagram
                </button>
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowModal(false)}
                className="btn"
              >
                Tutup
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowModal(false)} />
        </div>
      )}
    </>
  );
}

// Component for generating invitation links for specific guests
export function InvitationGenerator() {
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const generateLink = () => {
    if (guestName.trim()) {
      const link = createShareableURL(guestName.trim());
      setGeneratedLink(link);
    }
  };

  const copyGeneratedLink = async () => {
    if (generatedLink) {
      try {
        await navigator.clipboard.writeText(generatedLink);
        alert('Link berhasil disalin!');
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  return (
    <div className="card bg-base-100 shadow-md p-4">
      <h3 className="font-bold text-lg mb-4">Generate Link Undangan Personal</h3>
      
      <div className="space-y-3">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nama Tamu</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan nama tamu..."
            className="input input-bordered"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateLink()}
          />
        </div>

        <button
          onClick={generateLink}
          className="btn btn-primary w-full"
          disabled={!guestName.trim()}
        >
          Generate Link
        </button>

        {generatedLink && (
          <div className="space-y-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Link Personal</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="input input-bordered flex-1 text-sm"
                />
                <button
                  onClick={copyGeneratedLink}
                  className="btn btn-primary btn-sm"
                >
                  📋
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Link ini akan menampilkan undangan personal untuk <strong>{guestName}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
