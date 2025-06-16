import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import api from "../../services/api";

interface ProfileStats {
  trainingLevel: string;
  totalWorkouts: number;
  totalVolume: number;
}

interface Friend {
  id: number;
  requesterName: string;
  receiverName: string;
  receiverId: number;
}

interface SimpleUser {
  id: number;
  name: string;
}

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileStats | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [followers, setFollowers] = useState<SimpleUser[]>([]);
  const [following, setFollowing] = useState<SimpleUser[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAll = async () => {
      try {
        const [profileRes, friendsRes, followersRes, followingRes] = await Promise.all([
          api.get(`/users/${user.id}/stats/progress`),
          api.get(`/friends/${user.id}`),
          api.get(`/users/${user.id}/followers`),
          api.get(`/users/${user.id}/following`),
        ]);

        setProfile(profileRes.data);
        setFriends(friendsRes.data);
        setFollowers(followersRes.data);
        setFollowing(followingRes.data);
      } catch (err) {
        console.error("Erro ao carregar dados do perfil:", err);
      }
    };

    fetchAll();
  }, [user]);

  if (!profile) return <p className="text-white p-4">Carregando perfil...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Perfil de {user?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Nível de Treino</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl">{profile.trainingLevel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Treinos Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{profile.totalWorkouts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volume Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{profile.totalVolume ?? 0} kg</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Amigos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-4 space-y-1">
            {friends.map((f) => (
              <li key={f.id}>
                {f.receiverId === user?.id ? f.requesterName : f.receiverName}
              </li>
            ))}
            {friends.length === 0 && <li className="text-gray-400">Sem amigos ainda.</li>}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Seguindo</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-4 space-y-1">
            {following.map((u) => (
              <li key={u.id}>{u.name}</li>
            ))}
            {following.length === 0 && <li className="text-gray-400">Você não está seguindo ninguém.</li>}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Seguidores</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-4 space-y-1">
            {followers.map((u) => (
              <li key={u.id}>{u.name}</li>
            ))}
            {followers.length === 0 && <li className="text-gray-400">Nenhum seguidor no momento.</li>}
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Voltar ao Dashboard
        </button>
        <button
          onClick={logout}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Sair
        </button>
      </div>
    </div>
  );
}

export default Profile;
