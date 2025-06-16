import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../services/authService';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals: string[];
  joinDate: string;
  achievements: number;
  totalWorkouts: number;
  totalDistance: number;
  totalCaloriesBurned: number;
}

interface UserPreferences {
  notifications: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  darkMode: boolean;
  units: 'metric' | 'imperial';
  privacy: {
    showProgress: boolean;
    showWorkouts: boolean;
    allowFriendRequests: boolean;
  };
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    loadUserProfile();
    loadUserPreferences();
  }, []);

  const loadUserProfile = async () => {
    try {
      // Load from AsyncStorage or API
      const mockProfile: UserProfile = {
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@email.com',
        bio: 'Fitness enthusiast | Marathon runner | Healthy lifestyle advocate',
        age: 28,
        height: 175,
        weight: 75.5,
        targetWeight: 70,
        activityLevel: 'active',
        goals: ['Lose Weight', 'Build Muscle', 'Improve Endurance'],
        joinDate: '2023-01-15',
        achievements: 47,
        totalWorkouts: 156,
        totalDistance: 2847.3,
        totalCaloriesBurned: 89420,
      };

      setUserProfile(mockProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadUserPreferences = async () => {
    try {
      const mockPreferences: UserPreferences = {
        notifications: true,
        pushNotifications: true,
        emailNotifications: false,
        darkMode: false,
        units: 'metric',
        privacy: {
          showProgress: true,
          showWorkouts: true,
          allowFriendRequests: true,
        },
      };

      setPreferences(mockPreferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const handleEditProfile = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
    setEditModalVisible(true);
  };

  const saveProfileEdit = async () => {
    if (!userProfile) return;

    try {
      const updatedProfile = { ...userProfile };
      
      switch (editingField) {
        case 'name':
          updatedProfile.name = editValue;
          break;
        case 'bio':
          updatedProfile.bio = editValue;
          break;
        case 'weight':
          updatedProfile.weight = parseFloat(editValue);
          break;
        case 'targetWeight':
          updatedProfile.targetWeight = parseFloat(editValue);
          break;
        case 'height':
          updatedProfile.height = parseFloat(editValue);
          break;
      }

      setUserProfile(updatedProfile);
      // Save to AsyncStorage or API
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const updatePreference = async (key: keyof UserPreferences, value: any) => {
    if (!preferences) return;

    try {
      const updatedPreferences = { ...preferences, [key]: value };
      setPreferences(updatedPreferences);
      await AsyncStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
    } catch (error) {
      console.error('Error updating preference:', error);
    }
  };

  const updatePrivacySetting = async (key: keyof UserPreferences['privacy'], value: boolean) => {
    if (!preferences) return;

    try {
      const updatedPreferences = {
        ...preferences,
        privacy: { ...preferences.privacy, [key]: value },
      };
      setPreferences(updatedPreferences);
      await AsyncStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
    } catch (error) {
      console.error('Error updating privacy setting:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            // Navigation will be handled by auth state change
          },
        },
      ]
    );
  };

  const getActivityLevelLabel = (level: string) => {
    switch (level) {
      case 'sedentary':
        return 'Sedentary';
      case 'light':
        return 'Lightly Active';
      case 'moderate':
        return 'Moderately Active';
      case 'active':
        return 'Active';
      case 'very_active':
        return 'Very Active';
      default:
        return 'Unknown';
    }
  };

  const renderStatsCard = (title: string, value: string, icon: string, color: string) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={20} color={colors.white} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const renderSettingItem = (
    title: string,
    subtitle?: string,
    rightElement?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  const renderEditModal = () => (
    <Modal visible={editModalVisible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setEditModalVisible(false)}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit {editingField}</Text>
          <TouchableOpacity onPress={saveProfileEdit}>
            <Text style={styles.modalSave}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <TextInput
            style={styles.editInput}
            value={editValue}
            onChangeText={setEditValue}
            placeholder={`Enter ${editingField}`}
            multiline={editingField === 'bio'}
            keyboardType={
              editingField === 'weight' || editingField === 'targetWeight' || editingField === 'height'
                ? 'numeric'
                : 'default'
            }
          />
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderSettingsModal = () => (
    <Modal visible={settingsModalVisible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
            <Text style={styles.modalCancel}>Done</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Settings</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Notifications */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {renderSettingItem(
              'Push Notifications',
              'Receive workout reminders and updates',
              <Switch
                value={preferences?.pushNotifications}
                onValueChange={(value) => updatePreference('pushNotifications', value)}
              />
            )}
            {renderSettingItem(
              'Email Notifications',
              'Receive weekly progress reports',
              <Switch
                value={preferences?.emailNotifications}
                onValueChange={(value) => updatePreference('emailNotifications', value)}
              />
            )}
          </View>

          {/* Privacy */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>Privacy</Text>
            {renderSettingItem(
              'Show Progress',
              'Allow others to see your progress',
              <Switch
                value={preferences?.privacy.showProgress}
                onValueChange={(value) => updatePrivacySetting('showProgress', value)}
              />
            )}
            {renderSettingItem(
              'Show Workouts',
              'Allow others to see your workouts',
              <Switch
                value={preferences?.privacy.showWorkouts}
                onValueChange={(value) => updatePrivacySetting('showWorkouts', value)}
              />
            )}
            {renderSettingItem(
              'Friend Requests',
              'Allow others to send friend requests',
              <Switch
                value={preferences?.privacy.allowFriendRequests}
                onValueChange={(value) => updatePrivacySetting('allowFriendRequests', value)}
              />
            )}
          </View>

          {/* App Settings */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            {renderSettingItem(
              'Units',
              preferences?.units === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lbs, ft)',
              undefined,
              () => updatePreference('units', preferences?.units === 'metric' ? 'imperial' : 'metric')
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  if (!userProfile || !preferences) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setSettingsModalVisible(true)}
        >
          <Ionicons name="settings-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: userProfile.avatar || 'https://via.placeholder.com/100x100/007AFF/FFFFFF?text=JS',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <TouchableOpacity
              style={styles.editableField}
              onPress={() => handleEditProfile('name', userProfile.name)}
            >
              <Text style={styles.userName}>{userProfile.name}</Text>
              <Ionicons name="pencil" size={16} color={colors.textSecondary} />
            </TouchableOpacity>

            <Text style={styles.userEmail}>{userProfile.email}</Text>

            <TouchableOpacity
              style={styles.editableField}
              onPress={() => handleEditProfile('bio', userProfile.bio || '')}
            >
              <Text style={styles.userBio}>{userProfile.bio || 'Add a bio...'}</Text>
              <Ionicons name="pencil" size={14} color={colors.textSecondary} />
            </TouchableOpacity>

            <Text style={styles.joinDate}>
              Member since {new Date(userProfile.joinDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {renderStatsCard('Workouts', userProfile.totalWorkouts.toString(), 'fitness', colors.primary)}
          {renderStatsCard('Achievements', userProfile.achievements.toString(), 'trophy', colors.warning)}
          {renderStatsCard('Distance', `${userProfile.totalDistance.toFixed(1)}km`, 'location', colors.success)}
          {renderStatsCard('Calories', `${userProfile.totalCaloriesBurned.toLocaleString()}`, 'flame', colors.error)}
        </View>

        {/* Physical Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Stats</Text>
          <View style={styles.physicalStats}>
            <View style={styles.physicalStatRow}>
              <Text style={styles.physicalStatLabel}>Current Weight</Text>
              <TouchableOpacity
                style={styles.physicalStatValue}
                onPress={() => handleEditProfile('weight', userProfile.weight.toString())}
              >
                <Text style={styles.physicalStatText}>
                  {userProfile.weight}kg
                </Text>
                <Ionicons name="pencil" size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.physicalStatRow}>
              <Text style={styles.physicalStatLabel}>Target Weight</Text>
              <TouchableOpacity
                style={styles.physicalStatValue}
                onPress={() => handleEditProfile('targetWeight', userProfile.targetWeight.toString())}
              >
                <Text style={styles.physicalStatText}>
                  {userProfile.targetWeight}kg
                </Text>
                <Ionicons name="pencil" size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.physicalStatRow}>
              <Text style={styles.physicalStatLabel}>Height</Text>
              <TouchableOpacity
                style={styles.physicalStatValue}
                onPress={() => handleEditProfile('height', userProfile.height.toString())}
              >
                <Text style={styles.physicalStatText}>
                  {userProfile.height}cm
                </Text>
                <Ionicons name="pencil" size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.physicalStatRow}>
              <Text style={styles.physicalStatLabel}>Age</Text>
              <Text style={styles.physicalStatText}>{userProfile.age} years</Text>
            </View>

            <View style={styles.physicalStatRow}>
              <Text style={styles.physicalStatLabel}>Activity Level</Text>
              <Text style={styles.physicalStatText}>
                {getActivityLevelLabel(userProfile.activityLevel)}
              </Text>
            </View>
          </View>
        </View>

        {/* Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals</Text>
          <View style={styles.goalsContainer}>
            {userProfile.goals.map((goal, index) => (
              <View key={index} style={styles.goalChip}>
                <Text style={styles.goalText}>{goal}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color={colors.primary} />
              <Text style={styles.actionText}>Share Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="download-outline" size={20} color={colors.primary} />
              <Text style={styles.actionText}>Export Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.actionText}>Help & Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {renderEditModal()}
      {renderSettingsModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  settingsButton: {
    padding: spacing.sm,
    borderRadius: 25,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  profileHeader: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  editableField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  userBio: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginRight: spacing.sm,
    maxWidth: 250,
  },
  joinDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  physicalStats: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
  },
  physicalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  physicalStatLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  physicalStatValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  physicalStatText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
  },
  goalChip: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  goalText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '500',
  },
  quickActions: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modalCancel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  modalSave: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: spacing.md,
  },
  editInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  settingSection: {
    marginBottom: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default ProfileScreen; 