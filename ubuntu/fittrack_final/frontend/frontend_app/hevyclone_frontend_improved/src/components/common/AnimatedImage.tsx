import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, Play, Pause } from 'lucide-react';
import { useImageCache } from '../../hooks/useImageCache';

interface AnimatedImageProps {
  src: string;
  alt: string;
  animationSrc?: string;
  className?: string;
  placeholderClassName?: string;
  enableHoverAnimation?: boolean;
  priority?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  fallbackSrc?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  animationSrc,
  className = "",
  placeholderClassName = "",
  enableHoverAnimation = true,
  priority = 0,
  onLoad,
  onError,
  fallbackSrc,
  loadingComponent,
  errorComponent
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const { loadImage, getImageStatus, observeImage } = useImageCache();

  // Determina qual src usar baseado no hover e disponibilidade
  const effectiveSrc = useMemo(() => {
    if (isHovered && animationSrc && enableHoverAnimation && animationLoaded) {
      return animationSrc;
    }
    return currentSrc;
  }, [isHovered, animationSrc, enableHoverAnimation, animationLoaded, currentSrc]);

  // Carrega a imagem principal
  useEffect(() => {
    const loadMainImage = async () => {
      try {
        await loadImage(src, priority);
        setImageLoaded(true);
        onLoad?.();
      } catch (error) {
        if (fallbackSrc && fallbackSrc !== src) {
          setCurrentSrc(fallbackSrc);
        } else {
          setHasError(true);
          onError?.(error as Error);
        }
      }
    };

    loadMainImage();
  }, [src, priority, loadImage, onLoad, onError, fallbackSrc]);

  // Carrega a animação se disponível
  useEffect(() => {
    if (animationSrc && animationSrc !== src) {
      loadImage(animationSrc, priority - 1).then(() => {
        setAnimationLoaded(true);
      }).catch(() => {
        // Ignora erros de animação
      });
    }
  }, [animationSrc, src, priority, loadImage]);

  // Configura observer para lazy loading
  useEffect(() => {
    if (imageRef.current) {
      const cleanup = observeImage(imageRef.current, src);
      return cleanup;
    }
  }, [src, observeImage]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleImageError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
      onError?.(new Error('Failed to load image'));
    }
  }, [fallbackSrc, currentSrc, onError]);

  const imageStatus = getImageStatus(effectiveSrc);
  const showImage = imageLoaded && !hasError && imageStatus === 'loaded';

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        {!showImage && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 ${placeholderClassName}`}
          >
            {hasError ? (
              errorComponent || (
                <div className="flex flex-col items-center gap-2 text-white/80">
                  <AlertCircle className="w-8 h-8" />
                  <span className="text-sm">Erro ao carregar</span>
                </div>
              )
            ) : (
              loadingComponent || (
                <div className="flex flex-col items-center gap-2 text-white/80">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-sm">Carregando...</span>
                </div>
              )
            )}
          </motion.div>
        )}

        {showImage && (
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: 0.5,
              ease: [0.25, 0.25, 0, 1]
            }}
            className="relative w-full h-full"
          >
            <motion.img
              src={effectiveSrc}
              alt={alt}
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              animate={{
                scale: isHovered ? 1.05 : 1,
                filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
              }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.25, 0, 1]
              }}
            />

            {/* Overlay com gradiente no hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Indicador de animação */}
            {animationSrc && enableHoverAnimation && (
              <motion.div
                className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full p-2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  backgroundColor: isHovered ? 'rgba(34, 197, 94, 0.8)' : 'rgba(0, 0, 0, 0.6)'
                }}
                transition={{ 
                  duration: 0.3,
                  delay: 0.2
                }}
              >
                <motion.div
                  animate={{ rotate: isHovered ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isHovered ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Efeito de brilho no hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ 
                x: isHovered ? '100%' : '-100%',
                opacity: isHovered ? 1 : 0
              }}
              transition={{ 
                duration: 0.6,
                ease: [0.25, 0.25, 0, 1]
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de carregamento de animação */}
      {animationSrc && !animationLoaded && imageLoaded && (
        <motion.div
          className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Loader2 className="w-3 h-3 text-white animate-spin" />
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedImage; 