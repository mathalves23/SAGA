import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useProfile } from '../../context/ProfileContext';

const FollowingPage: React.FC = () => {
  const { followingList, unfollowUser } = useProfile();
  const [loading, setLoading] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const handleUnfollow = async (userId: number) => {
    setLoading(true);
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Deixando de seguir usuário ID:', userId);
      unfollowUser(userId);
    } catch (error) {
    console.error('Erro ao deixar de seguir:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric'
    });
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
        <h1 className="text-2xl font-bold text-white">Seguindo</h1>
      </div>

      {/* Following List */}
      <div className="space-y-4">
        {followingList.map((user) => (
          <div key={user.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {getInitials(user.name)}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <Link 
                    to={`/profile/${user.username}`}
                    className="font-semibold text-white hover:text-primary transition-colors"
                  >
                    {user.name}
                  </Link>
                  <div className="text-gray-400 text-sm">@{user.username}</div>
                  <div className="text-gray-500 text-xs">
                    {user.workoutCount} workouts
                    {user.followedSince && ` • Seguindo desde ${formatDate(user.followedSince)}`}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleUnfollow(user.id)}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                {loading ? '...' : 'Seguindo'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {followingList.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">Você não está seguindo ninguém</div>
          <div className="text-gray-500 text-sm mb-4">
            Explore outros perfis e comece a seguir pessoas!
          </div>
          <Link 
            to="/feed" 
            className="btn btn-primary"
          >
            Explorar Feed
          </Link>
        </div>
      )}
    </div>
  );
};

export default FollowingPage; 