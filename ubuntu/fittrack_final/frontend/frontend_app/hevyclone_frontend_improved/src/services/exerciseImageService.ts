interface ExerciseImageMap {
  [exerciseName: string]: {
    static: string;
    animated: string;
    category: string;
  };
}

// Mapeamento de exercícios para suas imagens/GIFs
const exerciseImages: ExerciseImageMap = {
  // PEITO
  'Supino Reto': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/10.gif',
    category: 'chest'
  },
  'Supino Inclinado': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/11.gif',
    category: 'chest'
  },
  'Supino Declinado': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/12.gif',
    category: 'chest'
  },
  'Flexão de Braço': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/52.gif',
    category: 'chest'
  },
  'Crucifixo': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/27.gif',
    category: 'chest'
  },
  'Peck Deck': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/175.gif',
    category: 'chest'
  },

  // COSTAS
  'Pull-up': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/109.gif',
    category: 'back'
  },
  'Remada Curvada': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/85.gif',
    category: 'back'
  },
  'Puxada Alta': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/83.gif',
    category: 'back'
  },
  'Remada Sentado': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/84.gif',
    category: 'back'
  },
  'Levantamento Terra': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/104.gif',
    category: 'back'
  },

  // PERNAS
  'Agachamento': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/141.gif',
    category: 'legs'
  },
  'Leg Press': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/128.gif',
    category: 'legs'
  },
  'Extensão de Pernas': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/129.gif',
    category: 'legs'
  },
  'Flexão de Pernas': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/130.gif',
    category: 'legs'
  },
  'Afundo': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/142.gif',
    category: 'legs'
  },
  'Stiff': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/105.gif',
    category: 'legs'
  },

  // OMBROS
  'Desenvolvimento Militar': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/18.gif',
    category: 'shoulders'
  },
  'Elevação Lateral': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/21.gif',
    category: 'shoulders'
  },
  'Elevação Frontal': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/22.gif',
    category: 'shoulders'
  },
  'Desenvolvimento Arnold': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/19.gif',
    category: 'shoulders'
  },

  // BRAÇOS
  'Rosca Direta': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/31.gif',
    category: 'arms'
  },
  'Rosca Martelo': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/32.gif',
    category: 'arms'
  },
  'Tríceps Testa': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/43.gif',
    category: 'arms'
  },
  'Tríceps Pulley': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/45.gif',
    category: 'arms'
  },
  'Rosca Concentrada': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/35.gif',
    category: 'arms'
  },

  // ABDOMEN
  'Abdominal': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/61.gif',
    category: 'abs'
  },
  'Prancha': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/62.gif',
    category: 'abs'
  },
  'Elevação de Pernas': {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/63.gif',
    category: 'abs'
  },
  'Russian Twist': {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/65.gif',
    category: 'abs'
  }
};

// Imagens padrão por categoria
const defaultImages = {
  chest: {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/10.gif'
  },
  back: {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/83.gif'
  },
  legs: {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/141.gif'
  },
  shoulders: {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/18.gif'
  },
  arms: {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/31.gif'
  },
  abs: {
    static: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/61.gif'
  },
  default: {
    static: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    animated: 'https://www.jefit.com/images/exercises/800_600/10.gif'
  }
};

export class ExerciseImageService {
  private static instance: ExerciseImageService;
  private imageCache = new Map<string, string>();
  private loadingPromises = new Map<string, Promise<string>>();

  static getInstance(): ExerciseImageService {
    if (!ExerciseImageService.instance) {
      ExerciseImageService.instance = new ExerciseImageService();
    }
    return ExerciseImageService.instance;
  }

  /**
   * Obtém a imagem estática para um exercício
   */
  getStaticImage(exerciseName: string): string {
    const normalizedName = this.normalizeExerciseName(exerciseName);
    const exercise = exerciseImages[normalizedName];
    
    if (exercise) {
      return exercise.static;
    }

    // Fallback baseado na categoria
    const category = this.getCategoryFromName(exerciseName);
    return defaultImages[category as keyof typeof defaultImages]?.static || defaultImages.default.static;
  }

