import React, { useState } from 'react';

interface AdSensePlaceholderProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  label?: string;
}

export const AdSensePlaceholder: React.FC<AdSensePlaceholderProps> = ({
  slot,
  format = 'auto',
  className = '',
  label = 'Google AdSense Banner'
}) => {
  // Configurable Publisher ID helper
  const [pubId, setPubId] = useState('pub-XXXXXXXXXX123456');
  const [isEditing, setIsEditing] = useState(false);

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

      <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
        {isEditing ? (
          <input
            type="text"
            value={pubId}
            onChange={(e) => setPubId(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsEditing(false);
            }}
            className="px-1.5 py-0.5 border border-yellow-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-yellow-500 w-48 text-center text-xs"
            autoFocus
          />
        ) : (
          <span 
            onClick={() => setIsEditing(true)} 
            className="cursor-pointer underline decoration-dotted hover:text-yellow-700"
            title="Click to edit your Publisher ID"
          >
            data-ad-client="{pubId}"
          </span>
        )}
      </div>

      <div className="mt-2 hidden group-hover:block text-[10px] text-slate-400">
        To activate real ads: replace this component with standard &lt;ins class="adsbygoogle" ...&gt; tags.
      </div>
    </div>
  );
};
