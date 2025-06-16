import React from "react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import FeedItem from "../../pages/feed/FeedItem";
import type { FeedDTO } from "../../types/feed";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function PersonalFeed() {
  const { user } = useAuth();
  const [feedItems, setFeedItems] = useState<FeedDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api
        .get(`/feed/${user.id}`)
        .then((response) => setFeedItems(response.data as unknown))
        .catch(() => toast.error("Erro ao carregar feed"))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleLike = async (workoutId: number) => {
    try {
      await api.post("/feed/interactions/comment", {
        userId: user?.id,
        workoutId,
        emoji: "👍",
      });
      toast.success("Você curtiu o treino!");
    } catch (error) {
      toast.error("Erro ao curtir o treino.");
    }
  };

  const handleComment = async (workoutId: number, comment: string) => {
    try {
      await api.post("/feed/interactions/comment", {
        userId: user?.id,
        workoutId,
        comment,
      });
      toast.success("Comentário enviado!");
    } catch (error) {
      toast.error("Erro ao enviar comentário.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl mb-6">📰 Feed</h1>
      {loading ? (
        <p className="text-gray-400">Carregando feed...</p>
      ) : (
        feedItems.map((item, idx) => (
          <FeedItem
            key={idx}
            data={item}
            onLike={() => handleLike(item.workoutId)}
            onComment={(comment) => handleComment(item.workoutId, comment)}
          />
        ))
      )}
    </div>
  );
}

export default PersonalFeed;
