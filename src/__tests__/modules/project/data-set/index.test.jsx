// src/__tests__/DataSet.test.jsx
/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DataSet from '@/modules/project/data-set';
import axiosInstance from '@/core/request/aixosinstance';
import { RecoilRoot } from 'recoil';
import toast from 'react-hot-toast';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock the necessary modules and components
jest.mock('@/core/request/aixosinstance', () => ({
  get: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('react-hot-toast');

describe('DataSet Component', () => {
  const mockGet = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    axiosInstance.get = mockGet;
    axiosInstance.delete = mockDelete;
    toast.error = jest.fn();
  });

  test('renders the component and fetches folders', async () => {
    const mockFolders = [{ id: '1', name: 'Folder 1' }, { id: '2', name: 'Folder 2' }];
    mockGet.mockResolvedValueOnce({ data: { data: mockFolders } });

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[{ pathname: '/project/1/variant/1/camera-position/1/camera-config/1', state: { projectName: 'Project 1', variantName: 'Variant 1', cameraPositionName: 'Camera Position 1', cameraConfigName: 'Config 1' } }]}
        >
          <Routes>
            <Route path="/project/:projectId/variant/:variantId/camera-position/:cameraPositionId/camera-config/:cameraConfigId" element={<DataSet />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    // Check if the API call is made and folders are rendered
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/dataset/folders', {
        params: { cameraConfigId: '1' },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Folder 1')).toBeInTheDocument;
      expect(screen.getByText('Folder 2')).toBeInTheDocument;
    })
  });

  test('opens Add Folder modal when "Create Folder" is clicked', async () => {
    const mockFolders = [{ id: '1', name: 'Folder 1' }, { id: '2', name: 'Folder 2' }];
    mockGet.mockResolvedValueOnce({ data: { data: mockFolders } });

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[{ pathname: '/project/1/variant/1/camera-position/1/camera-config/1', state: { projectName: 'Project 1', variantName: 'Variant 1', cameraPositionName: 'Camera Position 1', cameraConfigName: 'Config 1' } }]}
        >
          <Routes>
            <Route path="/project/:projectId/variant/:variantId/camera-position/:cameraPositionId/camera-config/:cameraConfigId" element={<DataSet />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/dataset/folders', {
        params: { cameraConfigId: '1' },
      });
    });

    fireEvent.click(screen.getByText('Create Folder'));

    expect(screen.getByText('Create Dataset Folder')).toBeInTheDocument;
  });

  test('handles folder deletion and fetches updated folders', async () => {
    const mockFolders = [{ id: '1', name: 'Folder 1' }];
    mockGet.mockResolvedValueOnce({ data: { data: mockFolders } });
    mockDelete.mockResolvedValueOnce({});

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[{ pathname: '/project/1/variant/1/camera-position/1/camera-config/1', state: { projectName: 'Project 1', variantName: 'Variant 1', cameraPositionName: 'Camera Position 1', cameraConfigName: 'Config 1' } }]}
        >
          <Routes>
            <Route path="/project/:projectId/variant/:variantId/camera-position/:cameraPositionId/camera-config/:cameraConfigId" element={<DataSet />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(screen.getByText('Folder 1')).toBeInTheDocument;
    });

    fireEvent.click(screen.getByRole('img', { name: 'More Options' })); // Open options for folder
    fireEvent.click(screen.getByText('Delete')); // Click delete

    fireEvent.click(screen.getByText('Delete')); // Confirm delete

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/dataset', {
        params: { id: '1' },
      });
    });

    // Ensure folders are refetched after deletion
    expect(mockGet).toHaveBeenCalled();
  });

  test('shows error message on folder deletion failure', async () => {
    mockDelete.mockRejectedValueOnce({
      response: { data: { data: { message: 'Error deleting folder' } } },
    });

    const mockFolders = [{ id: '1', name: 'Folder 1' }];
    mockGet.mockResolvedValueOnce({ data: { data: mockFolders } });

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[{ pathname: '/project/1/variant/1/camera-position/1/camera-config/1', state: { projectName: 'Project 1', variantName: 'Variant 1', cameraPositionName: 'Camera Position 1', cameraConfigName: 'Config 1' } }]}
        >
          <Routes>
            <Route path="/project/:projectId/variant/:variantId/camera-position/:cameraPositionId/camera-config/:cameraConfigId" element={<DataSet />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(screen.getByText('Folder 1')).toBeInTheDocument;
    });

    fireEvent.click(screen.getByRole('img', { name: 'More Options' }));
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error deleting folder');
    });
  });
});
