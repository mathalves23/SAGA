interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface AIFormAnalysis {
  exercise: string;
  score: number;
  feedback: Array<{
    type: 'good' | 'warning' | 'error';
    message: string;
  }>;
  improvements: string[];
}

interface AIWorkoutPlan {
  name: string;
  duration: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    rest: string;
    tips: string;
  }>;
  description: string;
}

class AIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor() {
    // Em produção, essa chave deveria vir do backend ou variáveis de ambiente
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.REACT_APP_OPENAI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Chave da API OpenAI não configurada. Configure VITE_OPENAI_API_KEY ou REACT_APP_OPENAI_API_KEY');
    }
  }

  private async makeRequest(messages: OpenAIMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API Key da OpenAI não configurada');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Erro ao processar resposta';
    } catch (error) {
      console.error('Erro na chamada da API:', error);
      throw error;
    }
  }

  async chatAssistant(userMessage: string, chatHistory: Array<{type: string, message: string}>): Promise<{message: string, suggestions: string[]}> {
    const systemPrompt = `Você é um personal trainer virtual especializado em fitness e nutrição. 
    Você deve responder em português brasileiro de forma amigável e profissional.
    Suas respostas devem ser práticas e baseadas em evidências científicas.
    Mantenha as respostas concisas (máximo 150 palavras) e sempre ofereça dicas acionáveis.
    
    Contexto do usuário: Usuário ativo interessado em fitness, treinos e nutrição.`;

    const messages: OpenAIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.slice(-4).map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.message
      })),
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await this.makeRequest(messages);
      
      // Gerar sugestões baseadas no contexto
      const suggestions = this.generateSuggestions(userMessage);
      
      return {
        message: response,
        suggestions
      };
    } catch (error) {
      return {
        message: 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes.',
        suggestions: ['Tentar novamente', 'Falar com suporte', 'Ver FAQ']
      };
    }
  }

  async analyzeForm(exerciseName: string, formData?: string): Promise<AIFormAnalysis> {
    const prompt = `Como especialista em biomecânica, analise a execução do exercício "${exerciseName}".
    ${formData ? `Dados da análise: ${formData}` : 'Faça uma análise geral da técnica.'}
    
    Forneça:
    1. Uma pontuação de 0-100
    2. 3-4 pontos de feedback (bom/aviso/erro)
    3. 3-4 melhorias específicas
    
    Responda no formato JSON:
    {
      "score": numero,
      "feedback": [{"type": "good|warning|error", "message": "texto"}],
      "improvements": ["melhoria1", "melhoria2", "melhoria3"]
    }`;

    try {
      const response = await this.makeRequest([
        { role: 'system', content: 'Você é um especialista em biomecânica e análise de movimento.' },
        { role: 'user', content: prompt }
      ]);

      // Tentar parsear JSON, se falhar, criar resposta padrão
      try {
        const parsed = JSON.parse(response);
        return {
          exercise: exerciseName,
          score: parsed.score || 85,
          feedback: parsed.feedback || [
            { type: 'good', message: 'Postura geral adequada' },
            { type: 'warning', message: 'Velocidade pode ser melhorada' }
          ],
          improvements: parsed.improvements || [
            'Foque no controle do movimento',
            'Mantenha a respiração adequada'
          ]
        };
      } catch {
        // Resposta padrão se JSON inválido
        return {
          exercise: exerciseName,
          score: 85,
          feedback: [
            { type: 'good', message: 'Amplitude de movimento adequada' },
            { type: 'warning', message: 'Atenção à postura' }
          ],
          improvements: [
            'Controle melhor a velocidade do movimento',
            'Mantenha o core ativado durante o exercício'
          ]
        };
      }
    } catch (error) {
      console.error('Erro na análise de forma:', error);
      return {
        exercise: exerciseName,
        score: 75,
        feedback: [
          { type: 'warning', message: 'Análise indisponível no momento' }
        ],
        improvements: [
          'Tente novamente em alguns instantes'
        ]
      };
    }
  }

  async processVoiceCommand(command: string): Promise<string> {
    const prompt = `Como assistente virtual de fitness, processe este comando de voz: "${command}"
    
    Responda de forma natural e execute a ação solicitada.
    Se for para:
    - Iniciar treino: confirme e dê orientações
    - Mostrar progresso: forneça insights motivacionais
    - Criar treino: peça detalhes necessários
    - Análise: ofereça feedback
    
    Mantenha a resposta concisa (máximo 100 palavras).`;

    try {
      const response = await this.makeRequest([
        { role: 'system', content: 'Você é um assistente virtual de fitness que processa comandos de voz.' },
        { role: 'user', content: prompt }
      ]);

      return response;
    } catch (error) {
      return 'Comando processado! Como posso ajudar você com seu treino hoje?';
    }
  }

  async generateWorkout(
    objective: string,
    duration: string,
    level: string,
    muscleGroup: string
  ): Promise<AIWorkoutPlan> {
    const prompt = `Crie um treino personalizado com:
    - Objetivo: ${objective}
    - Duração: ${duration}
    - Nível: ${level}
    - Grupo muscular: ${muscleGroup}
    
    Forneça um treino detalhado no formato JSON:
    {
      "name": "Nome do Treino",
      "duration": "tempo estimado",
      "difficulty": "nível",
      "exercises": [
        {
          "name": "Nome do exercício",
          "sets": número_de_séries,
          "reps": "repetições_ou_tempo",
          "rest": "tempo_de_descanso",
          "tips": "dica_técnica"
        }
      ],
      "description": "descrição_geral"
    }`;

    try {
      const response = await this.makeRequest([
        { role: 'system', content: 'Você é um personal trainer especialista em criar treinos personalizados.' },
        { role: 'user', content: prompt }
      ]);

      try {
        const parsed = JSON.parse(response);
        return {
          name: parsed.name || `Treino ${objective}`,
          duration: parsed.duration || duration,
          difficulty: parsed.difficulty as any || level,
          exercises: parsed.exercises || [
            {
              name: 'Exercício personalizado',
              sets: 3,
              reps: '12-15',
              rest: '60s',
              tips: 'Mantenha boa forma'
            }
          ],
          description: parsed.description || 'Treino criado pela IA'
        };
      } catch {
        return this.getDefaultWorkout(objective, duration, level as any);
      }
    } catch (error) {
      console.error('Erro na geração do treino:', error);
      return this.getDefaultWorkout(objective, duration, level as any);
    }
  }

  async getNutritionAdvice(goal: string, userProfile?: any): Promise<string> {
    const prompt = `Como nutricionista esportivo, dê conselhos nutricionais para:
    - Objetivo: ${goal}
    ${userProfile ? `- Perfil: ${JSON.stringify(userProfile)}` : ''}
    
    Forneça dicas práticas e específicas em português. Máximo 200 palavras.`;

    try {
      const response = await this.makeRequest([
        { role: 'system', content: 'Você é um nutricionista esportivo especializado em alimentação para atletas.' },
        { role: 'user', content: prompt }
      ]);

      return response;
    } catch (error) {
      return 'Para seus objetivos, foque em uma alimentação balanceada com proteínas adequadas e hidratação constante.';
    }
  }

  private generateSuggestions(userMessage: string): string[] {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('treino') || lowerMessage.includes('exercício')) {
      return ['Criar treino personalizado', 'Analisar minha forma', 'Dicas de execução'];
    } else if (lowerMessage.includes('nutrição') || lowerMessage.includes('dieta')) {
      return ['Calcular calorias', 'Sugerir refeições', 'Horários ideais'];
    } else if (lowerMessage.includes('progresso') || lowerMessage.includes('resultado')) {
      return ['Ver análise detalhada', 'Ajustar objetivos', 'Comparar períodos'];
    } else {
      return ['Criar treino', 'Dicas de nutrição', 'Analisar progresso', 'Corrigir técnica'];
    }
  }

  private getDefaultWorkout(objective: string, duration: string, level: 'Iniciante' | 'Intermediário' | 'Avançado'): AIWorkoutPlan {
    return {
      name: `Treino ${objective} - ${level}`,
      duration,
      difficulty: level,
      exercises: [
        {
          name: 'Aquecimento dinâmico',
          sets: 1,
          reps: '5-10 min',
          rest: '0s',
          tips: 'Movimentos articulares e ativação muscular'
        },
        {
          name: 'Exercício principal',
          sets: 3,
          reps: level === 'Iniciante' ? '8-12' : level === 'Intermediário' ? '10-15' : '12-20',
          rest: '60-90s',
          tips: 'Foque na técnica antes da carga'
        },
        {
          name: 'Exercício auxiliar',
          sets: 3,
          reps: '12-15',
          rest: '45-60s',
          tips: 'Movimento controlado e amplitude completa'
        },
        {
          name: 'Alongamento',
          sets: 1,
          reps: '5-10 min',
          rest: '0s',
          tips: 'Relaxe e respire profundamente'
        }
      ],
      description: `Treino focado em ${objective} adaptado para seu nível ${level}.`
    };
  }

  // Método para verificar se a API está configurada
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const aiService = new AIService();
export type { AIFormAnalysis, AIWorkoutPlan }; 