  /**
   * Obtém o GIF animado para um exercício
   */
  getAnimatedImage(exerciseName: string): string {
    const normalizedName = this.normalizeExerciseName(exerciseName);
    const exercise = exerciseImages[normalizedName];
    
    if (exercise) {
      return exercise.animated;
    }

    // Fallback baseado na categoria
    const category = this.getCategoryFromName(exerciseName);
    return defaultImages[category as keyof typeof defaultImages]?.animated || defaultImages.default.animated;
  }

  /**
   * Obtém ambas as imagens (estática e animada) para um exercício
   */
  getExerciseImages(exerciseName: string): { static: string; animated: string; category: string } {
    const normalizedName = this.normalizeExerciseName(exerciseName);
    const exercise = exerciseImages[normalizedName];
    
    if (exercise) {
      return exercise;
    }

    // Fallback baseado na categoria
    const category = this.getCategoryFromName(exerciseName);
    const defaultForCategory = defaultImages[category as keyof typeof defaultImages] || defaultImages.default;
    
    return {
      static: defaultForCategory.static,
      animated: defaultForCategory.animated,
      category
    };
  }

  /**
   * Pré-carrega imagens para melhor performance
   */
  async preloadImage(url: string): Promise<string> {
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url)!;
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    const promise = new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(url, url);
        resolve(url);
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    });

    this.loadingPromises.set(url, promise);
    
    try {
      const result = await promise;
      this.loadingPromises.delete(url);
      return result;
    } catch (error) {
      this.loadingPromises.delete(url);
      throw error;
    }
  }

  /**
   * Pré-carrega imagens de uma lista de exercícios
   */
  async preloadExerciseImages(exerciseNames: string[]): Promise<void> {
    const promises = exerciseNames.flatMap(name => {
      const images = this.getExerciseImages(name);
      return [
        this.preloadImage(images.static),
        this.preloadImage(images.animated)
      ];
    });

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    }
  }

  /**
   * Verifica se uma imagem está cached
   */
  isImageCached(url: string): boolean {
    return this.imageCache.has(url);
  }

  /**
   * Normaliza o nome do exercício para busca
   */
  private normalizeExerciseName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[ñ]/g, 'n')
      .trim();
  }

  /**
   * Determina a categoria baseada no nome do exercício
   */
  private getCategoryFromName(name: string): string {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('supino') || lowerName.includes('peito') || lowerName.includes('crucifixo') || lowerName.includes('flexão')) {
      return 'chest';
    }
    if (lowerName.includes('pull') || lowerName.includes('remada') || lowerName.includes('puxada') || lowerName.includes('terra')) {
      return 'back';
    }
    if (lowerName.includes('agacha') || lowerName.includes('leg') || lowerName.includes('extensão') || lowerName.includes('flexão de pernas') || lowerName.includes('afundo')) {
      return 'legs';
    }
    if (lowerName.includes('desenvolvimento') || lowerName.includes('elevação') || lowerName.includes('ombro')) {
      return 'shoulders';
    }
    if (lowerName.includes('rosca') || lowerName.includes('tríceps') || lowerName.includes('bíceps')) {
      return 'arms';
    }
    if (lowerName.includes('abdominal') || lowerName.includes('prancha') || lowerName.includes('abs')) {
      return 'abs';
    }
    
    return 'default';
  }

  /**
   * Obtém todas as imagens disponíveis
   */
  getAllExerciseImages(): ExerciseImageMap {
    return { ...exerciseImages };
  }

  /**
   * Adiciona uma nova imagem de exercício
   */
  addExerciseImage(name: string, images: { static: string; animated: string; category: string }): void {
    const normalizedName = this.normalizeExerciseName(name);
    exerciseImages[normalizedName] = images;
  }
}

export const exerciseImageService = ExerciseImageService.getInstance(); 