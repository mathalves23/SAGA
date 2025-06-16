import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FeedDTO } from "../../types/feed";
import toast, { Toaster } from "react-hot-toast";
import FeedItem from "./FeedItem";

async function fetchFeed(): Promise<FeedDTO[]> {
  // Implemente a lógica para buscar o feed, por exemplo, usando fetch ou axios
  const response = await fetch("/api/feed");
  if (!response.ok) {
    throw new Error("Erro ao buscar o feed");
  }
  return response.json();
}

function Feed() {
  const { user } = useAuth();
  const [feed, setFeed] = useState<FeedDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetchFeed()
      .then((data) => setFeed(data))
      .catch(() => toast.error("Erro ao carregar feed"))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-3xl mb-6">📰 Feed</h1>

      {loading ? (
        <p className="text-gray-400">Carregando feed...</p>
      ) : (
        feed.map((item) => <FeedItem key={item.workoutId} data={item} />)
      )}
    </div>
  );
}

export default Feed;
