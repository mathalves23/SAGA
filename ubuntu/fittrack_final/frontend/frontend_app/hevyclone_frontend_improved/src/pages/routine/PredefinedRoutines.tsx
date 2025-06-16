import React from "react";
import { useState, useEffect } from "react";
import { routineService } from "../../services/routineService";
import { Link } from "react-router-dom";

type LocalRoutine = {
  id: number;
  title: string;
  description: string;
  targetProfileLevel?: string;
  durationWeeks?: number;
  division?: string;
  exerciseCount?: number;
};

function PredefinedRoutines() {
  const [routines, setRoutines] = useState<LocalRoutine[]>([]);
  const [allRoutines, setAllRoutines] = useState<LocalRoutine[]>([]);
  const [level, setLevel] = useState('');
  const [focus, setFocus] = useState('');
  const [duration, setDuration] = useState('');
  const [split, setSplit] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        setLoading(true);
        const data = await routineService.getAll();
        const mappedData = data.map(routine => ({
          id: routine.id,
          title: routine.title || routine.name || '',
          description: routine.description || '',
          targetProfileLevel: routine.targetProfileLevel,
          durationWeeks: routine.durationWeeks,
          division: routine.division,
          exerciseCount: routine.exercises?.length || 0
        }));
        setAllRoutines(mappedData);
        setRoutines(mappedData);
      } catch (err) {
        console.error("Erro ao buscar rotinas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...allRoutines];

    if (level) {
      filtered = filtered.filter(routine => 
        routine.targetProfileLevel?.toLowerCase() === level.toLowerCase()
      );
    }

    if (focus) {
      // Mapear objetivos para divisões de treino
      const focusMap: Record<string, string[]> = {
        'Hipertrofia': ['Hipertrofia', 'Volume', 'Bro Split'],
        'Força': ['Powerlifting', 'Strongman', 'Upper/Lower'],
        'Resistência': ['HIIT', 'Cardio', 'Funcional', 'Atlético']
      };
      
      if (focusMap[focus]) {
        filtered = filtered.filter(routine => 
          focusMap[focus].some(div => routine.division?.includes(div))
        );
      }
    }

    if (duration) {
      const durationNum = parseInt(duration);
      filtered = filtered.filter(routine => {
        if (!routine.durationWeeks) return false;
        
        if (durationNum === 4) {
          return routine.durationWeeks <= 6;
        } else if (durationNum === 8) {
          return routine.durationWeeks >= 6 && routine.durationWeeks <= 10;
        } else if (durationNum === 12) {
          return routine.durationWeeks >= 10;
        }
        return true;
      });
    }

    if (split) {
      filtered = filtered.filter(routine => 
        routine.division?.toLowerCase().includes(split.toLowerCase())
      );
    }

    setRoutines(filtered);
  }, [level, focus, duration, split, allRoutines]);

  const getDifficultyColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'iniciante': return 'text-green-400 bg-green-900/20';
              case 'intermediário': return 'text-teal-400 bg-teal-900/20';
      case 'avançado': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-700/20';
    }
  };

  const getDurationText = (weeks?: number) => {
    if (!weeks) return 'Variável';
    if (weeks <= 6) return 'Curto prazo';
    if (weeks <= 10) return 'Médio prazo';
    return 'Longo prazo';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-gray-400">Carregando rotinas...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Descobrir Rotinas</h2>
          <p className="text-gray-400 text-sm">
            {routines.length} rotina{routines.length !== 1 ? 's' : ''} encontrada{routines.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <select
            className="bg-[#242426] border border-gray-700 rounded px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">Todos os Níveis</option>
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>

          <select
            className="bg-[#242426] border border-gray-700 rounded px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          >
            <option value="">Todos os Objetivos</option>
            <option value="Hipertrofia">Hipertrofia</option>
            <option value="Força">Força</option>
            <option value="Resistência">Resistência</option>
          </select>

          <select
            className="bg-[#242426] border border-gray-700 rounded px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="">Qualquer Duração</option>
            <option value="4">4-6 Semanas</option>
            <option value="8">8-10 Semanas</option>
            <option value="12">12+ Semanas</option>
          </select>

          <select
            className="bg-[#242426] border border-gray-700 rounded px-4 py-2 text-white focus:border-[#FF7A00] focus:outline-none"
            value={split}
            onChange={(e) => setSplit(e.target.value)}
          >
            <option value="">Qualquer Divisão</option>
            <option value="Full Body">Full Body</option>
            <option value="Upper/Lower">Upper/Lower</option>
            <option value="Push/Pull/Legs">Push/Pull/Legs</option>
            <option value="HIIT">HIIT</option>
            <option value="Cardio">Cardio</option>
            <option value="Home">Casa</option>
          </select>
        </div>

        {(level || focus || duration || split) && (
          <button
            onClick={() => {
              setLevel('');
              setFocus('');
              setDuration('');
              setSplit('');
            }}
            className="text-[#FF7A00] hover:text-[#FF9A40] text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpar filtros
          </button>
        )}
      </div>

      <div className="space-y-4">
        {routines.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-700/20 rounded-full p-6 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-400 mb-4">Nenhuma rotina encontrada com os filtros selecionados</p>
            <button
              onClick={() => {
                setLevel('');
                setFocus('');
                setDuration('');
                setSplit('');
              }}
              className="text-[#FF7A00] hover:text-[#FF9A40] font-medium"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          routines.map((routine) => (
            <div key={routine.id} className="bg-[#1C1C1E] rounded-lg p-6 border border-gray-700 hover:border-[#FF7A00]/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{routine.title}</h3>
                    {routine.targetProfileLevel && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(routine.targetProfileLevel)}`}>
                        {routine.targetProfileLevel}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 mb-3 leading-relaxed">{routine.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {routine.division && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        {routine.division}
                      </div>
                    )}
                    
                    {routine.durationWeeks && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {routine.durationWeeks} semanas • {getDurationText(routine.durationWeeks)}
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {routine.exerciseCount} exercício{routine.exerciseCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Link 
                    to={`/routines/${routine.id}`}
                    className="px-4 py-2 bg-[#FF7A00] hover:bg-[#FF9A40] text-white rounded font-medium text-sm transition-colors"
                  >
                    Ver Rotina
                  </Link>
                  <button className="px-4 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded text-sm transition-colors">
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default PredefinedRoutines;
