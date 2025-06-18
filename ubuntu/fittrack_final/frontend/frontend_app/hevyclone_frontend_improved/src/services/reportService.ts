import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface ReportData {
  user: {
    name: string;
    email: string;
    age: number;
    weight: number;
    height: number;
  };
  period: {
    start: Date;
    end: Date;
  };
  workouts: {
    total: number;
    duration: number;
    calories: number;
    frequency: number;
    byType: Record<string, number>;
    byMuscleGroup: Record<string, number>;
  };
  exercises: {
    total: number;
    favorites: string[];
    progressions: Array<{
      exercise: string;
      startWeight: number;
      endWeight: number;
      improvement: number;
    }>;
  };
  nutrition: {
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFat: number;
    waterIntake: number;
    mealsLogged: number;
  };
  achievements: {
    unlocked: number;
    totalXP: number;
    level: number;
    streaks: {
      current: number;
      longest: number;
    };
  };
  goals: {
    achieved: number;
    total: number;
    completionRate: number;
  };
  insights: string[];
  recommendations: string[];
}

export interface ReportConfig {
  type: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  format: 'pdf' | 'excel' | 'json';
  sections: {
    summary: boolean;
    workouts: boolean;
    nutrition: boolean;
    progress: boolean;
    achievements: boolean;
    insights: boolean;
  };
  charts: boolean;
  detailed: boolean;
}

class ReportService {
  private generateMockData(period: { start: Date; end: Date }): ReportData {
    return {
      user: {
        name: 'João Silva',
        email: 'joao@example.com',
        age: 28,
        weight: 78.5,
        height: 175
      },
      period,
      workouts: {
        total: 24,
        duration: 1080, // minutes
        calories: 8640,
        frequency: 4.8, // per week
        byType: {
          'Musculação': 18,
          'Cardio': 4,
          'HIIT': 2
        },
        byMuscleGroup: {
          'Peito': 6,
          'Costas': 5,
          'Pernas': 8,
          'Ombros': 3,
          'Braços': 2
        }
      },
      exercises: {
        total: 145,
        favorites: ['Supino Reto', 'Agachamento', 'Levantamento Terra'],
        progressions: [
          { exercise: 'Supino Reto', startWeight: 70, endWeight: 85, improvement: 21.4 },
          { exercise: 'Agachamento', startWeight: 100, endWeight: 125, improvement: 25.0 },
          { exercise: 'Levantamento Terra', startWeight: 120, endWeight: 150, improvement: 25.0 }
        ]
      },
      nutrition: {
        avgCalories: 2145,
        avgProtein: 145,
        avgCarbs: 220,
        avgFat: 85,
        waterIntake: 2.8, // liters
        mealsLogged: 156
      },
      achievements: {
        unlocked: 18,
        totalXP: 4750,
        level: 12,
        streaks: {
          current: 7,
          longest: 21
        }
      },
      goals: {
        achieved: 8,
        total: 12,
        completionRate: 66.7
      },
      insights: [
        'Sua consistência melhorou 35% no último mês',
        'Exercícios de pernas mostram maior progressão',
        'Consumo de proteína está adequado para seus objetivos',
        'Frequência cardíaca em treinos está na zona ideal'
      ],
      recommendations: [
        'Incluir mais exercícios unilaterais para correção de assimetrias',
        'Aumentar hidratação em 300ml por dia',
        'Adicionar 1 dia de descanso ativo por semana',
        'Focar em exercícios de mobilidade no aquecimento'
      ]
    };
  }

