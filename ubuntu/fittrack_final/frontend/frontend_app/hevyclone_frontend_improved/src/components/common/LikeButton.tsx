import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface LikeButtonProps {
  workoutId: number;
}

// Botão para curtir um treino com interação visual e controle de estado
function LikeButton({ workoutId }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const { user } = useAuth();

  const handleLike = async () => {
    if (!user || liked) return;

    try {
      await api.post("/feed/interactions/comment", {
        userId: user.id,
        workoutId,
        emoji: "👍",
      });
      setLiked(true);
    } catch (error: any) {
      console.error("Erro ao curtir o treino:", error.message || error);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className={`text-blue-500 hover:underline ${liked ? "font-bold" : ""}`}
      aria-label={liked ? "Curtido" : "Curtir treino"}
    >
      {liked ? "Curtido" : "Curtir"}
    </button>
  );
}

export default LikeButton;
