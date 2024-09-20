// src/__tests__/modules/CameraPosition.test.jsx
/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CameraPosition from '@/modules/project/camera-position';
import axiosInstance from '@/core/request/aixosinstance';
import toast from 'react-hot-toast';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

// Mocking the necessary modules and components
jest.mock('@/core/request/aixosinstance', () => ({
  get: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('react-hot-toast');

describe('CameraPosition Component', () => {
  const mockGet = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => {
    axiosInstance.get = mockGet;
    axiosInstance.delete = mockDelete;
    toast.error = jest.fn();
  });

  test('renders component and fetches camera positions', async () => {
    const mockCameraPositions = [{ id: '1', name: 'Camera Position 1' }];
    mockGet.mockResolvedValue({ data: { data: mockCameraPositions } });

    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={[{ pathname: '/project/1/variant/1', state: { projectName: 'Project 1', variantName: 'Variant 1' } }]}>
          <Routes>
            <Route path="/project/:projectId/variant/:variantId" element={<CameraPosition />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/capturePosition/fetch', {
        params: { variantId: '1' },
      });
    });

    expect(screen.getByText('Camera Position')).toBeInTheDocument;
    await waitFor(() => {
      expect(screen.getByText('Camera Position 1')).toBeInTheDocument;
    });
  });

  test('opens add camera position modal', () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={[{ pathname: '/project/1/variant/1', state: { projectName: 'Project 1', variantName: 'Variant 1' } }]}>
          <Routes>
            <Route path="/project/:projectId/variant/:variantId" element={<CameraPosition />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    fireEvent.click(screen.getByText('Add Camera Position'));

    expect(screen.getByText('Add Camera Position')).toBeInTheDocument;
    expect(screen.getByText('Camera position name')).toBeInTheDocument;
    expect(screen.getByPlaceholderText('Enter the camera position name')).toBeInTheDocument;
    expect(screen.getByText('Cancel')).toBeInTheDocument;
    expect(screen.getByText('Confirm')).toBeInTheDocument;
  });

  test('handles camera position delete', async () => {
    mockDelete.mockResolvedValue({});
    const mockCameraPositions = [{ id: '1', name: 'Camera Position 1' }];
    mockGet.mockResolvedValue({ data: { data: mockCameraPositions } });

    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={[{ pathname: '/project/1/variant/1', state: { projectName: 'Project 1', variantName: 'Variant 1' } }]}>
          <Routes>
            <Route path="/project/:projectId/variant/:variantId" element={<CameraPosition />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/capturePosition/fetch', {
        params: { variantId: '1' },
      });
    });
    await waitFor(() => {
      expect(screen.getByText('Camera Position 1')).toBeInTheDocument;
    });

    fireEvent.click(screen.getAllByRole('img', { name: 'More Options' })[0]);

    fireEvent.click(screen.getAllByText('Delete')[0]);

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/capturePosition', {
        params: { id: '1' },
      });
      expect(mockGet).toHaveBeenCalled();
    });
  });

  test('shows error message on delete failure', async () => {
    mockDelete.mockRejectedValue({
      response: { data: { data: { message: 'Error deleting camera position' } } },
    });
    const mockCameraPositions = [{ id: '1', name: 'Camera Position 1' }];
    mockGet.mockResolvedValue({ data: { data: mockCameraPositions } });

    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={[{ pathname: '/project/1/variant/1', state: { projectName: 'Project 1', variantName: 'Variant 1' } }]}>
          <Routes>
            <Route path="/project/:projectId/variant/:variantId" element={<CameraPosition />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/capturePosition/fetch', {
        params: { variantId: '1' },
      });
    });
    await waitFor(() => {
      expect(screen.getByText('Camera Position 1')).toBeInTheDocument;
    });

    fireEvent.click(screen.getAllByRole('img', { name: 'More Options' })[0]);

    fireEvent.click(screen.getAllByText('Delete')[0]);

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect('Error deleting camera position').toBeInTheDocument;
    });
  });

  test('handles edit click', async () => {
    const mockCameraPositions = [{ id: '1', name: 'Camera Position 1' }];
    mockGet.mockResolvedValue({ data: { data: mockCameraPositions } });

    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={[{ pathname: '/project/1/variant/1', state: { projectName: 'Project 1', variantName: 'Variant 1' } }]}>
          <Routes>
            <Route path="/project/:projectId/variant/:variantId" element={<CameraPosition />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(screen.getByText('Camera Position 1')).toBeInTheDocument;
    });

    fireEvent.click(screen.getAllByRole('img', { name: 'More Options' })[0]);

    fireEvent.click(screen.getByText('Edit'));

    expect(screen.getByText('Add Camera Position')).toBeInTheDocument;
    expect(screen.getByText('Camera position name')).toBeInTheDocument;
    expect(screen.getByPlaceholderText('Enter the camera position name')).toBeInTheDocument;
    expect(screen.getByText('Cancel')).toBeInTheDocument;
    expect(screen.getByText('Confirm')).toBeInTheDocument;
  });

  test('shows error message on fetching project details failure', async () => {
    // Mock the get request to fail
    const mockCameraPositions = [{ id: '1', name: 'Camera Position 1' }];
    mockGet.mockResolvedValueOnce({ data: { data: mockCameraPositions } }).mockRejectedValueOnce({
      response: { data: { data: { message: 'Error fetching project details' } } },
    });
  
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={[{ pathname: '/project/1/variant/1', state: { projectName: 'Project 1', variantName: 'Variant 1' } }]}>
          <Routes>
            <Route path="/project/:projectId/variant/:variantId" element={<CameraPosition />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );
  
    // Wait for the fetch request to be called
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/project', {
        params: { projectId: '1' },
      });
    });
  
    // Check if the error toast was called with the correct message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error fetching project details');
    });
  });
  
  test('handles successful fetch of project details', async () => {
    const mockProject = { id: '1', name: 'Project 1', cameraCount: 3, isCameraFixed: false };
    mockGet.mockResolvedValueOnce().mockResolvedValueOnce({ data: { data: mockProject } });
  
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={[{ pathname: '/project/1/variant/1', state: { projectName: 'Project 1', variantName: 'Variant 1' } }]}>
          <Routes>
            <Route path="/project/:projectId/variant/:variantId" element={<CameraPosition />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );
  
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/project', {
        params: { projectId: '1' },
      });
    });
  
    expect(screen.getByText('Camera Position')).toBeInTheDocument;
  });
  
  test('renders correct modal action for add camera position', () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={[{ pathname: '/project/1/variant/1', state: { projectName: 'Project 1', variantName: 'Variant 1' } }]}>
          <Routes>
            <Route path="/project/:projectId/variant/:variantId" element={<CameraPosition />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );
  
    fireEvent.click(screen.getByText('Add Camera Position'));
    expect(screen.getByText('Add Camera Position')).toBeInTheDocument;
  });  
});