  async generatePDFReport(data: ReportData, config: ReportConfig): Promise<Blob> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(139, 92, 246); // Purple
    pdf.text('SAGA FITNESS', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Relatório de Progresso', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;

    // User Info
    pdf.setFontSize(12);
    pdf.text(`Usuário: ${data.user.name}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Email: ${data.user.email}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Período: ${format(data.period.start, 'dd/MM/yyyy', { locale: ptBR })} - ${format(data.period.end, 'dd/MM/yyyy', { locale: ptBR })}`, 20, yPosition);
    yPosition += 20;

    // Summary Section
    if (config.sections.summary) {
      pdf.setFontSize(16);
      pdf.setTextColor(139, 92, 246);
      pdf.text('📊 Resumo Geral', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      
      const summaryData = [
        [`Total de Treinos:`, `${data.workouts.total}`],
        [`Tempo Total:`, `${Math.floor(data.workouts.duration / 60)}h ${data.workouts.duration % 60}min`],
        [`Calorias Queimadas:`, `${data.workouts.calories.toLocaleString()} kcal`],
        [`Frequência Semanal:`, `${data.workouts.frequency} treinos`],
        [`Nível Atual:`, `${data.achievements.level} (${data.achievements.totalXP} XP)`],
        [`Conquistas:`, `${data.achievements.unlocked} desbloqueadas`]
      ];

      summaryData.forEach(([label, value]) => {
        pdf.text(label, 25, yPosition);
        pdf.text(value, 120, yPosition);
        yPosition += 8;
      });

      yPosition += 10;
    }

    // Workout Analysis
    if (config.sections.workouts) {
      pdf.setFontSize(16);
      pdf.setTextColor(139, 92, 246);
      pdf.text('💪 Análise de Treinos', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      
      // Workout Types
      pdf.text('Distribuição por Tipo:', 25, yPosition);
      yPosition += 10;
      
      Object.entries(data.workouts.byType).forEach(([type, count]) => {
        const percentage = ((count / data.workouts.total) * 100).toFixed(1);
        pdf.text(`• ${type}: ${count} treinos (${percentage}%)`, 30, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Muscle Groups
      pdf.text('Distribuição por Grupo Muscular:', 25, yPosition);
      yPosition += 10;
      
      Object.entries(data.workouts.byMuscleGroup).forEach(([muscle, count]) => {
        pdf.text(`• ${muscle}: ${count} treinos`, 30, yPosition);
        yPosition += 8;
      });

      yPosition += 15;
    }

    // Progress Section
    if (config.sections.progress) {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setTextColor(139, 92, 246);
      pdf.text('📈 Progressão de Exercícios', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);

      data.exercises.progressions.forEach((progression) => {
        pdf.text(`${progression.exercise}:`, 25, yPosition);
        yPosition += 8;
        pdf.text(`• Peso inicial: ${progression.startWeight}kg`, 30, yPosition);
        yPosition += 6;
        pdf.text(`• Peso atual: ${progression.endWeight}kg`, 30, yPosition);
        yPosition += 6;
        pdf.text(`• Melhoria: +${progression.improvement}%`, 30, yPosition);
        yPosition += 10;
      });

      yPosition += 10;
    }

    // Nutrition Section
    if (config.sections.nutrition) {
      pdf.setFontSize(16);
      pdf.setTextColor(139, 92, 246);
      pdf.text('🍎 Análise Nutricional', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);

      const nutritionData = [
        [`Calorias Médias:`, `${data.nutrition.avgCalories} kcal/dia`],
        [`Proteína Média:`, `${data.nutrition.avgProtein}g/dia`],
        [`Carboidratos Médios:`, `${data.nutrition.avgCarbs}g/dia`],
        [`Gordura Média:`, `${data.nutrition.avgFat}g/dia`],
        [`Hidratação Média:`, `${data.nutrition.waterIntake}L/dia`],
        [`Refeições Registradas:`, `${data.nutrition.mealsLogged}`]
      ];

      nutritionData.forEach(([label, value]) => {
        pdf.text(label, 25, yPosition);
        pdf.text(value, 120, yPosition);
        yPosition += 8;
      });

      yPosition += 15;
    }

    // Insights Section
    if (config.sections.insights) {
      // Check if we need a new page
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setTextColor(139, 92, 246);
      pdf.text('💡 Insights e Recomendações', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);

      pdf.text('Insights:', 25, yPosition);
      yPosition += 10;

      data.insights.forEach((insight) => {
        const lines = pdf.splitTextToSize(`• ${insight}`, pageWidth - 50);
        pdf.text(lines, 30, yPosition);
        yPosition += lines.length * 6;
      });

      yPosition += 10;

      pdf.text('Recomendações:', 25, yPosition);
      yPosition += 10;

      data.recommendations.forEach((recommendation) => {
        const lines = pdf.splitTextToSize(`• ${recommendation}`, pageWidth - 50);
        pdf.text(lines, 30, yPosition);
        yPosition += lines.length * 6;
      });
    }

    // Footer
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })} - Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    return pdf.output('blob');
  }

  async generateExcelReport(data: ReportData, config: ReportConfig): Promise<Blob> {
    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    if (config.sections.summary) {
      const summaryData = [
        ['SAGA FITNESS - Relatório de Progresso'],
        [''],
        ['Informações do Usuário'],
        ['Nome', data.user.name],
        ['Email', data.user.email],
        ['Idade', `${data.user.age} anos`],
        ['Peso', `${data.user.weight} kg`],
        ['Altura', `${data.user.height} cm`],
        [''],
        ['Período do Relatório'],
        ['Data Início', format(data.period.start, 'dd/MM/yyyy')],
        ['Data Fim', format(data.period.end, 'dd/MM/yyyy')],
        [''],
        ['Resumo Geral'],
        ['Total de Treinos', data.workouts.total],
        ['Tempo Total (min)', data.workouts.duration],
        ['Calorias Queimadas', data.workouts.calories],
        ['Frequência Semanal', data.workouts.frequency],
        ['Nível Atual', data.achievements.level],
        ['XP Total', data.achievements.totalXP],
        ['Conquistas Desbloqueadas', data.achievements.unlocked]
      ];

      const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summaryWS, 'Resumo');
    }

    // Workouts Sheet
    if (config.sections.workouts) {
      const workoutTypeData = [
        ['Distribuição por Tipo de Treino'],
        ['Tipo', 'Quantidade', 'Percentual'],
        ...Object.entries(data.workouts.byType).map(([type, count]) => [
          type,
          count,
          `${((count / data.workouts.total) * 100).toFixed(1)}%`
        ])
      ];

      const workoutMuscleData = [
        [''],
        ['Distribuição por Grupo Muscular'],
        ['Grupo Muscular', 'Quantidade'],
        ...Object.entries(data.workouts.byMuscleGroup).map(([muscle, count]) => [
          muscle,
          count
        ])
      ];

      const workoutData = [...workoutTypeData, ...workoutMuscleData];
      const workoutWS = XLSX.utils.aoa_to_sheet(workoutData);
      XLSX.utils.book_append_sheet(workbook, workoutWS, 'Treinos');
    }

    // Progress Sheet
    if (config.sections.progress) {
      const progressData = [
        ['Progressão de Exercícios'],
        ['Exercício', 'Peso Inicial (kg)', 'Peso Atual (kg)', 'Melhoria (%)'],
        ...data.exercises.progressions.map(prog => [
          prog.exercise,
          prog.startWeight,
          prog.endWeight,
          `${prog.improvement}%`
        ])
      ];

      const progressWS = XLSX.utils.aoa_to_sheet(progressData);
      XLSX.utils.book_append_sheet(workbook, progressWS, 'Progresso');
    }

    // Nutrition Sheet
    if (config.sections.nutrition) {
      const nutritionData = [
        ['Análise Nutricional'],
        ['Métrica', 'Valor', 'Unidade'],
        ['Calorias Médias', data.nutrition.avgCalories, 'kcal/dia'],
        ['Proteína Média', data.nutrition.avgProtein, 'g/dia'],
        ['Carboidratos Médios', data.nutrition.avgCarbs, 'g/dia'],
        ['Gordura Média', data.nutrition.avgFat, 'g/dia'],
        ['Hidratação Média', data.nutrition.waterIntake, 'L/dia'],
        ['Refeições Registradas', data.nutrition.mealsLogged, 'total']
      ];

      const nutritionWS = XLSX.utils.aoa_to_sheet(nutritionData);
      XLSX.utils.book_append_sheet(workbook, nutritionWS, 'Nutrição');
    }

    // Insights Sheet
    if (config.sections.insights) {
      const insightsData = [
        ['Insights e Recomendações'],
        [''],
        ['Insights'],
        ...data.insights.map(insight => [insight]),
        [''],
        ['Recomendações'],
        ...data.recommendations.map(rec => [rec])
      ];

      const insightsWS = XLSX.utils.aoa_to_sheet(insightsData);
      XLSX.utils.book_append_sheet(workbook, insightsWS, 'Insights');
    }

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  async generateReport(config: ReportConfig, customData?: ReportData): Promise<Blob> {
    // Calculate period based on type
    const now = new Date();
    const period = this.calculatePeriod(config.type, now);
    
    // Use custom data or generate mock data
    const data = customData || this.generateMockData(period);

    switch (config.format) {
      case 'pdf':
        return this.generatePDFReport(data, config);
      case 'excel':
        return this.generateExcelReport(data, config);
      case 'json':
        return new Blob([JSON.stringify(data, null, 2)], { 
          type: 'application/json' 
        });
      default:
        throw new Error('Formato de relatório não suportado');
    }
  }

  private calculatePeriod(type: ReportConfig['type'], endDate: Date): { start: Date; end: Date } {
    const end = new Date(endDate);
    const start = new Date(endDate);

    switch (type) {
      case 'weekly':
        start.setDate(start.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarterly':
        start.setMonth(start.getMonth() - 3);
        break;
      case 'yearly':
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        // For custom, will be set externally
        break;
    }

    return { start, end };
  }

  downloadReport(blob: Blob, filename: string, format: ReportConfig['format']): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${format === 'excel' ? 'xlsx' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async shareReport(blob: Blob, filename: string): Promise<void> {
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], filename, { type: blob.type });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Relatório SAGA Fitness',
            text: 'Compartilhando meu relatório de progresso',
            files: [file]
          });
        } catch (error) {
          console.error('Erro ao compartilhar:', error);
          throw error;
        }
      }
    } else {
      throw new Error('Compartilhamento não suportado neste navegador');
    }
  }

  validateReportConfig(config: ReportConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.type) {
      errors.push('Tipo de relatório é obrigatório');
    }

    if (!config.format) {
      errors.push('Formato de relatório é obrigatório');
    }

    if (!config.sections || Object.keys(config.sections).length === 0) {
      errors.push('Pelo menos uma seção deve ser selecionada');
    }

    const hasSelectedSection = Object.values(config.sections || {}).some(Boolean);
    if (!hasSelectedSection) {
      errors.push('Pelo menos uma seção deve estar habilitada');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const reportService = new ReportService(); 