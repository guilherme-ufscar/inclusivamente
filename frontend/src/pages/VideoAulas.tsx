import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PlayCircle, Video, Clock, BookOpen } from 'lucide-react';

interface VimeoMeta {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
}

const VIMEO_IDS = [
  '1174527649',
  '1174527781',
  '1174528082',
  '1169504719',
  '1174528244',
  '1169509028',
  '1169510133',
  '1169510907',
  '1174529386',
  '1174529205',
  '1174529018',
  '1174529530',
];

const PLAYLISTS = [
  {
    id: 'fonoaudiologia',
    title: 'Fonoaudiologia',
    description: 'Série completa de video-aulas sobre Fonoaudiologia, abordando técnicas, avaliações e intervenções para profissionais e educadores.',
    videoIds: VIMEO_IDS,
    color: 'from-violet-600 to-purple-700',
    lightColor: 'bg-violet-50',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatTotal(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m} min`;
}

export default function VideoAulas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metas, setMetas] = useState<Record<string, VimeoMeta>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const results: Record<string, VimeoMeta> = {};
      await Promise.all(
        VIMEO_IDS.map(async (id) => {
          try {
            const res = await fetch(
              `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=640`
            );
            const data = await res.json();
            results[id] = {
              id,
              title: data.title || `Aula ${id}`,
              description: data.description || '',
              thumbnail: data.thumbnail_url || '',
              duration: data.duration || 0,
            };
          } catch {
            results[id] = {
              id,
              title: `Aula ${id}`,
              description: '',
              thumbnail: '',
              duration: 0,
            };
          }
        })
      );
      setMetas(results);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handlePlay = (playlistId: string) => {
    navigate(`/${user?.role}/video-aulas/${playlistId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Video-Aulas</h1>
        <p className="text-slate-500 mt-1">Playlists de formação para profissionais de educação inclusiva</p>
      </div>

      {/* Playlists */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {PLAYLISTS.map((playlist) => {
          const totalDuration = playlist.videoIds.reduce(
            (acc, id) => acc + (metas[id]?.duration || 0), 0
          );
          const firstMeta = metas[playlist.videoIds[0]];
          const loadedCount = playlist.videoIds.filter((id) => metas[id]).length;

          return (
            <div
              key={playlist.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handlePlay(playlist.id)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                {loading || !firstMeta?.thumbnail ? (
                  <div className={`w-full h-full bg-gradient-to-br ${playlist.color} flex items-center justify-center`}>
                    <Video className="h-16 w-16 text-white/60" />
                  </div>
                ) : (
                  <img
                    src={firstMeta.thumbnail}
                    alt={playlist.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-br ${playlist.color} opacity-60`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/40">
                    <PlayCircle className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {playlist.videoIds.length} aulas
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${playlist.badgeColor}`}>
                    Playlist
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-brand-primary transition-colors">
                  {playlist.title}
                </h2>
                <p className="text-sm text-slate-500 mt-1.5 line-clamp-2">{playlist.description}</p>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <BookOpen className="h-4 w-4" />
                    <span>{loadedCount} / {playlist.videoIds.length} carregados</span>
                  </div>
                  {totalDuration > 0 && (
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{formatTotal(totalDuration)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { VIMEO_IDS, PLAYLISTS, formatDuration };
