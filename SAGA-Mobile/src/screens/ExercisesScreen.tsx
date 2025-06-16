import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { exerciseService } from '../services/exerciseService';
import { Exercise } from '../types';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 48) / 2;

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onPress: (exercise: Exercise) => void;
  onFavorite: (exercise: Exercise) => void;
  isFavorite: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  index, 
  onPress, 
  onFavorite, 
  isFavorite 
}) => {
  const { colors } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return '#10B981';
      case 2: return '#F59E0B';
      case 3: return '#EF4444';
      case 4: return '#8B5CF6';
      case 5: return '#DC2626';
      default: return colors.text;
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Iniciante';
      case 2: return 'Intermediário';
      case 3: return 'Avançado';
      case 4: return 'Expert';
      case 5: return 'Profissional';
      default: return 'N/A';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(exercise)}
      activeOpacity={0.8}
      style={{
        width: cardWidth,
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: colors.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
      }}
    >
      <View style={{ height: 120, position: 'relative' }}>
        {!imageLoaded && !imageError && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.primary + '20',
          }}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
        
        {exercise.imageUrl && (
          <Image
            source={{ uri: exercise.imageUrl }}
            style={{
              width: '100%',
              height: '100%',
              opacity: imageLoaded ? 1 : 0,
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
          }}
        />

        <TouchableOpacity
          onPress={() => onFavorite(exercise)}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? '#EF4444' : 'white'}
          />
        </TouchableOpacity>

        <View style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          backgroundColor: getDifficultyColor(exercise.difficulty),
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}>
          <Text style={{
            fontSize: 10,
            fontWeight: '600',
            color: 'white',
          }}>
            {getDifficultyText(exercise.difficulty)}
          </Text>
        </View>
      </View>

      <View style={{ padding: 12 }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 4,
        }}>
          {exercise.name}
        </Text>
        
        <Text style={{
          fontSize: 11,
          color: colors.textSecondary,
          marginBottom: 6,
        }}>
          {exercise.muscleGroups[0] || 'Múltiplos'}
        </Text>

        <Text style={{
          fontSize: 10,
          color: colors.textSecondary,
          lineHeight: 14,
        }}>
          {exercise.description.length > 60 
            ? exercise.description.substring(0, 60) + '...'
            : exercise.description
          }
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ExercisesScreen: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadExercises();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchQuery, selectedCategory]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await exerciseService.getExercises();
      setExercises(data);
      
      const cats = await exerciseService.getCategories();
      setCategories(['Todos', ...cats]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os exercícios');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem(`favorites_${user?.id}`);
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const saveFavorites = async (newFavorites: Set<string>) => {
    try {
      await AsyncStorage.setItem(
        `favorites_${user?.id}`,
        JSON.stringify(Array.from(newFavorites))
      );
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (searchQuery) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscleGroups.some(group => 
          group.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(exercise => 
        exercise.category === selectedCategory
      );
    }

    setFilteredExercises(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadExercises();
    setRefreshing(false);
  };

  const handleFavorite = (exercise: Exercise) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(exercise.id)) {
      newFavorites.delete(exercise.id);
    } else {
      newFavorites.add(exercise.id);
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const handleExercisePress = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16, color: colors.text }}>
          Carregando exercícios...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header com busca */}
      <View style={{ padding: 16 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: 12,
          paddingHorizontal: 16,
          marginBottom: 16,
        }}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.text,
            }}
            placeholder="Buscar exercícios..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categorias */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
        >
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={{
                  backgroundColor: selectedCategory === category 
                    ? colors.primary 
                    : colors.surface,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}
              >
                <Text style={{
                  color: selectedCategory === category 
                    ? 'white' 
                    : colors.text,
                  fontWeight: selectedCategory === category ? '600' : '400',
                }}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Lista de exercícios */}
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
        }}>
          {filteredExercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={index}
              onPress={handleExercisePress}
              onFavorite={handleFavorite}
              isFavorite={favorites.has(exercise.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Modal de detalhes */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          {selectedExercise && (
            <>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.text,
                  flex: 1,
                  textAlign: 'center',
                  marginHorizontal: 16,
                }}>
                  {selectedExercise.name}
                </Text>

                <TouchableOpacity onPress={() => handleFavorite(selectedExercise)}>
                  <Ionicons
                    name={favorites.has(selectedExercise.id) ? 'heart' : 'heart-outline'}
                    size={24}
                    color={favorites.has(selectedExercise.id) ? '#EF4444' : colors.text}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ flex: 1, padding: 20 }}>
                {selectedExercise.imageUrl && (
                  <Image
                    source={{ uri: selectedExercise.imageUrl }}
                    style={{
                      width: '100%',
                      height: 200,
                      borderRadius: 12,
                      marginBottom: 20,
                    }}
                    resizeMode="cover"
                  />
                )}

                <Text style={{
                  fontSize: 16,
                  color: colors.text,
                  lineHeight: 24,
                  marginBottom: 20,
                }}>
                  {selectedExercise.description}
                </Text>

                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 12,
                }}>
                  Instruções:
                </Text>

                {selectedExercise.instructions.map((instruction, index) => (
                  <View key={index} style={{
                    flexDirection: 'row',
                    marginBottom: 8,
                    alignItems: 'flex-start',
                  }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: colors.primary,
                      marginRight: 8,
                      marginTop: 2,
                    }}>
                      {index + 1}.
                    </Text>
                    <Text style={{
                      fontSize: 16,
                      color: colors.text,
                      lineHeight: 24,
                      flex: 1,
                    }}>
                      {instruction}
                    </Text>
                  </View>
                ))}

                <View style={{
                  marginTop: 20,
                  padding: 16,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 8,
                  }}>
                    Informações do Exercício:
                  </Text>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: colors.textSecondary }}>Categoria:</Text>
                    <Text style={{ color: colors.text, fontWeight: '500' }}>{selectedExercise.category}</Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: colors.textSecondary }}>Grupos Musculares:</Text>
                    <Text style={{ color: colors.text, fontWeight: '500' }}>
                      {selectedExercise.muscleGroups.join(', ')}
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: colors.textSecondary }}>Equipamentos:</Text>
                    <Text style={{ color: colors.text, fontWeight: '500' }}>
                      {selectedExercise.equipment?.join(', ') || 'Nenhum'}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ExercisesScreen; 