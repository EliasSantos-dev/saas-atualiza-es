import React from 'react';
import { Radio } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const recentTracks = [
    { id: 1, artist: "Gusttavo Lima", title: "Milionário", time: "Há 5 min" },
    { id: 2, artist: "Wesley Safadão", title: "Volta", time: "Há 12 min" },
    { id: 3, artist: "Xand Avião", title: "Role", time: "Há 25 min" },
    { id: 4, artist: "Nattan", title: "Love Gostosinho", time: "Há 1h" },
  ];

  return (
    <div className="bg-pulse-surface rounded-2xl border border-pulse-border p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pulse-red opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-pulse-red"></span>
        </div>
        <h3 className="font-bold text-lg">Atividade do Sistema</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {recentTracks.map(track => (
          <div key={track.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-pulse-dark/50 transition-colors">
            <div className="mt-1 p-2 rounded-md bg-pulse-dark text-pulse-red">
              <Radio size={14} />
            </div>
            <div>
              <p className="font-medium text-sm text-pulse-textPrimary">{track.title}</p>
              <p className="text-xs text-pulse-textSecondary">{track.artist}</p>
            </div>
            <div className="ml-auto text-[10px] text-pulse-textSecondary mt-1">
              {track.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
