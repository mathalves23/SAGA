import React from "react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import type { FeedDTO } from "../../types/feed";
import FeedItem from "../../pages/feed/FeedItem";
import toast, { Toaster } from "react-hot-toast";

type FilterType = "all" | "exercises" | "achievements" | "challenges" | "rankings";

function DiscoverFeed() {
  const [discoverFeed, setDiscoverFeed] = useState<FeedDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const fetchDiscover = async () => {
      try {
        const res = await api.get("/feed/discover");
        setDiscoverFeed(res.data as unknown);
      } catch (err) {
        console.error("Erro ao carregar feed discover:", err);
        toast.error("Erro ao buscar sugestões públicas");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscover();
  }, []);

  const filteredFeed = discoverFeed.filter((item) => {
    switch (filter) {
      case "exercises":
        return item.exercises.length > 0;
      case "achievements":
        return item.achievements.length > 0;
      case "challenges":
        return item.challenges.length > 0;
      case "rankings":
        return item.rankings.length > 0;
      default:
        return true;
    }
  });

  return (
    <div className="text-white min-h-screen bg-gray-900 p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl mb-6">🌍 Descobrir</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "exercises", "achievements", "challenges", "rankings"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === f ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            {{
              all: "Todos",
              exercises: "Exercícios",
              achievements: "Conquistas",
              challenges: "Desafios",
              rankings: "Rankings",
            }[f]}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {loading ? (
        <p className="text-gray-400">🔄 Carregando sugestões...</p>
      ) : filteredFeed.length === 0 ? (
        <p className="text-gray-400">Nenhum conteúdo encontrado para o filtro selecionado.</p>
      ) : (
        <div className="space-y-6">
          {filteredFeed.map((item) => (
            <div key={`${item.workoutId}-${item.friendName}`}>
              <div className="text-sm mb-2 text-yellow-400 bg-yellow-900/30 px-2 py-1 inline-block rounded-full">
                ✨ Recomendado para você
              </div>
              <FeedItem data={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiscoverFeed;
