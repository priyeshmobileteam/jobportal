import { useEffect } from 'react';

interface AdSenseAdProps {
  client?: string;
  slot: string;
  format?: string;
  responsive?: string;
  style?: React.CSSProperties;
}

export function AdSenseAd({
  client = 'ca-pub-1234567890123456', // Replace with your actual publisher ID when ready
  slot = '1234567890',                  // Replace with your actual ad slot ID
  format = 'auto',
  responsive = 'true',
  style = { display: 'block', minWidth: '250px', minHeight: '90px' }
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense load state or blocked:', e);
    }
  }, []);

  return (
    <div className="my-6 overflow-hidden flex justify-center bg-gray-50/50 dark:bg-slate-900/30 rounded-2xl p-4 border border-dashed border-slate-200 dark:border-slate-800 min-h-[120px] items-center relative">
      <div className="absolute top-1 left-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none pointer-events-none">
        Advertisement
      </div>
      
      {/* Google AdSense container */}
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
      
      {/* Visual Indicator in dev mode/sandbox so user knows where ads go */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-slate-500/5 backdrop-blur-[1px] rounded-2xl border border-indigo-500/10">
        <span className="text-xs text-indigo-500/70 font-semibold">Google AdSense Space</span>
        <span className="text-[10px] text-slate-400">Slot ID: {slot}</span>
      </div>
    </div>
  );
}
export default AdSenseAd;
