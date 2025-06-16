import { useState } from "react";
import { FeedDTO } from "../../types/feed";
import CommentBox from "../../components/common/CommentBox";
import CommentList from "../../components/common/CommentList";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

type Props = {
  data: FeedDTO;
  onLike?: () => void;
  onComment?: (comment: string) => void;
};

function FeedItem({ data, onLike, onComment }: Props) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [following, setFollowing] = useState(false);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleSaveWorkout = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await api.post("/feed/interactions/save-workout", {
        userId: user.id,
        workoutId: data.workoutId,
      });
      toast.success("Treino salvo com sucesso!");
    } catch {
      toast.error("Erro ao salvar treino.");
    } finally {
      setSaving(false);
    }
  };

  const handleFollowUser = async () => {
    if (!user) return;
    setFollowing(true);
    try {
      await api.post("/feed/interactions/follow", {
        userId: user.id,
        followeeId: data.userId,
      });
      toast.success(`Agora você segue ${data.friendName}!`);
    } catch {
      toast.error("Erro ao seguir usuário.");
    } finally {
      setFollowing(false);
    }
  };

  return (
    <div className="feed-item bg-gray-800 p-4 rounded mb-4 shadow space-y-2">
      <p className="text-sm text-gray-400">
        {data.friendName} — {formatDate(data.workoutDate)}
      </p>

      {data.exercises.length > 0 && (
        <>
          <h2 className="font-bold">🏋️ Exercícios</h2>
          <ul className="ml-4 list-disc">
            {data.exercises.map((ex, i) => (
              <li key={i}>
                {ex.exerciseName} — {ex.totalReps} repetições — {ex.maxWeight} kg
              </li>
            ))}
          </ul>
        </>
      )}

      {data.achievements.length > 0 && (
        <>
          <h2 className="font-bold">🏆 Conquistas</h2>
          <ul className="ml-4 list-disc">
            {data.achievements.map((a, i) => (
              <li key={i}>
                {a.title} — {formatDate(a.date)}
              </li>
            ))}
          </ul>
        </>
      )}

      {data.challenges.length > 0 && (
        <>
          <h2 className="font-bold">⚔️ Desafios</h2>
          <ul className="ml-4 list-disc">
            {data.challenges.map((c, i) => (
              <li key={i}>
                {c.title} ({c.challengerName} x {c.opponentName}) até{" "}
                {formatDate(c.deadline)}
              </li>
            ))}
          </ul>
        </>
      )}

      {data.rankings.length > 0 && (
        <>
          <h2 className="font-bold">📊 Rankings</h2>
          <ul className="ml-4 list-disc">
            {data.rankings.map((r, i) => (
              <li key={i}>
                {r.metric}: {r.value}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="flex flex-wrap gap-4 mt-4">
        <button
          className="text-blue-400 hover:underline"
          onClick={onLike}
          aria-label="Curtir treino"
        >
          👍 Curtir
        </button>

        <CommentBox workoutId={data.workoutId} onSubmit={onComment} />

        <button
          className="text-green-500 hover:underline"
          onClick={handleSaveWorkout}
          disabled={saving}
          aria-label="Salvar treino"
        >
          {saving ? "Salvando..." : "💾 Salvar Treino"}
        </button>

        {user?.id !== data.userId && (
          <button
                          className="text-teal-400 hover:underline"
            onClick={handleFollowUser}
            disabled={following}
            aria-label={`Seguir ${data.friendName}`}
          >
            {following ? "Seguindo..." : `👤 Seguir ${data.friendName}`}
          </button>
        )}
      </div>

      <CommentList workoutId={data.workoutId} />
    </div>
  );
}

export default FeedItem;
