import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  className?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export function VideoPlayer({
  className,
  title = "Découvrez Webstate en action",
  description = "Voyez comment nos agents IA transforment votre entreprise",
  thumbnailUrl = "/video-placeholder.svg",
  videoUrl = "" // URL de la vidéo MP4 à ajouter
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Mute/Unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Update time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Auto-hide controls
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className={cn("py-fluid-3xl bg-background", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-fluid-xl">
          <h2 className="text-fluid-3xl font-display font-bold text-foreground mb-fluid-md">
            {title}
          </h2>
          <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div 
            ref={containerRef}
            className="relative group rounded-2xl overflow-hidden shadow-premium"
            onMouseMove={resetControlsTimeout}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {/* Video Element */}
            <div className="relative aspect-video bg-black">
              {!videoUrl ? (
                // Placeholder si pas de vidéo
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted">
                  <Play className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Vidéo à venir</p>
                  <p className="text-sm text-muted-foreground mt-2">Ajoutez votre URL vidéo dans videoUrl</p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    poster={thumbnailUrl}
                    onClick={togglePlay}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>

                  {/* Play/Pause Overlay (center) */}
                  {!isPlaying && (
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl" />
                        <div className="relative bg-primary hover:bg-primary/90 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-2xl transition-all hover:scale-110">
                          <Play className="w-8 h-8 ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Custom Controls */}
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 transition-opacity duration-300",
                      showControls || !isPlaying ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-125 [&::-webkit-slider-thumb]:transition-transform"
                      />
                      <div className="flex justify-between text-xs text-white/70 mt-2">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Controls Bar */}
                    <div className="flex items-center justify-between gap-4">
                      {/* Left Controls */}
                      <div className="flex items-center gap-3">
                        {/* Play/Pause */}
                        <button
                          onClick={togglePlay}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                          aria-label={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5" fill="currentColor" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                          )}
                        </button>

                        {/* Skip Backward */}
                        <button
                          onClick={() => skip(-10)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                          aria-label="Reculer de 10 secondes"
                        >
                          <SkipBack className="w-4 h-4" />
                        </button>

                        {/* Skip Forward */}
                        <button
                          onClick={() => skip(10)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                          aria-label="Avancer de 10 secondes"
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>

                        {/* Volume */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={toggleMute}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                          >
                            {isMuted || volume === 0 ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Right Controls */}
                      <div className="flex items-center gap-3">
                        {/* Fullscreen */}
                        <button
                          onClick={toggleFullscreen}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                          aria-label="Plein écran"
                        >
                          <Maximize className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Info sous la vidéo */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              💡 Astuce : Cliquez sur la vidéo pour lire/pause, utilisez les contrôles pour le volume et la navigation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
