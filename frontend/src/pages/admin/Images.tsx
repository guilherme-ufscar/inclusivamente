import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Copy, Trash2, Edit2, Check, X, ImageIcon } from 'lucide-react';
import api from '../../services/api';

interface UploadedImage {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function ImagesPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [newFilename, setNewFilename] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      const response = await api.get('/uploads');
      if (response.data.success) {
        setImages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching images', error);
      alert('Erro ao carregar as imagens.');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem é muito grande. O limite é 10MB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      await api.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Imagem enviada e otimizada (WebP) com sucesso!');
      fetchImages();
    } catch (error) {
      console.error('Error uploading image', error);
      alert('Erro ao enviar imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      // Simulate file select
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Tem certeza que deseja deletar a imagem ${filename}?`)) {
      return;
    }

    try {
      await api.delete(`/uploads/${filename}`);
      alert('Imagem deletada com sucesso.');
      fetchImages();
    } catch (error) {
      console.error('Error deleting image', error);
      alert('Erro ao deletar a imagem.');
    }
  };

  const startEditing = (filename: string) => {
    setEditingImage(filename);
    setNewFilename(filename.replace('.webp', ''));
  };

  const saveEdit = async (oldFilename: string) => {
    if (!newFilename || newFilename.trim() === '') {
      alert('O nome do arquivo não pode estar vazio.');
      return;
    }

    try {
      await api.put(`/uploads/${oldFilename}`, { newFilename: newFilename.trim() });
      setEditingImage(null);
      fetchImages();
    } catch (error: any) {
      console.error('Error renaming image', error);
      alert(error.response?.data?.message || 'Erro ao renomear a imagem.');
    }
  };

  const getFullUrl = (relativeUrl: string) => {
    const baseURL = import.meta.env.VITE_API_URL || 'https://painel.inclusivamenteeduca.com/api';
    const serverURL = baseURL.replace('/api', '');
    return `${serverURL}${relativeUrl}`;
  };

  const handleCopyLink = (relativeUrl: string) => {
    const fullUrl = getFullUrl(relativeUrl);
    navigator.clipboard.writeText(fullUrl);
    alert('Link copiado!');
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gerenciador de Imagens</h1>
          <p className="text-sm text-slate-500">Faça upload de imagens, otimize para WebP e gerencie seus links.</p>
        </div>
      </div>

      {/* Dropzone */}
      <div 
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all bg-white hover:bg-slate-50 border-slate-300 hover:border-brand-primary/50 relative ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
            {isUploading ? (
              <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <UploadCloud className="h-8 w-8" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">Clique para selecionar ou arraste uma imagem aqui</p>
            <p className="text-sm text-slate-500 mt-1">A imagem será automaticamente convertida para WebP e comprimida</p>
          </div>
        </div>
      </div>

      {/* Image List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-brand-primary" />
            Imagens no Servidor
          </h2>
          <span className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">{images.length} arquivo(s)</span>
        </div>
        
        {images.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            Nenhuma imagem encontrada. Faça o upload acima.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {images.map((image) => (
              <li key={image.filename} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:bg-slate-50 transition-colors">
                
                {/* Thumbnail */}
                <div className="h-24 w-24 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                  <img 
                    src={getFullUrl(image.url)} 
                    alt={image.filename} 
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-slate-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {editingImage === image.filename ? (
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <input 
                        type="text" 
                        value={newFilename}
                        onChange={(e) => setNewFilename(e.target.value)}
                        className="flex-1 h-9 rounded-lg border-slate-300 border px-3 text-sm focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Novo nome (sem .webp)"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(image.filename);
                          if (e.key === 'Escape') setEditingImage(null);
                        }}
                      />
                      <span className="text-slate-500 font-medium text-sm">.webp</span>
                      <button onClick={() => saveEdit(image.filename)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingImage(null)} className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 truncate" title={image.filename}>{image.filename}</h3>
                      <button 
                        onClick={() => startEditing(image.filename)}
                        className="p-1 text-slate-400 hover:text-brand-primary transition-colors"
                        title="Editar permalink (nome do arquivo)"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">{formatSize(image.size)}</span>
                    <span>{new Date(image.createdAt).toLocaleDateString()} {new Date(image.createdAt).toLocaleTimeString()}</span>
                  </div>
                  
                  <div className="mt-3 truncate text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md font-mono flex items-center gap-2">
                    <div className="truncate flex-1" title={getFullUrl(image.url)}>
                      {getFullUrl(image.url)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-4 sm:pt-0 w-full sm:w-auto justify-end sm:justify-start">
                  <button 
                    onClick={() => handleCopyLink(image.url)}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </button>
                  <button 
                    onClick={() => handleDelete(image.filename)}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </button>
                </div>

              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
