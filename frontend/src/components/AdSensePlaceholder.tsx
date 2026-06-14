import React, { useState, useEffect } from 'react';

interface AdSensePlaceholderProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
    adsbygoogleScriptLoaded?: boolean;
  }
}

export const AdSensePlaceholder: React.FC<AdSensePlaceholderProps> = ({
  slot,
  format = 'auto',
  className = '',
  label = 'Google AdSense Banner'
}) => {
  const isAdFree = localStorage.getItem('user_ad_free') === 'true';

  if (isAdFree) {
    return null;
  }

  // Configurable Publisher ID helper (global)
  const [pubId, setPubIdState] = useState(() => {
    return localStorage.getItem('adsense_pub_id') || 'ca-pub-9222595088627935';
  });

  // Numeric Slot ID helper (per-slot configuration)
  const [slotId, setSlotIdState] = useState(() => {
    return localStorage.getItem(`adsense_slot_${slot}`) || '';
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState<'pub' | 'slot'>('pub');

  const setPubId = (newId: string) => {
    setPubIdState(newId);
    localStorage.setItem('adsense_pub_id', newId);
  };

  const setSlotId = (newSlotId: string) => {
    setSlotIdState(newSlotId);
    localStorage.setItem(`adsense_slot_${slot}`, newSlotId);
  };

  const isMock = pubId.includes('X') || pubId.trim() === '';

  useEffect(() => {
    if (!isMock) {
      // Load Google AdSense Script dynamically
      if (!window.adsbygoogleScriptLoaded) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
        window.adsbygoogleScriptLoaded = true;
      }

      // Trigger ad render
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense push error:', err);
      }
    }
  }, [pubId, isMock, slotId, slot]);

  // Render mock view if pubId is ca-pub-XXXXXXXXXX123456 or similar mockup ID
  if (isMock) {
    return (
      <div className={`my-4 relative bg-yellow-50/40 border border-yellow-200 rounded-lg overflow-hidden p-4 min-h-[90px] flex flex-col justify-center items-center text-center transition-all hover:bg-yellow-50/70 group ${className}`}>
        <div className="absolute top-1 right-2 text-[10px] text-yellow-600 font-semibold uppercase tracking-wider flex items-center gap-1">
          <span>Sponsor Ad</span>
          <span className="bg-yellow-200 px-1 rounded">Slot: {slot}</span>
        </div>

        <div className="text-sm font-semibold text-yellow-800 mb-1 flex items-center gap-2">
          <span>{label}</span>
          <span className="text-xs text-yellow-600">({format})</span>
        </div>

        <div className="text-xs text-slate-500 font-mono flex flex-col items-center gap-1">
          {isEditing ? (
            <div className="flex flex-col gap-1 items-center">
              <label className="text-[10px] text-slate-400 font-bold uppercase">{editType === 'pub' ? 'Ad Client ID (Publisher ID)' : `Ad Slot ID for ${slot}`}</label>
              <input
                type="text"
                value={editType === 'pub' ? pubId : slotId}
                onChange={(e) => editType === 'pub' ? setPubId(e.target.value) : setSlotId(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditing(false);
                }}
                className="px-1.5 py-0.5 border border-yellow-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-yellow-500 w-64 text-center text-xs"
                autoFocus
              />
            </div>
          ) : (
            <>
              <span 
                onClick={() => { setEditType('pub'); setIsEditing(true); }} 
                className="cursor-pointer underline decoration-dotted hover:text-yellow-700"
                title="Click to edit your Publisher ID"
              >
                data-ad-client="{pubId}"
              </span>
              <span 
                onClick={() => { setEditType('slot'); setIsEditing(true); }} 
                className="cursor-pointer underline decoration-dotted hover:text-yellow-700 text-[10px] text-slate-400"
                title="Click to set Ad Slot ID"
              >
                data-ad-slot="{slotId || '(Optional Slot ID)'}"
              </span>
            </>
          )}
        </div>

        <div className="mt-2 hidden group-hover:block text-[10px] text-slate-400">
          Click elements above to configure. Enter a valid Publisher ID to render real ads.
        </div>
      </div>
    );
  }

  // Render real AdSense element
  return (
    <div className={`my-4 relative w-full overflow-hidden flex justify-center ${className}`}>
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%', height: '100%' }}
           data-ad-client={pubId}
           {...(slotId ? { 'data-ad-slot': slotId } : {})}
           data-ad-format={format}
           data-full-width-responsive="true"></ins>
      
      {/* Invisible/subtle hover button for admin configuration */}
      <div className="absolute bottom-1 right-1 opacity-0 hover:opacity-100 flex gap-1 z-50">
        <button 
          onClick={() => {
            const newId = prompt('Enter Google AdSense Publisher ID (Client ID):', pubId);
            if (newId !== null) setPubId(newId);
          }}
          className="bg-slate-900/80 hover:bg-slate-900 text-white text-[8px] px-1 py-0.5 rounded transition-all cursor-pointer font-sans"
        >
          Edit Pub ID
        </button>
        <button 
          onClick={() => {
            const newSlot = prompt(`Enter Google AdSense Slot ID for ${slot}:`, slotId);
            if (newSlot !== null) setSlotId(newSlot);
          }}
          className="bg-slate-900/80 hover:bg-slate-900 text-white text-[8px] px-1 py-0.5 rounded transition-all cursor-pointer font-sans"
        >
          Edit Slot ID
        </button>
      </div>
    </div>
  );
};
