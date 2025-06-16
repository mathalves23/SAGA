import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator();

// Componente customizado para ícone de tab com animação
const TabIcon: React.FC<{
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
  label: string;
}> = ({ name, color, size, focused, label }) => {
  const scale = useSharedValue(focused ? 1 : 0.8);
  const translateY = useSharedValue(focused ? -2 : 0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 0.9, {
      damping: 15,
      stiffness: 150,
    });
    translateY.value = withSpring(focused ? -3 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [focused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scale.value, [0.9, 1.1], [0.6, 1]),
    transform: [{ scale: interpolate(scale.value, [0.9, 1.1], [0.85, 0.95]) }],
  }));

  return (
    <View style={{ alignItems: 'center', minHeight: 50, justifyContent: 'center' }}>
      <Animated.View style={animatedIconStyle}>
        <Ionicons 
          name={name} 
          size={size} 
          color={color}
        />
      </Animated.View>
      <Animated.Text 
        style={[
          animatedTextStyle,
          {
            fontSize: 11,
            fontWeight: focused ? '600' : '400',
            color: color,
            marginTop: 2,
          }
        ]}
      >
        {label}
      </Animated.Text>
      
      {/* Indicador de foco */}
      {focused && (
        <Animated.View
          style={{
            position: 'absolute',
            top: -8,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: color,
          }}
        />
      )}
    </View>
  );
};

// Tab bar customizada com blur effect
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }}>
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={{
          flexDirection: 'row',
          paddingBottom: Platform.OS === 'ios' ? 34 : 20,
          paddingTop: 12,
          paddingHorizontal: 20,
          backgroundColor: isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          borderTopWidth: 1,
          borderTopColor: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)',
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined 
            ? options.tabBarLabel 
            : options.title !== undefined 
            ? options.title 
            : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Configuração de ícones para cada tela
          const getTabIcon = (routeName: string, focused: boolean) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';
            
            switch (routeName) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Exercises':
                iconName = focused ? 'fitness' : 'fitness-outline';
                break;
              case 'Workout':
                iconName = focused ? 'barbell' : 'barbell-outline';
                break;
              case 'Progress':
                iconName = focused ? 'trending-up' : 'trending-up-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person-circle' : 'person-circle-outline';
                break;
            }
            
            return iconName;
          };

          return (
            <Animated.View
              key={route.key}
              style={{
                flex: 1,
                alignItems: 'center',
              }}
            >
              <Animated.Pressable
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 16,
                  minWidth: 60,
                  ...(isFocused && {
                    backgroundColor: colors.primary + '15',
                  })
                }}
              >
                <TabIcon
                  name={getTabIcon(route.name, isFocused)}
                  color={isFocused ? colors.primary : colors.textSecondary}
                  size={24}
                  focused={isFocused}
                  label={label}
                />
              </Animated.Pressable>
            </Animated.View>
          );
        })}
      </BlurView>
    </View>
  );
};

const TabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
        }}
      />
      
      <Tab.Screen 
        name="Exercises" 
        component={ExercisesScreen}
        options={{
          tabBarLabel: 'Exercícios',
        }}
      />
      
      <Tab.Screen 
        name="Workout" 
        component={WorkoutScreen}
        options={{
          tabBarLabel: 'Treino',
        }}
      />
      
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progresso',
        }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator; 