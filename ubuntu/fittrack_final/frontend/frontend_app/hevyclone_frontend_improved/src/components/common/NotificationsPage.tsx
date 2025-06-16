// src/pages/NotificationsPage.tsx

import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface Notification {
  id: number;
  message: string;
  type: "LIKE" | "COMMENT" | "ACHIEVEMENT" | "PR";
  createdAt: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const response = await api.get<Notification[]>(`/notifications/${user.id}`);
        setNotifications(response as Notification[]);
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="text-white p-4">
        🔄 Carregando notificações...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">🔔 Notificações</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-400">Você não tem notificações.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="border border-gray-700 p-3 rounded-md bg-[#1C1C1E] text-white"
            >
              <div className="text-sm">{n.message}</div>
              <div className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString("pt-BR")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
