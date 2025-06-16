import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../components/ui/select";

interface ProfileStats {
  trainingFrequency: { count: number }[];
  weeklyVolume: { total: number }[];
  maxWeightPerExercise: { exerciseId: number; exerciseName: string; maxWeight: number }[];
}

interface Friend {
  id: number;
  requesterName: string;
  receiverName: string;
}

interface PendingRequest {
  id: number;
  requesterName: string;
}

function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileStats | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const profileRes = await fetch(
          `http://localhost:8080/users/${user?.id}/stats/progress`,
          { credentials: "include" }
        );
        const profileData: ProfileStats = await profileRes.json();

        const friendsRes = await fetch(`http://localhost:8080/friends/${user?.id}`, {
          credentials: "include",
        });
        const friendsData: Friend[] = await friendsRes.json();

        const pendingRes = await fetch(
          `http://localhost:8080/friends/pending/received/${user?.id}`,
          { credentials: "include" }
        );
        const pendingData: PendingRequest[] = await pendingRes.json();

        setProfile(profileData);
        setFriends(friendsData);
        setPending(pendingData);
        setName(user?.name || "");
        setLevel((user as any)?.trainingLevel || "");
      } catch (err) {
        console.error("Erro ao carregar dados do perfil", err);
      }
    }

    if (user?.id) fetchData();
  }, [user]);

  async function handleSave() {
    setLoading(true);
    try {
      await fetch(`http://localhost:8080/users/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, trainingLevel: level }),
      });
    } catch (err) {
      console.error("Erro ao atualizar perfil", err);
    } finally {
      setLoading(false);
    }
  }

  async function acceptRequest(friendshipId: number) {
    try {
      await fetch(`http://localhost:8080/friends/accept/${friendshipId}`, {
        method: "POST",
        credentials: "include",
      });
      setPending((prev) => prev.filter((f) => f.id !== friendshipId));
    } catch (err) {
      console.error("Erro ao aceitar solicitação", err);
    }
  }

  if (!profile) return <div className="text-white p-4">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 space-y-8">
      <h1 className="text-3xl font-bold">Perfil de {user?.name}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
          />
          <div className="space-y-2">
            <label className="block text-sm">Nível de treino</label>
            <Select>
              <SelectTrigger>
                <span>
                  {level === "BEGINNER"
                    ? "Iniciante"
                    : level === "INTERMEDIATE"
                    ? "Intermediário"
                    : level === "ADVANCED"
                    ? "Avançado"
                    : "Selecionar"}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem>
                  <button type="button" className="w-full text-left" onClick={() => setLevel("BEGINNER")}>Iniciante</button>
                </SelectItem>
                <SelectItem>
                  <button type="button" className="w-full text-left" onClick={() => setLevel("INTERMEDIATE")}>Intermediário</button>
                </SelectItem>
                <SelectItem>
                  <button type="button" className="w-full text-left" onClick={() => setLevel("ADVANCED")}>Avançado</button>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Treinos Concluídos</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {profile.trainingFrequency.reduce((acc, f) => acc + f.count, 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Volume Total</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {profile.weeklyVolume.reduce((acc, w) => acc + w.total, 0)} kg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Amigos</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc ml-4">
              {friends.map((f) => (
                <li key={f.id}>
                  {f.receiverName === user?.name ? f.requesterName : f.receiverName}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Solicitações de Amizade</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {pending.length === 0 ? (
            <p>Nenhuma solicitação pendente.</p>
          ) : (
            pending.map((f) => (
              <div key={f.id} className="flex justify-between items-center">
                <span>{f.requesterName}</span>
                <Button onClick={() => acceptRequest(f.id)}>Aceitar</Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Maiores Cargas por Exercício</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc ml-4">
            {profile.maxWeightPerExercise.map((e) => (
              <li key={e.exerciseId}>
                {e.exerciseName}: {e.maxWeight} kg
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserProfile;
