import { useEffect } from 'react';
import weddingData from '../data/weddingData.json';

interface DynamicMetaProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  guestName?: string;
}

export function DynamicMeta({ 
  title, 
  description, 
  image, 
  url,
  guestName 
}: DynamicMetaProps) {
  
  useEffect(() => {
    // Generate dynamic content based on wedding data
    const coupleNames = weddingData.hero.coupleNames;
    const weddingDate = weddingData.hero.date;
    const groomName = weddingData.couple.groom.name;
    const brideName = weddingData.couple.bride.name;
    
    // Create personalized title
    const dynamicTitle = guestName 
      ? `${guestName}, Anda diundang ke Pernikahan ${coupleNames} - ${weddingDate}`
      : title || `Undangan Pernikahan ${coupleNames} - ${weddingDate}`;
    
    // Create personalized description
    const dynamicDescription = guestName
      ? `${guestName}, dengan senang hati kami mengundang Anda untuk menghadiri pernikahan ${groomName} & ${brideName} pada ${weddingDate}.`
      : description || `Dengan senang hati kami mengundang Anda untuk menghadiri pernikahan ${groomName} & ${brideName} pada ${weddingDate}.`;
    
    // Update document title
    document.title = dynamicTitle;
    
    // Update meta description
    updateMetaTag('name', 'description', dynamicDescription);
    updateMetaTag('name', 'title', dynamicTitle);
    
    // Update Open Graph tags
    updateMetaTag('property', 'og:title', dynamicTitle);
    updateMetaTag('property', 'og:description', dynamicDescription);
    updateMetaTag('property', 'og:url', url || window.location.href);
    
    if (image) {
      updateMetaTag('property', 'og:image', image);
      updateMetaTag('property', 'twitter:image', image);
    }
    
    // Update Twitter Card tags
    updateMetaTag('property', 'twitter:title', dynamicTitle);
    updateMetaTag('property', 'twitter:description', dynamicDescription);
    updateMetaTag('property', 'twitter:url', url || window.location.href);
    
    // Update wedding specific meta tags
    updateMetaTag('property', 'wedding:couple', `${groomName} & ${brideName}`);
    updateMetaTag('property', 'wedding:date', weddingData.countdown.weddingDate.split('T')[0]);
    
    if (guestName) {
      updateMetaTag('property', 'wedding:guest', guestName);
    }
    
  }, [title, description, image, url, guestName]);

  return null; // This component doesn't render anything
}

// Helper function to update meta tags
function updateMetaTag(attribute: string, value: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
  
  if (element) {
    element.setAttribute('content', content);
  } else {
    // Create new meta tag if it doesn't exist
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    element.setAttribute('content', content);
    document.getElementsByTagName('head')[0].appendChild(element);
  }
}

// Function to generate dynamic meta tags based on URL parameters
export function generateDynamicMeta() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('guest');
  const utm_source = urlParams.get('utm_source');
  const utm_medium = urlParams.get('utm_medium');
  
  let customImage = '/first.jpg';
  let customDescription = weddingData.hero.title;
  
  // Customize based on traffic source
  if (utm_source === 'whatsapp') {
    customDescription = `💕 ${weddingData.hero.coupleNames} mengundang Anda melalui WhatsApp`;
  } else if (utm_source === 'instagram') {
    customDescription = `📸 ${weddingData.hero.coupleNames} mengundang Anda melalui Instagram`;
  } else if (utm_source === 'facebook') {
    customDescription = `👥 ${weddingData.hero.coupleNames} mengundang Anda melalui Facebook`;
  }
  
  return {
    guestName,
    customDescription,
    customImage: `${window.location.origin}${customImage}`,
    customUrl: window.location.href
  };
}

// Function to create shareable URLs with dynamic parameters
export function createShareableURL(guestName?: string, platform?: string) {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  
  if (guestName) {
    params.append('to', guestName);
  }
  
  if (platform) {
    params.append('utm_source', platform);
    params.append('utm_medium', 'social');
    params.append('utm_campaign', 'wedding_invitation');
  }
  
  return `${baseUrl}${params.toString() ? '?' + params.toString() : ''}`;
}

// JSON-LD Schema for Wedding Event
export function WeddingSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `Pernikahan ${weddingData.hero.coupleNames}`,
    "description": `Acara pernikahan ${weddingData.couple.groom.name} dan ${weddingData.couple.bride.name}`,
    "startDate": weddingData.countdown.weddingDate,
    "location": {
      "@type": "Place",
      "name": weddingData.events[0].venue,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": weddingData.events[0].address,
        "addressLocality": "Semarang",
        "addressCountry": "Indonesia"
      }
    },
    "organizer": [
      {
        "@type": "Person",
        "name": weddingData.couple.groom.name
      },
      {
        "@type": "Person", 
        "name": weddingData.couple.bride.name
      }
    ],
    "image": [
      `${window.location.origin}/first.jpg`
    ],
    "url": window.location.href
  };
  
  useEffect(() => {
    // Add JSON-LD script to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  return null;
}
