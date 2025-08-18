import { Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VideoSectionProps {
  className?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export function VideoSection({
  className,
  title = "Découvrez Webstate en action",
  description = "Voyez comment nos agents IA transforment votre entreprise",
  thumbnailUrl = "/video-placeholder.svg",
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&enablejsapi=1&rel=0&showinfo=0&controls=1&modestbranding=1&playsinline=1"
}: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isPlaying) {
            // Délai de 1 seconde avant de lancer la vidéo
            setTimeout(() => {
              setIsPlaying(true);
            }, 1000);
          }
        });
      },
      { threshold: 0.5 } // Déclenche quand 50% de la section est visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section className={cn("py-fluid-3xl", className)} ref={videoRef}>
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
          <div className="relative group">
            {/* Video Container with Glassmorphism */}
            <div className="glass-card rounded-2xl overflow-hidden aspect-video relative">
              {!isPlaying ? (
                <>
                  {/* Thumbnail */}
                  <img
                    src={thumbnailUrl}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Play Button */}
                  <button
                    onClick={handlePlay}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl" />
                      <div className="relative bg-primary hover:bg-primary/90 text-white rounded-full w-24 h-24 flex items-center justify-center shadow-2xl">
                        <Play className="w-10 h-10 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </button>
                  
                  {/* Bottom Info Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-lg font-medium">
                      Démo : Automatisation complète en 5 minutes
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-full h-full">
                  {/* Video iframe - Direct replacement, no popup, no animations */}
                  <iframe
                    src={videoUrl}
                    title="Webstate Demo"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
            
            {/* Decorative Elements - Fixed position, no animations */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
