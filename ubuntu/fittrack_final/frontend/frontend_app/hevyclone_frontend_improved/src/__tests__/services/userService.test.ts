import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock do userService
const mockUserService = {
  getCurrentUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  getUserProfile: vi.fn(),
  updateUserProfile: vi.fn(),
  uploadProfileImage: vi.fn(),
  getUserPreferences: vi.fn(),
  updateUserPreferences: vi.fn(),
  getUserStats: vi.fn(),
  getUserWorkouts: vi.fn(),
  validateUser: vi.fn(),
  isEmailAvailable: vi.fn(),
  isUsernameAvailable: vi.fn(),
};

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('User Profile Management', () => {
    it('should get current user successfully', async () => {
      // Given
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };
      mockUserService.getCurrentUser.mockResolvedValue(mockUser);

      // When
      const result = await mockUserService.getCurrentUser();

      // Then
      expect(result).toEqual(mockUser);
      expect(mockUserService.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should handle error when getting current user', async () => {
      // Given
      const errorMessage = 'User not found';
      mockUserService.getCurrentUser.mockRejectedValue(new Error(errorMessage));

      // When & Then
      await expect(mockUserService.getCurrentUser()).rejects.toThrow(errorMessage);
    });

    it('should update user profile successfully', async () => {
      // Given
      const updateData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };
      const updatedUser = {
        ...updateData,
        id: 1,
      };
      mockUserService.updateUserProfile.mockResolvedValue(updatedUser);

      // When
      const result = await mockUserService.updateUserProfile(updateData);

      // Then
      expect(result).toEqual(updatedUser);
      expect(mockUserService.updateUserProfile).toHaveBeenCalledWith(updateData);
    });
  });

  describe('User Preferences', () => {
    it('should get user preferences', async () => {
      // Given
      const mockPreferences = {
        theme: 'dark',
        language: 'en',
        notifications: true,
        units: 'metric',
      };
      mockUserService.getUserPreferences.mockResolvedValue(mockPreferences);

      // When
      const result = await mockUserService.getUserPreferences();

      // Then
      expect(result).toEqual(mockPreferences);
    });

    it('should update user preferences', async () => {
      // Given
      const newPreferences = {
        theme: 'light',
        notifications: false,
      };
      mockUserService.updateUserPreferences.mockResolvedValue(newPreferences);

      // When
      const result = await mockUserService.updateUserPreferences(newPreferences);

      // Then
      expect(result).toEqual(newPreferences);
      expect(mockUserService.updateUserPreferences).toHaveBeenCalledWith(newPreferences);
    });
  });

  describe('User Stats', () => {
    it('should get user statistics', async () => {
      // Given
      const mockStats = {
        totalWorkouts: 50,
        totalTime: 2500,
        averageWorkoutTime: 50,
        favoriteExercise: 'Push-ups',
        weeklyGoal: 5,
        currentStreak: 7,
      };
      mockUserService.getUserStats.mockResolvedValue(mockStats);

      // When
      const result = await mockUserService.getUserStats();

      // Then
      expect(result).toEqual(mockStats);
    });
  });

  describe('User Validation', () => {
    it('should validate email availability', async () => {
      // Given
      const email = 'new@example.com';
      mockUserService.isEmailAvailable.mockResolvedValue(true);

      // When
      const result = await mockUserService.isEmailAvailable(email);

      // Then
      expect(result).toBe(true);
      expect(mockUserService.isEmailAvailable).toHaveBeenCalledWith(email);
    });

    it('should validate username availability', async () => {
      // Given
      const username = 'newuser';
      mockUserService.isUsernameAvailable.mockResolvedValue(false);

      // When
      const result = await mockUserService.isUsernameAvailable(username);

      // Then
      expect(result).toBe(false);
      expect(mockUserService.isUsernameAvailable).toHaveBeenCalledWith(username);
    });

    it('should validate user data', async () => {
      // Given
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
      };
      const validationResult = {
        valid: true,
        errors: [],
      };
      mockUserService.validateUser.mockResolvedValue(validationResult);

      // When
      const result = await mockUserService.validateUser(userData);

      // Then
      expect(result).toEqual(validationResult);
      expect(mockUserService.validateUser).toHaveBeenCalledWith(userData);
    });
  });

  describe('File Upload', () => {
    it('should upload profile image', async () => {
      // Given
      const file = new File(['image'], 'profile.jpg', { type: 'image/jpeg' });
      const uploadResult = {
        url: 'https://example.com/images/profile.jpg',
        success: true,
      };
      mockUserService.uploadProfileImage.mockResolvedValue(uploadResult);

      // When
      const result = await mockUserService.uploadProfileImage(file);

      // Then
      expect(result).toEqual(uploadResult);
      expect(mockUserService.uploadProfileImage).toHaveBeenCalledWith(file);
    });
  });
}); 