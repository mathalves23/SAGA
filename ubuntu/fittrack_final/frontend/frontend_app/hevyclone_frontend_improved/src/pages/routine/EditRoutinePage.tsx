import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { routineService } from '../../services/routineService';
import { toast } from 'react-hot-toast';

type EditRoutineForm = {
  name: string;
  description: string;
  durationWeeks: number;
  targetProfileLevel: string;
};

const EditRoutinePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<EditRoutineForm>({
    name: '',
    description: '',
    durationWeeks: 4,
    targetProfileLevel: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoutine = async () => {
      if (!id) {
        setError('ID da rotina não fornecido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const routine = await routineService.getById(id);
        
        setForm({
          name: routine.name || '',
          description: routine.description || '',
          durationWeeks: routine.durationWeeks || 4,
          targetProfileLevel: routine.targetProfileLevel || ''
        });
        setError(null);
      } catch (err: any) {
        console.error('Erro ao carregar rotina:', err);
        setError('Erro ao carregar rotina');
        toast.error('Erro ao carregar rotina');
      } finally {
        setLoading(false);
      }
    };

    loadRoutine();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'durationWeeks' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Nome da rotina é obrigatório');
      return;
    }



    if (!form.targetProfileLevel) {
      toast.error('Nível da rotina é obrigatório');
      return;
    }

    try {
      setSaving(true);
      await routineService.update(id!, form);
      toast.success('Rotina atualizada com sucesso!');
      navigate(`/routines/${id}`);
    } catch (err: any) {
      console.error('Erro ao atualizar rotina:', err);
      toast.error('Erro ao atualizar rotina. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando rotina...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
          <Link to="/routines" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
            Voltar para Rotinas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/routines" className="text-gray-400 hover:text-white">
                  Rotinas
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <Link to={`/routines/${id}`} className="ml-4 text-gray-400 hover:text-white">
                    {form.name || 'Rotina'}
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span className="ml-4 text-gray-300">Editar</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

                <div className="bg-surface shadow rounded-lg border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">Editar Rotina</h1>
            <p className="mt-2 text-gray-300">Atualize as informações da sua rotina de treino</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nome da Rotina */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Nome da Rotina *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                onFocus={(e) => e.target.select()}
                required
                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary text-white placeholder-gray-400 bg-surface-light"
                placeholder="Ex: Treino de Hipertrofia"
              />
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                onFocus={(e) => e.target.select()}
                rows={3}
                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary text-white placeholder-gray-400 bg-surface-light"
                placeholder="Descreva o objetivo e características da rotina"
              />
            </div>

            {/* Duração */}
            <div>
              <label htmlFor="durationWeeks" className="block text-sm font-medium text-gray-300">
                Duração (semanas) *
              </label>
              <input
                type="number"
                id="durationWeeks"
                name="durationWeeks"
                value={form.durationWeeks}
                onChange={handleChange}
                onFocus={(e) => e.target.select()}
                min="1"
                max="52"
                required
                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary text-white placeholder-gray-400 bg-surface-light"
              />
            </div>

 

            {/* Nível */}
            <div>
              <label htmlFor="targetProfileLevel" className="block text-sm font-medium text-gray-300">
                Nível *
              </label>
              <select
                id="targetProfileLevel"
                name="targetProfileLevel"
                value={form.targetProfileLevel}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary text-white bg-surface-light"
              >
                <option value="">Selecione um nível</option>
                <option value="INICIANTE">Iniciante</option>
                <option value="INTERMEDIARIO">Intermediário</option>
                <option value="AVANCADO">Avançado</option>
              </select>
            </div>

            {/* Botões */}
            <div className="flex space-x-4 pt-6">
              <Link
                to={`/routines/${id}`}
                className="flex-1 bg-surface-light border border-gray-600 text-gray-300 px-4 py-2 rounded-md text-center hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </div>
                ) : (
                  'Salvar Alterações'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRoutinePage; 