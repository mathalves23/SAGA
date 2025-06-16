import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

type Props = {
  workoutId: number;
  parentCommentId: number;
  onSuccess?: () => void;
};

function ReplyBox({ workoutId, parentCommentId, onSuccess }: Props) {
  const { user } = useAuth();
  const [reply, setReply] = useState("");

  const handleSubmit = async () => {
    if (!user || !reply.trim()) return;

    try {
      await api.post("/feed/interactions/comment", {
        userId: user.id,
        workoutId,
        comment: reply,
        parentCommentId,
      });
      setReply("");
      if (onSuccess) onSuccess();
    } catch (error) {
    console.error("Erro ao responder comentário:", error);
    }
  };

  return (
    <div className="mt-1 ml-4">
      <input
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Responder..."
        className="bg-gray-700 text-white p-1 rounded w-full"
      />
      <button
        onClick={handleSubmit}
        className="text-blue-400 text-xs mt-1 hover:underline"
      >
        Enviar
      </button>
    </div>
  );
}

export default ReplyBox;
