import { Exercise } from "../types";

const EXERCISES_DATA: Exercise[] = [
  {
    id: "1",
    name: "Bicycle Crunch",
    description: "Exercício eficaz para o desenvolvimento dos músculos abdominais, especialmente os oblíquos. Simula o movimento de pedalar uma bicicleta.",
    category: "Abdominais",
    muscleGroups: ["Abdominais", "Oblíquos"],
    difficulty: 2,
    instructions: [
      "Deite de costas no chão ou em um tapete de exercícios",
      "Coloque as mãos atrás da cabeça, mas não entrelace os dedos",
      "Levante ligeiramente os ombros do chão",
      "Dobre o joelho direito em direção ao peito enquanto gira o tronco",
      "Toque o cotovelo esquerdo no joelho direito",
      "Estenda a perna direita enquanto dobra a esquerda",
      "Repita o movimento alternando os lados em um movimento fluido"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/bicycle-crunch-video",
    equipment: ["Nenhum"]
  },
  {
    id: "2", 
    name: "Bird Dog",
    description: "Exercício de estabilização que fortalece o core, melhora o equilíbrio e trabalha a coordenação entre membros opostos.",
    category: "Core/Estabilização",
    muscleGroups: ["Glúteos", "Core", "Ombros"],
    difficulty: 2,
    instructions: [
      "Posicione-se em quatro apoios (mãos e joelhos)",
      "Mantenha as mãos alinhadas com os ombros e joelhos com os quadris",
      "Mantenha a coluna neutra e o core contraído",
      "Estenda simultaneamente o braço direito à frente e a perna esquerda para trás",
      "Mantenha a posição por 2-3 segundos",
      "Retorne à posição inicial de forma controlada",
      "Repita com o braço esquerdo e perna direita"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/bird-dog-video",
    equipment: ["Nenhum"]
  },
  {
    id: "3",
    name: "Box Jump", 
    description: "Exercício pliométrico explosivo que desenvolve potência nas pernas, força dos quadríceps e capacidade atlética geral.",
    category: "Pliometria",
    muscleGroups: ["Quadríceps", "Glúteos", "Panturrilhas"],
    difficulty: 3,
    instructions: [
      "Posicione-se em frente a uma caixa ou plataforma estável",
      "Fique com os pés na largura dos ombros",
      "Faça um agachamento rápido preparatório",
      "Salte explosivamente sobre a caixa",
      "Aterrisse suavemente com ambos os pés na caixa",
      "Mantenha os joelhos ligeiramente flexionados ao aterrissar",
      "Desça da caixa com cuidado, um pé de cada vez"
    ],
    imageUrl: "https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/box-jump-video", 
    equipment: ["Caixa pliométrica"]
  },
  {
    id: "4",
    name: "Push-up",
    description: "Exercício clássico de peso corporal que desenvolve força do peito, ombros e tríceps, além de trabalhar o core.",
    category: "Peito",
    muscleGroups: ["Peitoral", "Tríceps", "Ombros", "Core"],
    difficulty: 2,
    instructions: [
      "Posicione-se em prancha com as mãos no chão",
      "Coloque as mãos ligeiramente mais largas que os ombros",
      "Mantenha o corpo em linha reta da cabeça aos pés",
      "Contraia o core e mantenha os glúteos ativos",
      "Desça o corpo flexionando os cotovelos",
      "Desça até o peito quase tocar o chão",
      "Empurre o corpo de volta à posição inicial"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/push-up-video",
    equipment: ["Nenhum"]
  },
  {
    id: "5",
    name: "Squat",
    description: "Movimento fundamental que desenvolve força nas pernas e glúteos, considerado um dos exercícios mais importantes.",
    category: "Pernas", 
    muscleGroups: ["Quadríceps", "Glúteos", "Isquiotibiais", "Core"],
    difficulty: 1,
    instructions: [
      "Fique em pé com os pés na largura dos ombros",
      "Mantenha o peito erguido e o core contraído",
      "Inicie o movimento empurrando o quadril para trás",
      "Desça flexionando joelhos e quadris simultaneamente",
      "Desça até as coxas ficarem paralelas ao chão",
      "Mantenha os joelhos alinhados com os pés",
      "Empurre pelos calcanhares para subir"
    ],
    imageUrl: "https://images.unsplash.com/photo-1566241134987-da2ff13c9846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/squat-video",
    equipment: ["Nenhum"]
  },
  {
    id: "6",
    name: "Plank",
    description: "Exercício isométrico fundamental para desenvolver força e estabilidade do core.",
    category: "Core",
    muscleGroups: ["Abdominais", "Core", "Ombros", "Glúteos"],
    difficulty: 2,
    instructions: [
      "Posicione-se em prancha sobre os cotovelos",
      "Mantenha os cotovelos alinhados com os ombros",
      "Mantenha o corpo em linha reta",
      "Contraia o core e os glúteos",
      "Respire normalmente durante o exercício",
      "Mantenha a posição pelo tempo determinado",
      "Evite levantar ou abaixar o quadril"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/plank-video",
    equipment: ["Nenhum"]
  },
  {
    id: "7",
    name: "Burpee",
    description: "Exercício de corpo inteiro que combina força e cardio, excelente para condicionamento físico.",
    category: "Cardio/Força",
    muscleGroups: ["Corpo inteiro", "Core", "Pernas", "Braços"],
    difficulty: 4,
    instructions: [
      "Comece em pé com os pés na largura dos ombros",
      "Agache e coloque as mãos no chão",
      "Salte os pés para trás ficando em prancha",
      "Faça uma flexão (opcional)",
      "Salte os pés de volta para perto das mãos",
      "Salte verticalmente com os braços acima da cabeça",
      "Aterrisse suavemente e repita"
    ],
    imageUrl: "https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/burpee-video",
    equipment: ["Nenhum"]
  },
  {
    id: "8",
    name: "Mountain Climber",
    description: "Exercício cardio que trabalha core, ombros e pernas simultaneamente em movimento dinâmico.",
    category: "Cardio/Core",
    muscleGroups: ["Core", "Ombros", "Quadríceps", "Glúteos"],
    difficulty: 3,
    instructions: [
      "Comece em posição de prancha alta",
      "Mantenha as mãos firmes no chão",
      "Traga um joelho em direção ao peito",
      "Retorne a perna à posição inicial",
      "Alterne rapidamente as pernas",
      "Mantenha o core contraído",
      "Evite levantar o quadril"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://example.com/mountain-climber-video",
    equipment: ["Nenhum"]
  }
];

class ExerciseService {
  private exercises: Exercise[] = EXERCISES_DATA;

  async getExercises(): Promise<Exercise[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return this.exercises;
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.exercises.find(exercise => exercise.id === id) || null;
  }

  async searchExercises(query: string): Promise<Exercise[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const searchTerm = query.toLowerCase();
    
    return this.exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm) ||
      exercise.description.toLowerCase().includes(searchTerm) ||
      exercise.category.toLowerCase().includes(searchTerm) ||
      exercise.muscleGroups.some(group => 
        group.toLowerCase().includes(searchTerm)
      )
    );
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.exercises.filter(exercise => 
      exercise.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  async getCategories(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const categories = [...new Set(this.exercises.map(exercise => exercise.category))];
    return categories.sort();
  }

  async getMuscleGroups(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const muscleGroups = new Set<string>();
    this.exercises.forEach(exercise => {
      exercise.muscleGroups.forEach(group => muscleGroups.add(group));
    });
    return Array.from(muscleGroups).sort();
  }

  async getPopularExercises(): Promise<Exercise[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const popularIds = ["1", "2", "3", "4", "5"];
    return this.exercises.filter(exercise => popularIds.includes(exercise.id));
  }
}

export const exerciseService = new ExerciseService();
