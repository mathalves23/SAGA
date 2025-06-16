import { useEffect, useState } from "react";
import api from "../../services/api";
import type { Comment } from "../../types/feed";
import ReplyBox from "./ReplyBox";


function CommentList({ workoutId }: { workoutId: number }) {
  // const { user } = useAuth(); 🔧 removido pois não é usado
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const fetchComments = async () => {
    try {
      const comments = await api.get<Comment[]>(`/feed/interactions/comments/${workoutId}`);
      setComments(comments);
    } catch (error) {
    console.error("Erro ao carregar comentários:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [workoutId]);

  const renderReplies = (parentId: number) => {
    return comments
      .filter((c) => c.parentCommentId === parentId)
      .map((reply) => (
        <li key={reply.id} className="ml-4 mt-1 text-sm text-gray-400">
          <strong>{reply.userName}:</strong> {reply.content}
        </li>
      ));
  };

  return (
    <ul className="mt-2 space-y-2">
      {comments
        .filter((c) => !c.parentCommentId)
        .map((comment) => (
          <li key={comment.id} className="text-sm text-gray-300">
            <div>
              <strong>{comment.userName}:</strong> {comment.content}
              <button
                className="ml-2 text-blue-400 text-xs hover:underline"
                onClick={() =>
                  setReplyingTo(replyingTo === comment.id ? null : comment.id)
                }
              >
                Responder
              </button>
            </div>

            {replyingTo === comment.id && (
              <ReplyBox
                workoutId={workoutId}
                parentCommentId={comment.id}
                onSuccess={() => {
                  fetchComments();
                  setReplyingTo(null);
                }}
              />
            )}

            <ul>{renderReplies(comment.id)}</ul>
          </li>
        ))}
    </ul>
  );
}

export default CommentList;
