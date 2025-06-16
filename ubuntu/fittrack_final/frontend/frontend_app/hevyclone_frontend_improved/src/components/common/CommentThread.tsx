// src/components/CommentThread.tsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import type { Comment, WorkoutInteractionRequestDTO } from "../../types/feed";
import { useAuth } from "../../context/AuthContext";

function CommentThread({ workoutId }: { workoutId: number }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newReply, setNewReply] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const comments = await api.get<Comment[]>(`/feed/interactions/comments/${workoutId}`);
      setComments(comments);
    } catch (err) {
      console.error("Erro ao buscar comentários:", err);
      setError("Erro ao carregar comentários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [workoutId]);

  const handleReply = async (parentId: number) => {
    if (!user || !newReply[parentId]) return;

    const dto: WorkoutInteractionRequestDTO = {
      userId: parseInt(user.id),
      workoutId,
      comment: newReply[parentId],
      parentCommentId: parentId,
    };

    try {
      await api.post("/feed/interactions/comment", dto);
      setNewReply((prev) => ({ ...prev, [parentId]: "" }));
      fetchComments();
    } catch (err) {
      console.error("Erro ao enviar resposta:", err);
      setError("Erro ao enviar resposta.");
    }
  };

  const renderReplies = (parentId: number) =>
    comments
      .filter((c) => c.parentCommentId === parentId)
      .map((reply) => (
        <div key={reply.id} className="ml-6 border-l pl-3 border-gray-600 mt-1">
          <p className="text-sm text-gray-300">
            <strong>{reply.userName}:</strong> {reply.content}
          </p>
        </div>
      ));

  const rootComments = comments.filter((c) => !c.parentCommentId);

  return (
    <div className="space-y-4 mt-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading ? (
        <p className="text-gray-400">🔄 Carregando comentários...</p>
      ) : (
        rootComments.map((comment) => (
          <div key={comment.id} className="text-sm text-gray-300">
            <p>
              <strong>{comment.userName}:</strong> {comment.content}
            </p>

            {renderReplies(comment.id)}

            {user && (
              <div className="mt-2 flex gap-2">
                <input
                  value={newReply[comment.id] || ""}
                  onChange={(e) =>
                    setNewReply((prev) => ({
                      ...prev,
                      [comment.id]: e.target.value,
                    }))
                  }
                  className="bg-gray-700 text-white p-1 rounded w-full"
                  placeholder="Escreva uma resposta..."
                />
                <button
                  onClick={() => handleReply(comment.id)}
                  className="text-blue-500 hover:underline"
                >
                  Enviar
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CommentThread;
