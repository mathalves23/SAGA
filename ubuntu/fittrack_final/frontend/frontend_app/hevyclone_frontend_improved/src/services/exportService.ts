// src/services/exportService.ts

type ExportFormat = 'json' | 'csv' | 'pdf';
type DataType = 'workouts' | 'goals' | 'progress' | 'all';

interface ExportOptions {
  format: ExportFormat;
  dataType: DataType;
  dateRange?: {
    start: string;
    end: string;
  };
  includeCharts?: boolean;
}

class ExportService {
  
  // Exportar dados no formato especificado
  async exportData(options: ExportOptions): Promise<void> {
    const data = this.collectData(options.dataType, options.dateRange);
    
    switch (options.format) {
      case 'json':
        this.downloadJSON(data, options.dataType);
        break;
      case 'csv':
        this.downloadCSV(data, options.dataType);
        break;
      case 'pdf':
        await this.downloadPDF(data, options);
        break;
    }
  }

  // Coletar dados do localStorage
  private collectData(dataType: DataType, dateRange?: { start: string; end: string }) {
    const data: any = {};
    
    if (dataType === 'workouts' || dataType === 'all') {
      data.workouts = this.getWorkouts(dateRange);
    }
    
    if (dataType === 'goals' || dataType === 'all') {
      data.goals = this.getGoals(dateRange);
    }
    
    if (dataType === 'progress' || dataType === 'all') {
      data.progress = this.getProgress(dateRange);
    }
    
    if (dataType === 'all') {
      data.profile = this.getProfile();
      data.routines = this.getRoutines();
      data.exercises = this.getExercises();
    }
    
    return data;
  }

  private getWorkouts(dateRange?: { start: string; end: string }) {
    try {
      const workouts = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
      
      if (dateRange) {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        
        return workouts.filter((workout: any) => {
          const workoutDate = new Date(workout.savedAt);
          return workoutDate >= start && workoutDate <= end;
        });
      }
      
      return workouts;
    } catch {
      return [];
    }
  }

  private getGoals(dateRange?: { start: string; end: string }) {
    try {
      const goals = JSON.parse(localStorage.getItem('userGoals') || '[]');
      
      if (dateRange) {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        
        return goals.filter((goal: any) => {
          const goalDate = new Date(goal.createdAt);
          return goalDate >= start && goalDate <= end;
        });
      }
      
      return goals;
    } catch {
      return [];
    }
  }

  private getProgress(dateRange?: { start: string; end: string }) {
    try {
      const workouts = this.getWorkouts(dateRange);
      
      // Calcular estatísticas de progresso
      const totalWorkouts = workouts.length;
      const totalDuration = workouts.reduce((sum: number, w: any) => 
        sum + parseInt(w.duration?.replace(' min', '') || '0'), 0
      );
      
      const exerciseCount = workouts.reduce((count: any, w: any) => {
        w.exercises?.forEach((ex: any) => {
          const name = ex.exercise?.name || ex.name;
          count[name] = (count[name] || 0) + 1;
        });
        return count;
      }, {});
      
      return {
        totalWorkouts,
        totalDuration,
        averageDuration: totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0,
        exerciseFrequency: exerciseCount,
        dateRange: dateRange || { start: 'all-time', end: 'all-time' }
      };
    } catch {
      return {};
    }
  }

  private getProfile() {
    try {
      return JSON.parse(localStorage.getItem('userProfile') || '{}');
    } catch {
      return {};
    }
  }

  private getRoutines() {
    try {
      return JSON.parse(localStorage.getItem('savedRoutines') || '[]');
    } catch {
      return [];
    }
  }

  private getExercises() {
    try {
      return JSON.parse(localStorage.getItem('exerciseDatabase') || '[]');
    } catch {
      return [];
    }
  }

