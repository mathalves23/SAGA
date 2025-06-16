import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

type CommentBoxProps = {
  workoutId: number;
  onSubmit?: (comment: string) => void;
};

function CommentBox({ workoutId, onSubmit }: CommentBoxProps) {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    const trimmed = comment.trim();
    if (!user || !trimmed) return;

    setSubmitting(true);

    try {
      if (onSubmit) {
        onSubmit(trimmed);
      } else {
        await api.post("/feed/interactions/comment", {
          userId: user.id,
          workoutId,
          comment: trimmed,
        });
      }
      setComment("");
    } catch (error) {
    console.error("Erro ao comentar no treino:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-2">
      <input
        aria-label="Comentário"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="bg-gray-700 text-white p-2 rounded w-full"
        placeholder="Adicione um comentário..."
        disabled={submitting}
      />
      <button
        onClick={handleSubmit}
        disabled={submitting || comment.trim() === ""}
        className={`mt-1 text-blue-500 hover:underline ${
          submitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {submitting ? "Postando..." : "Postar"}
      </button>
    </div>
  );
}

export default CommentBox;
