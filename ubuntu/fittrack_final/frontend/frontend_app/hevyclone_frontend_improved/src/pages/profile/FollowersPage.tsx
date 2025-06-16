import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useProfile } from '../../context/ProfileContext';

const FollowersPage: React.FC = () => {
  const { followersList, updateFollowingStatus, removeFollower } = useProfile();
  const [loading, setLoading] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const handleFollowToggle = async (userId: number) => {
    setLoading(true);
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const follower = followersList.find(f => f.id === userId);
      if (follower) {
        const newFollowing = !follower.isFollowing;
        console.log('Alterando seguimento de', follower.name, 'para:', newFollowing);
        updateFollowingStatus(userId, newFollowing);
      }
    } catch (error) {
    console.error('Erro ao alterar seguimento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFollower = async (userId: number) => {
    setLoading(true);
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Removendo seguidor ID:', userId);
      removeFollower(userId);
    } catch (error) {
    console.error('Erro ao remover seguidor:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link 
          to="/profile" 
          className="mr-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Seguidores</h1>
      </div>

      {/* Followers List */}
      <div className="space-y-4">
        {followersList.map((follower) => (
          <div key={follower.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  {follower.profileImage ? (
                    <img 
                      src={follower.profileImage} 
                      alt={follower.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {getInitials(follower.name)}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <Link 
                    to={`/profile/${follower.username}`}
                    className="font-semibold text-white hover:text-primary transition-colors"
                  >
                    {follower.name}
                  </Link>
                  <div className="text-gray-400 text-sm">@{follower.username}</div>
                  <div className="text-gray-500 text-xs">{follower.workoutCount} workouts</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleFollowToggle(follower.id)}
                  disabled={loading}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    follower.isFollowing
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {loading ? '...' : follower.isFollowing ? 'Seguindo' : 'Seguir'}
                </button>
                
                <button
                  onClick={() => handleRemoveFollower(follower.id)}
                  disabled={loading}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  {loading ? '...' : 'Remover'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {followersList.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">Nenhum seguidor ainda</div>
          <div className="text-gray-500 text-sm">
            Quando alguém te seguir, aparecerá aqui
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowersPage; 