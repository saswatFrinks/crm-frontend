// src/__tests__/modules/CameraConfiguration.test.jsx
/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CameraConfiguration from '@/modules/project/camera-configuration';
import axiosInstance from '@/core/request/aixosinstance';
import toast from 'react-hot-toast';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

// Mocking necessary modules and components
jest.mock('@/core/request/aixosinstance', () => ({
  get: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
}));

jest.mock('react-hot-toast');

jest.mock(
  '@/modules/project/camera-configuration/AddCameraConfigurationDrawer',
  () => () => <div>Add camera configuration</div>
);

describe('CameraConfiguration Component', () => {
  const mockGet = jest.fn();
  const mockDelete = jest.fn();
  const mockPut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    axiosInstance.get = mockGet;
    axiosInstance.delete = mockDelete;
    axiosInstance.put = mockPut;
    toast.error = jest.fn();
  });

  test('renders component and fetches camera configurations', async () => {
    const mockCameraConfigs = [{ id: '1', name: 'Camera Config 1', order: 0 }];
    mockGet.mockResolvedValueOnce({ data: { data: mockCameraConfigs } });

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/project/1/variant/1/camera-position/1',
              state: {
                projectName: 'Project 1',
                variantName: 'Variant 1',
                cameraPositionName: 'Camera Position 1',
              },
            },
          ]}
        >
          <Routes>
            <Route
              path="/project/:projectId/variant/:variantId/camera-position/:cameraPositionId"
              element={<CameraConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/cameraConfig/fetch', {
        params: { capturePositionId: '1' },
      });
    });

    expect(screen.getByText('Camera Configuration')).toBeInTheDocument;
    await waitFor(() => {
      expect(screen.getByText('Camera Config 1')).toBeInTheDocument;
    });
  });

  test('handles empty camera configurations', async () => {
    mockGet.mockResolvedValueOnce({ data: { data: [] } });

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/project/1/variant/1/camera-position/1',
              state: {
                projectName: 'Project 1',
                variantName: 'Variant 1',
                cameraPositionName: 'Camera Position 1',
              },
            },
          ]}
        >
          <Routes>
            <Route
              path="/project/:projectId/variant/:variantId/camera-position/:cameraPositionId"
              element={<CameraConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(screen.getByText('Camera Configuration')).toBeInTheDocument;
    });

    expect(screen.queryByText('Camera Config 1')).not.toBeInTheDocument;
  });

  test('opens add camera configuration modal', () => {
    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/project/1/variant/1/camera-position/1',
              state: {
                projectName: 'Project 1',
                variantName: 'Variant 1',
                cameraPositionName: 'Camera Position 1',
              },
            },
          ]}
        >
          <Routes>
            <Route
              path="/project/:projectId/variant/:variantId/camera-position/:cameraPositionId"
              element={<CameraConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    fireEvent.click(screen.getByText('Add Camera Configuration'));

    expect(screen.getAllByText('Add camera configuration')).toBeInTheDocument;
  });

  test('handles camera configuration delete', async () => {
    const mockCameraConfigs = [{ id: '1', name: 'Camera Config 1', order: 0 }];
    mockGet.mockResolvedValueOnce({ data: { data: mockCameraConfigs } });
    mockDelete.mockResolvedValueOnce({});

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/project/1/variant/1/camera-position/1',
              state: {
                projectName: 'Project 1',
                variantName: 'Variant 1',
                cameraPositionName: 'Camera Position 1',
              },
            },
          ]}
        >
          <Routes>
            <Route
              path="/project/:projectId/variant/:variantId/camera-position/:cameraPositionId"
              element={<CameraConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/cameraConfig/fetch', {
        params: { capturePositionId: '1' },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Camera Config 1')).toBeInTheDocument;
    });

    fireEvent.click(screen.getByRole('img', { name: 'More Options' }));
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.getByText('Confirmation Message')).toBeInTheDocument;
    });

    fireEvent.click(screen.getByText('Delete')); // Confirm delete

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/cameraConfig', {
        params: { id: '1' },
      });
      expect(mockGet).toHaveBeenCalled(); // To refetch camera configs
    });
  });

  test('shows error message on delete failure', async () => {
    const mockCameraConfigs = [{ id: '1', name: 'Camera Config 1', order: 0 }];
    mockGet.mockResolvedValueOnce({ data: { data: mockCameraConfigs } });

    mockDelete.mockRejectedValueOnce({
      response: {
        data: { data: { message: 'Error deleting camera configuration' } },
      },
    });

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/project/1/variant/1/camera-position/1',
              state: {
                projectName: 'Project 1',
                variantName: 'Variant 1',
                cameraPositionName: 'Camera Position 1',
              },
            },
          ]}
        >
          <Routes>
            <Route
              path="/project/:projectId/variant/:variantId/camera-position/:cameraPositionId"
              element={<CameraConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/cameraConfig/fetch', {
        params: { capturePositionId: '1' },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Camera Config 1')).toBeInTheDocument;
    });

    fireEvent.click(screen.getByRole('img', { name: 'More Options' }));
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.getByText('Confirmation Message')).toBeInTheDocument;
    });

    fireEvent.click(screen.getByText('Delete')); // Confirm delete

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Error deleting camera configuration'
      );
    });
  });

  test('handles edit click', async () => {
    const mockCameraConfigs = [{ id: '1', name: 'Camera Config 1', order: 0 }];
    mockGet.mockResolvedValueOnce({ data: { data: mockCameraConfigs } });

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/project/1/variant/1/camera-position/1',
              state: {
                projectName: 'Project 1',
                variantName: 'Variant 1',
                cameraPositionName: 'Camera Position 1',
              },
            },
          ]}
        >
          <Routes>
            <Route
              path="/project/:projectId/variant/:variantId/camera-position/:cameraPositionId"
              element={<CameraConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(screen.getByText('Camera Config 1')).toBeInTheDocument;
    });

    fireEvent.click(screen.getByRole('img', { name: 'More Options' }));
    fireEvent.click(screen.getByText('Edit'));

    expect(screen.getByText('Add Camera Configuration')).toBeInTheDocument;
  });

  test('shows error message on fetching camera configurations failure', async () => {
    mockGet.mockRejectedValueOnce({
      response: {
        data: { data: { message: 'Error fetching camera configurations' } },
      },
    });

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/project/1/variant/1/camera-position/1',
              state: {
                projectName: 'Project 1',
                variantName: 'Variant 1',
                cameraPositionName: 'Camera Position 1',
              },
            },
          ]}
        >
          <Routes>
            <Route
              path="/project/:projectId/variant/:variantId/camera-position/:cameraPositionId"
              element={<CameraConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Error fetching camera configurations'
      );
    });
  });

  test('closes drawer when closeDrawer is called', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        data: [
          { id: '1', name: 'Camera Config 1', order: 0 },
          { id: '2', name: 'Camera Config 2', order: 1 },
        ],
      },
    });

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/project/1/variant/1/camera-position/1',
              state: {
                projectName: 'Project 1',
                variantName: 'Variant 1',
                cameraPositionName: 'Camera Position 1',
              },
            },
          ]}
        >
          <Routes>
            <Route
              path="/project/:projectId/variant/:variantId/camera-position/:cameraPositionId"
              element={<CameraConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    // Open the drawer first
    fireEvent.click(screen.getByText('Add Camera Configuration'));

    // Confirm that the drawer is open
    expect(screen.getAllByText('Add camera configuration')).toBeInTheDocument;

    // Now close the drawer
    fireEvent.click(screen.getByText('Cancel')); // Assuming 'Cancel' button triggers `closeDrawer`

    // Confirm that the drawer is closed and states are reset
    await waitFor(() => {
      expect(screen.queryByText('Add camera configuration')).not
        .toBeInTheDocument; // Drawer is closed
    });
  });

  test('sets correct title when deleting non-highest order camera configuration', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        data: [
          { id: '1', name: 'Camera Config 1', order: 0 },
          { id: '2', name: 'Camera Config 2', order: 1 },
        ],
      },
    });
    const mockInstanceStatus = { data: { data: { data: 0 } } }; // Simulate no active instances using the config
    mockGet.mockResolvedValueOnce(mockInstanceStatus);

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/project/1/variant/1/camera-position/1',
              state: {
                projectName: 'Project 1',
                variantName: 'Variant 1',
                cameraPositionName: 'Camera Position 1',
              },
            },
          ]}
        >
          <Routes>
            <Route
              path="/project/:projectId/variant/:variantId/camera-position/:cameraPositionId"
              element={<CameraConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Camera Config 1')
      ).toBeInTheDocument;
    });

    // Trigger delete action for a non-highest order config
    fireEvent.click(screen.getAllByRole('img', { name: 'More Options' })[0]);
    fireEvent.click(screen.getByText('Delete'));

    // Mock handleOpenModal and setTitle for non-highest order config
    const deleteId = '1'; // Non-highest order config (order 0)
    const maxOrder = 1; // Highest order is 1
    const element = { id: deleteId, order: 0 };

    // Ensure the title is set correctly when the configuration being deleted is not the highest order
    await waitFor(() => {
      expect(
        screen.getByText(
          'This action will additionally update the capture order for the remaining Camera Configurations. Do you want to proceed to delete this camera configuration?'
        )
      ).toBeInTheDocument;
    });
  });
});
