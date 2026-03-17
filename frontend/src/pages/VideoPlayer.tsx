import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  Play,
  Clock,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  User,
  Eye,
} from 'lucide-react';

interface VimeoMeta {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  author: string;
  views?: number;
  likes?: number;
}

const PLAYLIST_DATA: Record<string, { title: string; videoIds: string[]; color: string }> = {
  fonoaudiologia: {
    title: 'Fonoaudiologia',
    color: 'from-violet-600 to-purple-700',
    videoIds: [
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
    ],
  },
};

function formatDuration(seconds: number): string {
  if (!seconds) return '--:--';
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

export default function VideoPlayer() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const playlist = PLAYLIST_DATA[playlistId || ''];
  const [metas, setMetas] = useState<Record<string, VimeoMeta>>({});
  const [loading, setLoading] = useState(true);
  const [watched, setWatched] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(`watched_${playlistId}`);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const currentIndex = parseInt(searchParams.get('v') || '0', 10);
  const currentId = playlist?.videoIds[currentIndex] || '';
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playlist) return;
    const fetchAll = async () => {
      const results: Record<string, VimeoMeta> = {};
      await Promise.all(
        playlist.videoIds.map(async (id) => {
          try {
            const res = await fetch(
              `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=1280`
            );
            const data = await res.json();
            results[id] = {
              id,
              title: data.title || `Aula ${id}`,
              description: data.description || '',
              thumbnail: data.thumbnail_url || '',
              duration: data.duration || 0,
              author: data.author_name || '',
              views: data.video_count,
            };
          } catch {
            results[id] = {
              id,
              title: `Aula ${id}`,
              description: '',
              thumbnail: '',
              duration: 0,
              author: '',
            };
          }
        })
      );
      setMetas(results);
      setLoading(false);
    };
    fetchAll();
  }, [playlist]);

  // Mark video as watched when selected
  useEffect(() => {
    if (currentId) {
      const updated = new Set(watched).add(currentId);
      setWatched(updated);
      localStorage.setItem(`watched_${playlistId}`, JSON.stringify([...updated]));
    }
  }, [currentId]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${currentIndex}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentIndex]);

  const selectVideo = (idx: number) => {
    setSearchParams({ v: String(idx) });
  };

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-slate-500">Playlist não encontrada.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-brand-primary hover:underline text-sm"
        >
          Voltar
        </button>
      </div>
    );
  }

  const currentMeta = metas[currentId];
  const totalDuration = playlist.videoIds.reduce((a, id) => a + (metas[id]?.duration || 0), 0);
  const watchedCount = watched.size;

  return (
    <div className="space-y-4">
      {/* Back */}
      <button
        onClick={() => navigate(`/${user?.role}/video-aulas`)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Voltar às playlists
      </button>

      {/* Title bar */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{playlist.title}</h1>
          <div className="flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <BookOpen className="h-4 w-4" />
              {playlist.videoIds.length} aulas
            </span>
            {totalDuration > 0 && (
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                {formatTotal(totalDuration)} no total
              </span>
            )}
            <span className="flex items-center gap-1.5 text-sm text-violet-600 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              {watchedCount} de {playlist.videoIds.length} assistidas
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
          style={{ width: `${(watchedCount / playlist.videoIds.length) * 100}%` }}
        />
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Player + Info */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Video iframe */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-xl">
            {currentId ? (
              <iframe
                key={currentId}
                src={`https://player.vimeo.com/video/${currentId}?autoplay=1&title=0&byline=0&portrait=0&color=7c3aed`}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={currentMeta?.title || 'Aula'}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent" />
              </div>
            )}
          </div>

          {/* Video info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            {loading || !currentMeta ? (
              <div className="space-y-3">
                <div className="h-6 bg-slate-100 rounded-lg animate-pulse w-3/4" />
                <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-1/3" />
                <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-full mt-4" />
                <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-5/6" />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-full">
                        Aula {currentIndex + 1} de {playlist.videoIds.length}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">
                      {currentMeta.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm shrink-0">
                    <Clock className="h-4 w-4" />
                    {formatDuration(currentMeta.duration)}
                  </div>
                </div>

                {currentMeta.author && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    <div className="h-7 w-7 rounded-full bg-violet-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-violet-600" />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">{currentMeta.author}</span>
                  </div>
                )}

                {currentMeta.description && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {currentMeta.description}
                    </p>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => selectVideo(currentIndex - 1)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Anterior
                  </button>
                  <button
                    disabled={currentIndex === playlist.videoIds.length - 1}
                    onClick={() => selectVideo(currentIndex + 1)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Playlist sidebar */}
        <div className="w-full lg:w-80 xl:w-96 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">Lista de Aulas</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {watchedCount} de {playlist.videoIds.length} assistidas
            </p>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto divide-y divide-slate-100" style={{ maxHeight: '600px' }}>
            {playlist.videoIds.map((id, idx) => {
              const meta = metas[id];
              const isActive = idx === currentIndex;
              const isWatched = watched.has(id) && !isActive;

              return (
                <button
                  key={id}
                  data-idx={idx}
                  onClick={() => selectVideo(idx)}
                  className={`w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-slate-50 ${
                    isActive ? 'bg-violet-50 border-l-4 border-violet-600' : ''
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative shrink-0 w-24 h-14 rounded-lg overflow-hidden bg-slate-100">
                    {meta?.thumbnail ? (
                      <img
                        src={meta.thumbnail}
                        alt={meta.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center`}>
                        <Play className="h-5 w-5 text-white/80" />
                      </div>
                    )}
                    {isActive && (
                      <div className="absolute inset-0 bg-violet-600/30 flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="h-3 w-3 text-violet-600 ml-0.5" />
                        </div>
                      </div>
                    )}
                    {isWatched && !isActive && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-start justify-between gap-1">
                      <p className={`text-xs font-semibold leading-tight line-clamp-2 ${
                        isActive ? 'text-violet-700' : 'text-slate-800'
                      }`}>
                        {loading || !meta ? (
                          <span className="block h-3 bg-slate-200 rounded animate-pulse w-20" />
                        ) : (
                          meta.title
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">Aula {idx + 1}</span>
                      {meta?.duration ? (
                        <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                          <Clock className="h-2.5 w-2.5" />
                          {formatDuration(meta.duration)}
                        </span>
                      ) : null}
                    </div>
                    {isWatched && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-green-600 font-medium mt-0.5">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Assistida
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