  // Download como JSON
  private downloadJSON(data: any, dataType: string) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `saga-fitness-${dataType}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Download como CSV
  private downloadCSV(data: any, dataType: string) {
    let csvContent = '';
    
    if (data.workouts && data.workouts.length > 0) {
      csvContent += 'TREINOS\n';
      csvContent += 'Data,Nome,Duração (min),Exercícios,Notas\n';
      
      data.workouts.forEach((workout: any) => {
        const date = new Date(workout.savedAt).toLocaleDateString('pt-BR');
        const name = workout.routineName || 'Treino Personalizado';
        const duration = workout.duration?.replace(' min', '') || '0';
        const exercises = workout.exercises?.length || 0;
        const notes = (workout.notes || '').replace(/,/g, ';');
        
        csvContent += `${date},${name},${duration},${exercises},"${notes}"\n`;
      });
      csvContent += '\n';
    }
    
    if (data.goals && data.goals.length > 0) {
      csvContent += 'METAS\n';
      csvContent += 'Título,Tipo,Meta,Valor Atual,Unidade,Prazo,Status,Prioridade\n';
      
      data.goals.forEach((goal: any) => {
        const deadline = new Date(goal.deadline).toLocaleDateString('pt-BR');
        csvContent += `${goal.title},${goal.type},${goal.targetValue},${goal.currentValue},${goal.unit},${deadline},${goal.status},${goal.priority}\n`;
      });
      csvContent += '\n';
    }
    
    if (data.progress) {
      csvContent += 'PROGRESSO GERAL\n';
      csvContent += 'Métrica,Valor\n';
      csvContent += `Total de Treinos,${data.progress.totalWorkouts}\n`;
      csvContent += `Duração Total (min),${data.progress.totalDuration}\n`;
      csvContent += `Duração Média (min),${data.progress.averageDuration}\n`;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `saga-fitness-${dataType}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Download como PDF (simplified - sem biblioteca externa)
  private async downloadPDF(data: any, options: ExportOptions) {
    // Para uma implementação completa, usar bibliotecas como jsPDF
    // Por enquanto, criar um HTML formatado e usar print
    
    const htmlContent = this.generateHTMLReport(data, options);
    
    // Abrir em nova janela para impressão/salvamento como PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Aguardar carregamento e abrir diálogo de impressão
      setTimeout(() => {
        printWindow.print();
      }, 1000);
    }
  }

  private generateHTMLReport(data: any, options: ExportOptions): string {
    const now = new Date().toLocaleDateString('pt-BR');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>SAGA Fitness - Relatório de Dados</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 40px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #3b82f6;
              margin: 0;
              font-size: 2.5em;
            }
            .header p {
              color: #666;
              font-size: 1.1em;
              margin: 10px 0;
            }
            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            .section h2 {
              color: #1e293b;
              border-left: 4px solid #3b82f6;
              padding-left: 15px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f8fafc;
              font-weight: 600;
              color: #1e293b;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            .stat-card {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #3b82f6;
            }
            .stat-card h3 {
              margin: 0 0 10px 0;
              color: #1e293b;
            }
            .stat-card .value {
              font-size: 2em;
              font-weight: bold;
              color: #3b82f6;
            }
            .footer {
              margin-top: 60px;
              text-align: center;
              color: #666;
              font-size: 0.9em;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              body { margin: 20px; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏋️‍♂️ SAGA FITNESS</h1>
            <p>Relatório de Dados Pessoais</p>
            <p>Gerado em: ${now}</p>
            ${options.dateRange ? `
              <p>Período: ${new Date(options.dateRange.start).toLocaleDateString('pt-BR')} - 
              ${new Date(options.dateRange.end).toLocaleDateString('pt-BR')}</p>
            ` : ''}
          </div>

          ${data.progress ? `
            <div class="section">
              <h2>📊 Resumo Geral</h2>
              <div class="stats-grid">
                <div class="stat-card">
                  <h3>Total de Treinos</h3>
                  <div class="value">${data.progress.totalWorkouts}</div>
                </div>
                <div class="stat-card">
                  <h3>Tempo Total (horas)</h3>
                  <div class="value">${Math.round(data.progress.totalDuration / 60)}</div>
                </div>
                <div class="stat-card">
                  <h3>Duração Média (min)</h3>
                  <div class="value">${data.progress.averageDuration}</div>
                </div>
              </div>
            </div>
          ` : ''}

          ${data.workouts && data.workouts.length > 0 ? `
            <div class="section">
              <h2>💪 Histórico de Treinos (${data.workouts.length} treinos)</h2>
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Nome do Treino</th>
                    <th>Duração</th>
                    <th>Exercícios</th>
                    <th>Notas</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.workouts.map((workout: any) => `
                    <tr>
                      <td>${new Date(workout.savedAt).toLocaleDateString('pt-BR')}</td>
                      <td>${workout.routineName || 'Treino Personalizado'}</td>
                      <td>${workout.duration || 'N/A'}</td>
                      <td>${workout.exercises?.length || 0}</td>
                      <td>${workout.notes || '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${data.goals && data.goals.length > 0 ? `
            <div class="section">
              <h2>🎯 Metas Definidas (${data.goals.length} metas)</h2>
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Meta</th>
                    <th>Progresso</th>
                    <th>Prazo</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.goals.map((goal: any) => `
                    <tr>
                      <td>${goal.title}</td>
                      <td>${goal.type}</td>
                      <td>${goal.targetValue} ${goal.unit}</td>
                      <td>${goal.currentValue} ${goal.unit} (${Math.round((goal.currentValue / goal.targetValue) * 100)}%)</td>
                      <td>${new Date(goal.deadline).toLocaleDateString('pt-BR')}</td>
                      <td>${goal.status === 'completed' ? '✅ Concluída' : 
                            goal.status === 'active' ? '🎯 Ativa' : '⏸️ Pausada'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          <div class="footer">
            <p>📱 SAGA Fitness - Sua jornada fitness documentada</p>
            <p>Este relatório contém dados pessoais. Mantenha em local seguro.</p>
          </div>
        </body>
      </html>
    `;
  }

  // Verificar disponibilidade de dados
  getAvailableData(): { [key: string]: number } {
    return {
      workouts: this.getWorkouts().length,
      goals: this.getGoals().length,
      routines: this.getRoutines().length,
      exercises: this.getExercises().length
    };
  }

  // Calcular tamanho estimado do export
  getEstimatedSize(dataType: DataType, format: ExportFormat): string {
    const data = this.collectData(dataType);
    const jsonSize = JSON.stringify(data).length;
    
    let multiplier = 1;
    switch (format) {
      case 'csv':
        multiplier = 0.7;
        break;
      case 'pdf':
        multiplier = 2.5;
        break;
    }
    
    const sizeBytes = jsonSize * multiplier;
    
    if (sizeBytes < 1024) return `${Math.round(sizeBytes)} B`;
    if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} KB`;
    return `${Math.round(sizeBytes / (1024 * 1024))} MB`;
  }
}

export const exportService = new ExportService();
export type { ExportOptions, ExportFormat, DataType }; 