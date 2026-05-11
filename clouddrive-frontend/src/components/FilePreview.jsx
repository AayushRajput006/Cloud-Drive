import { useState, useEffect, useCallback, useRef } from 'react';

const FilePreview = ({ file, onClose, onDownload, onShare, onDelete }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (file) {
      loadPreview();
    }
    return () => {
      // Cleanup preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file]);

  const loadPreview = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/files/${file.id}/preview`, {
      //   headers: { 'Authorization': `Bearer ${authService.getToken()}` }
      // });
      // const blob = await response.blob();
      // const url = URL.createObjectURL(blob);
      // setPreviewUrl(url);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock preview URL based on file type
      if (file.type === 'image') {
        setPreviewUrl('https://picsum.photos/800/600');
      } else if (file.type === 'video') {
        setPreviewUrl('https://www.w3schools.com/html/mov_bbb.mp4');
      } else if (file.type === 'audio') {
        setPreviewUrl('https://www.w3schools.com/html/horse.mp3');
      } else if (file.type === 'pdf') {
        setPreviewUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
      } else {
        setPreviewUrl('');
      }
    } catch (err) {
      setError('Failed to load preview');
      console.error('Preview load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileIcon = (type) => {
    const iconMap = {
      image: 'image',
      video: 'videocam',
      audio: 'headphones',
      pdf: 'picture_as_pdf',
      document: 'description',
      text: 'text_snippet',
      archive: 'folder_zip'
    };
    return iconMap[type] || 'insert_drive_file';
  };

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96 bg-surface-container-low rounded-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-md">
              <span className="material-symbols-outlined text-3xl text-primary animate-spin">refresh</span>
            </div>
            <p className="text-body-md text-on-surface-variant">Loading preview...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96 bg-surface-container-low rounded-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mx-auto mb-md">
              <span className="material-symbols-outlined text-3xl text-error">error</span>
            </div>
            <p className="text-body-md text-error">{error}</p>
            <button
              onClick={loadPreview}
              className="mt-md px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch (file.type) {
      case 'image':
        return (
          <div className="flex flex-col items-center">
            <div className="mb-md flex gap-sm">
              <button
                onClick={handleZoomOut}
                className="px-sm py-xs bg-surface-container-low rounded hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">zoom_out</span>
              </button>
              <button
                onClick={handleResetZoom}
                className="px-sm py-xs bg-surface-container-low rounded hover:bg-surface-container"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                className="px-sm py-xs bg-surface-container-low rounded hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">zoom_in</span>
              </button>
            </div>
            <div className="overflow-auto max-h-96 max-w-full border border-outline-variant rounded-lg">
              <img
                src={previewUrl}
                alt={file.name}
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
                className="block"
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="flex flex-col items-center">
            <video
              ref={videoRef}
              src={previewUrl}
              controls
              className="w-full max-w-2xl rounded-lg"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
            <div className="mt-md text-sm text-on-surface-variant">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-primary-container rounded-full flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-6xl text-primary">headphones</span>
            </div>
            <audio
              ref={audioRef}
              src={previewUrl}
              controls
              className="w-full max-w-md"
            />
            <div className="mt-md text-center">
              <h3 className="font-h3 text-h3 text-on-surface mb-sm">{file.name}</h3>
              <p className="text-body-sm text-on-surface-variant">
                Audio File • {formatFileSize(file.size)}
              </p>
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-primary-container rounded-full flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-6xl text-primary">picture_as_pdf</span>
            </div>
            <div className="text-center">
              <h3 className="font-h3 text-h3 text-on-surface mb-sm">{file.name}</h3>
              <p className="text-body-sm text-on-surface-variant mb-md">
                PDF Document • {formatFileSize(file.size)}
              </p>
              <button
                onClick={() => window.open(previewUrl, '_blank')}
                className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover"
              >
                Open PDF
              </button>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-primary-container rounded-full flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-6xl text-primary">text_snippet</span>
            </div>
            <div className="text-center">
              <h3 className="font-h3 text-h3 text-on-surface mb-sm">{file.name}</h3>
              <p className="text-body-sm text-on-surface-variant mb-md">
                Text File • {formatFileSize(file.size)}
              </p>
              <button
                onClick={() => window.open(previewUrl, '_blank')}
                className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-hover"
              >
                Open Text File
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-surface-container-low rounded-full flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant">
                {getFileIcon(file.type)}
              </span>
            </div>
            <div className="text-center">
              <h3 className="font-h3 text-h3 text-on-surface mb-sm">{file.name}</h3>
              <p className="text-body-sm text-on-surface-variant mb-md">
                {file.type} File • {formatFileSize(file.size)}
              </p>
              <p className="text-body-sm text-on-surface-variant">
                Preview not available for this file type
              </p>
            </div>
          </div>
        );
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white border border-outline-variant rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">
              {getFileIcon(file.type)}
            </span>
            <div>
              <h2 className="font-h2 text-h2 text-on-surface">{file.name}</h2>
              <p className="text-label-sm text-on-surface-variant">
                {formatFileSize(file.size)} • {file.type}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-sm">
            <button
              onClick={() => onDownload?.(file)}
              className="px-sm py-xs bg-surface-container-low rounded hover:bg-surface-container"
              title="Download"
            >
              <span className="material-symbols-outlined">download</span>
            </button>
            <button
              onClick={() => onShare?.(file)}
              className="px-sm py-xs bg-surface-container-low rounded hover:bg-surface-container"
              title="Share"
            >
              <span className="material-symbols-outlined">share</span>
            </button>
            <button
              onClick={onClose}
              className="px-sm py-xs bg-surface-container-low rounded hover:bg-surface-container"
              title="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-lg overflow-auto max-h-[calc(90vh-120px)]">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
