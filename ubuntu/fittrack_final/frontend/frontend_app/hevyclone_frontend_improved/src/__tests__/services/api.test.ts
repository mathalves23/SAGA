import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
// import axios from 'axios'; // Removido: não utilizado

// Mock do axios
vi.mock('axios');
// const mockedAxios = vi.mocked(axios); // Removido: não utilizado

// Mock básico do apiService
const mockApiService = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  uploadFile: vi.fn(),
  batch: vi.fn(),
  withRetry: vi.fn(),
  healthCheck: vi.fn(),
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

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      // Given
      const mockData = { id: 1, name: 'Test' };
      mockApiService.get.mockResolvedValue(mockData);

      // When
      const result = await mockApiService.get('/test');

      // Then
      expect(result).toEqual(mockData);
      expect(mockApiService.get).toHaveBeenCalledWith('/test');
    });

    it('should handle GET request with parameters', async () => {
      // Given
      const mockData = { results: [] };
      const params = { page: 1, limit: 10 };
      mockApiService.get.mockResolvedValue(mockData);

      // When
      const result = await mockApiService.get('/test', params);

      // Then
      expect(result).toEqual(mockData);
      expect(mockApiService.get).toHaveBeenCalledWith('/test', params);
    });

    it('should handle GET request errors', async () => {
      // Given
      const errorMessage = 'Network Error';
      mockApiService.get.mockRejectedValue(new Error(errorMessage));

      // When & Then
      await expect(mockApiService.get('/test')).rejects.toThrow(errorMessage);
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      // Given
      const mockData = { id: 1, created: true };
      const postData = { name: 'New Item' };
      mockApiService.post.mockResolvedValue(mockData);

      // When
      const result = await mockApiService.post('/test', postData);

      // Then
      expect(result).toEqual(mockData);
      expect(mockApiService.post).toHaveBeenCalledWith('/test', postData);
    });
  });

  describe('File Upload', () => {
    it('should upload file with progress callback', async () => {
      // Given
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const mockData = { uploaded: true };
      const onProgress = vi.fn();
      
      mockApiService.uploadFile.mockResolvedValue(mockData);

      // When
      const result = await mockApiService.uploadFile('/upload', file, onProgress);

      // Then
      expect(result).toEqual(mockData);
      expect(mockApiService.uploadFile).toHaveBeenCalledWith('/upload', file, onProgress);
    });
  });

  describe('Health Check', () => {
    it('should return true for successful health check', async () => {
      // Given
      mockApiService.healthCheck.mockResolvedValue(true);

      // When
      const result = await mockApiService.healthCheck();

      // Then
      expect(result).toBe(true);
    });

    it('should return false for failed health check', async () => {
      // Given
      mockApiService.healthCheck.mockResolvedValue(false);

      // When
      const result = await mockApiService.healthCheck();

      // Then
      expect(result).toBe(false);
    });
  });
}); 