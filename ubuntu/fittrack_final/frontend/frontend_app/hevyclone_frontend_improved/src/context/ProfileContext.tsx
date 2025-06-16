import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type ProfileStats = {
  totalWorkouts: number;
  followers: number;
  following: number;
};

type User = {
  id: number;
  username: string;
  name: string;
  profileImage?: string;
  workoutCount: number;
  followedSince?: string;
  isFollowing?: boolean;
};

type ProfileContextType = {
  profileStats: ProfileStats;
  followersList: User[];
  followingList: User[];
  followUser: (user: User) => void;
  unfollowUser: (userId: number) => void;
  removeFollower: (userId: number) => void;
  updateFollowingStatus: (userId: number, isFollowing: boolean) => void;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  // Lista inicial de seguidores
  const [followersList, setFollowersList] = useState<User[]>([
    {
      id: 1,
      username: 'joao_silva',
      name: 'João Silva',
      profileImage: '',
      isFollowing: true,
      workoutCount: 342
    },
    {
      id: 2,
      username: 'maria_fitness',
      name: 'Maria Santos',
      profileImage: '',
      isFollowing: false,
      workoutCount: 158
    },
    {
      id: 3,
      username: 'carlos_gym',
      name: 'Carlos Oliveira',
      profileImage: '',
      isFollowing: true,
      workoutCount: 523
    },
    {
      id: 4,
      username: 'ana_workout',
      name: 'Ana Costa',
      profileImage: '',
      isFollowing: false,
      workoutCount: 276
    },
    {
      id: 5,
      username: 'felipe_strong',
      name: 'Felipe Santos',
      profileImage: '',
      isFollowing: true,
      workoutCount: 189
    },
    {
      id: 6,
      username: 'julia_fit',
      name: 'Julia Oliveira',
      profileImage: '',
      isFollowing: false,
      workoutCount: 234
    },
    {
      id: 7,
      username: 'rodrigo_gym',
      name: 'Rodrigo Lima',
      profileImage: '',
      isFollowing: true,
      workoutCount: 445
    },
    {
      id: 8,
      username: 'carla_health',
      name: 'Carla Mendes',
      profileImage: '',
      isFollowing: false,
      workoutCount: 167
    }
  ]);

  // Lista inicial de pessoas que sigo
  const [followingList, setFollowingList] = useState<User[]>([
    {
      id: 101,
      username: 'pedro_strong',
      name: 'Pedro Almeida',
      profileImage: '',
      workoutCount: 689,
      followedSince: '2024-01-15'
    },
    {
      id: 102,
      username: 'lucia_fitness',
      name: 'Lúcia Fernandes',
      profileImage: '',
      workoutCount: 421,
      followedSince: '2024-03-22'
    },
    {
      id: 103,
      username: 'rafael_gym',
      name: 'Rafael Torres',
      profileImage: '',
      workoutCount: 356,
      followedSince: '2024-05-10'
    },
    {
      id: 104,
      username: 'beatriz_health',
      name: 'Beatriz Lima',
      profileImage: '',
      workoutCount: 203,
      followedSince: '2024-04-18'
    },
    {
      id: 1, // João Silva (também está na lista de seguidores)
      username: 'joao_silva',
      name: 'João Silva',
      profileImage: '',
      workoutCount: 342,
      followedSince: '2024-02-10'
    },
    {
      id: 3, // Carlos Oliveira (também está na lista de seguidores)
      username: 'carlos_gym',
      name: 'Carlos Oliveira',
      profileImage: '',
      workoutCount: 523,
      followedSince: '2024-01-20'
    },
    {
      id: 5, // Felipe Santos (também está na lista de seguidores)
      username: 'felipe_strong',
      name: 'Felipe Santos',
      profileImage: '',
      workoutCount: 189,
      followedSince: '2024-03-15'
    },
    {
      id: 7, // Rodrigo Lima (também está na lista de seguidores)
      username: 'rodrigo_gym',
      name: 'Rodrigo Lima',
      profileImage: '',
      workoutCount: 445,
      followedSince: '2024-04-02'
    }
  ]);

  // Calcular estatísticas baseadas nas listas
  const [profileStats, setProfileStats] = useState<ProfileStats>(() => {
    const saved = localStorage.getItem('profileStats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('Carregando profileStats do localStorage:', parsed);
        return parsed;
      } catch (error) {
    console.error('Erro ao carregar dados do perfil:', error);
      }
    }
    const defaultStats = {
      totalWorkouts: 487,
      followers: 8, // baseado na lista de seguidores
      following: 8  // baseado na lista de seguindo
    };
    console.log('Usando profileStats padrão:', defaultStats);
    return defaultStats;
  });

  // Salvar no localStorage sempre que os dados mudarem
  useEffect(() => {
    console.log('Salvando profileStats no localStorage:', profileStats);
    localStorage.setItem('profileStats', JSON.stringify(profileStats));
  }, [profileStats]);

  // Atualizar contadores baseados nas listas
  useEffect(() => {
    setProfileStats(prev => ({
      ...prev,
      followers: followersList.length,
      following: followingList.length
    }));
  }, [followersList.length, followingList.length]);

  const followUser = useCallback((user: User) => {
    console.log('Seguindo usuário:', user.name);
    
    // Adicionar à lista de seguindo se não estiver lá
    setFollowingList(prev => {
      const exists = prev.find(u => u.id === user.id);
      if (!exists) {
        const newUser = {
          ...user,
          followedSince: new Date().toISOString().split('T')[0]
        };
        return [...prev, newUser];
      }
      return prev;
    });

    // Atualizar status na lista de seguidores
    setFollowersList(prev => prev.map(follower => 
      follower.id === user.id 
        ? { ...follower, isFollowing: true }
        : follower
    ));
  }, []);

  const unfollowUser = useCallback((userId: number) => {
    console.log('Deixando de seguir usuário ID:', userId);
    
    // Remover da lista de seguindo
    setFollowingList(prev => prev.filter(user => user.id !== userId));

    // Atualizar status na lista de seguidores
    setFollowersList(prev => prev.map(follower => 
      follower.id === userId 
        ? { ...follower, isFollowing: false }
        : follower
    ));
  }, []);

  const removeFollower = useCallback((userId: number) => {
    console.log('Removendo seguidor ID:', userId);
    
    // Remover da lista de seguidores
    setFollowersList(prev => prev.filter(follower => follower.id !== userId));
  }, []);

  const updateFollowingStatus = useCallback((userId: number, isFollowing: boolean) => {
    if (isFollowing) {
      const user = followersList.find(f => f.id === userId);
      if (user) {
        followUser(user);
      }
    } else {
      unfollowUser(userId);
    }
  }, [followersList, followUser, unfollowUser]);

  return (
    <ProfileContext.Provider
      value={{
        profileStats,
        followersList,
        followingList,
        followUser,
        unfollowUser,
        removeFollower,
        updateFollowingStatus
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile precisa estar dentro de <ProfileProvider>');
  }
  return context;
};

export type { ProfileStats, ProfileContextType, User }; 