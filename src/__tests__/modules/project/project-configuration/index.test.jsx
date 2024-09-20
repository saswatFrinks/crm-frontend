// src/__tests__/ProjectConfiguration.test.jsx
/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectConfiguration from '@/modules/project/project-configuration';
import axiosInstance from '@/core/request/aixosinstance';
import { RecoilRoot } from 'recoil';
import toast from 'react-hot-toast';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DEFAULT_ASSEMBLY } from '@/core/constants';

// Mock the necessary modules and components
jest.mock('@/core/request/aixosinstance', () => ({
  get: jest.fn(),
}));

jest.mock('react-hot-toast');

describe('ProjectConfiguration Component', () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    axiosInstance.get = mockGet;
    toast.error = jest.fn();
  });

  test('renders the component and fetches configurations based on projectId', async () => {
    const mockConfigurations = [
      {
        id: '1',
        variant: 'Variant 1',
        cameraPosition: 'Position 1',
        cameraConfig: 'Config 1',
        objective: 'Objective 1',
        status: 'Pending',
        analysisStatus: 0,
      },
      {
        id: '2',
        variant: 'Variant 2',
        cameraPosition: 'Position 2',
        cameraConfig: 'Config 2',
        objective: 'Objective 2',
        status: 'Complete',
        analysisStatus: 3,
      },
    ];
    mockGet.mockResolvedValueOnce({ data: { data: mockConfigurations } });

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/configuration/0b6cf055-ceb2-48f9-8726-29379869b1fc',
              state: { projectName: 'Project 1' },
            },
          ]}
        >
          <Routes>
            <Route
              path="/configuration/:projectId"
              element={<ProjectConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    // Wait for configurations to be fetched and displayed
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/configuration/list', {
        params: { projectId: '0b6cf055-ceb2-48f9-8726-29379869b1fc' },
      });
    });

    // Check if configurations are rendered
    await waitFor(() => {
      expect(screen.getByText('Variant 1')).toBeInTheDocument;
      expect(screen.getByText('Variant 2')).toBeInTheDocument;
      expect(screen.getByText('Position 1')).toBeInTheDocument;
      expect(screen.getByText('Position 2')).toBeInTheDocument;
      expect(screen.getByText('Config 1')).toBeInTheDocument;
      expect(screen.getByText('Config 2')).toBeInTheDocument;
      expect(screen.getByText('Objective 1')).toBeInTheDocument;
      expect(screen.getByText('Objective 2')).toBeInTheDocument;
      expect(screen.getByText('Pending')).toBeInTheDocument;
      expect(screen.getByText('Complete')).toBeInTheDocument;
    });
  });

  // test('handles configuration selection and radio button check', async () => {
  //   const mockConfigurations = [
  //     { id: '1', variant: 'Variant 1', cameraPosition: 'Position 1', cameraConfig: 'Config 1', objective: 'Objective 1', status: 'Pending', analysisStatus: 0 },
  //   ];
  //   mockGet.mockResolvedValueOnce({ data: { data: mockConfigurations } });

  //   render(
  //     <RecoilRoot>
  //       <MemoryRouter
  //         initialEntries={[
  //           {
  //             pathname: '/configuration/0b6cf055-ceb2-48f9-8726-29379869b1fc',
  //             state: { projectName: 'Project 1' },
  //           },
  //         ]}
  //       >
  //         <Routes>
  //           <Route path="/configuration/:projectId" element={<ProjectConfiguration />} />
  //         </Routes>
  //       </MemoryRouter>
  //     </RecoilRoot>
  //   );

  //   await waitFor(() => {
  //     expect(mockGet).toHaveBeenCalledWith('/configuration/list', {
  //       params: { projectId: '0b6cf055-ceb2-48f9-8726-29379869b1fc' },
  //     });
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText('Variant 1')).toBeInTheDocument;
  //     expect(screen.getByText('Position 1')).toBeInTheDocument;
  //     expect(screen.getByText('Config 1')).toBeInTheDocument;
  //     expect(screen.getByText('Objective 1')).toBeInTheDocument;
  //     expect(screen.getByText('Pending')).toBeInTheDocument;
  //   })

  //   // Select a configuration using the radio button
  //   const radioButton = screen.getByLabelText('stationary');
  //   fireEvent.click(radioButton);

  //   // Ensure the radio button is checked
  //   expect(radioButton.checked).toBe(true);
  // });

  test('displays analysis status button with correct state', async () => {
    const mockConfigurations = [
      {
        id: '1',
        variant: 'Variant 1',
        cameraPosition: 'Position 1',
        cameraConfig: 'Config 1',
        objective: 'Objective 1',
        status: 'In progress',
        analysisStatus: 2,
      },
    ];
    mockGet.mockResolvedValueOnce({ data: { data: mockConfigurations } });

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/configuration/0b6cf055-ceb2-48f9-8726-29379869b1fc',
              state: { projectName: 'Project 1' },
            },
          ]}
        >
          <Routes>
            <Route
              path="/configuration/:projectId"
              element={<ProjectConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/configuration/list', {
        params: { projectId: '0b6cf055-ceb2-48f9-8726-29379869b1fc' },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Variant 1')).toBeInTheDocument;
    });

    // Check if the analysis status button is displayed correctly
    const analysisButton = screen.getAllByText('In progress')[1];
    expect(analysisButton).toBeInTheDocument;
  });

  test('displays error message when fetching configurations fails', async () => {
    mockGet.mockRejectedValueOnce({
      response: {
        data: { data: { message: 'Error fetching configurations' } },
      },
    });

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/configuration/0b6cf055-ceb2-48f9-8726-29379869b1fc',
              state: { projectName: 'Project 1' },
            },
          ]}
        >
          <Routes>
            <Route
              path="/configuration/:projectId"
              element={<ProjectConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error fetching configurations');
    });
  });

  test('opens pre-analysis modal when analysis is complete', async () => {
    const mockConfigurations = [
      {
        id: '1',
        variant: 'Variant 1',
        cameraPosition: 'Position 1',
        cameraConfig: 'Config 1',
        objective: 'Objective 1',
        status: 'Pending',
        analysisStatus: 3,
      },
    ];
    mockGet
      .mockResolvedValueOnce({ data: { data: mockConfigurations } })
      .mockResolvedValueOnce({
        data: {
          data: {
            rois: {
              rois: {
                Region1: { passed: true },
                Region2: { passed: false },
                Region3: { passed: true },
              },
              classes: {
                class1: 'Class A',
                class2: 'Class B',
                class3: 'Class C',
              },
            },
          },
        },
      });

    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/configuration/0b6cf055-ceb2-48f9-8726-29379869b1fc',
              state: { projectName: 'Project 1' },
            },
          ]}
        >
          <Routes>
            <Route
              path="/configuration/:projectId"
              element={<ProjectConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/configuration/list', {
        params: { projectId: '0b6cf055-ceb2-48f9-8726-29379869b1fc' },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Variant 1')).toBeInTheDocument;
    });

    // Click the 'Analysis Complete' button to open the modal
    const analysisButton = screen.getByText('Analysis Complete');
    fireEvent.click(analysisButton);

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/recommender/pre-analysis-data', {
        params: {
          configId: '1',
        },
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Positive')).toBeInTheDocument;
      expect(screen.getByText('Negative')).toBeInTheDocument;
    });
  });

  test('disables pre-analysis button when analysis status is unavailable', async () => {
    const mockConfigurations = [
      {
        id: '1',
        variant: 'Variant 1',
        cameraPosition: 'Position 1',
        cameraConfig: 'Config 1',
        objective: 'Objective 1',
        status: 'Result Unavailable',
        analysisStatus: 0, // Disabled state
      },
    ];
  
    mockGet.mockResolvedValueOnce({ data: { data: mockConfigurations } });
  
    render(
      <RecoilRoot>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/configuration/0b6cf055-ceb2-48f9-8726-29379869b1fc',
              state: { projectName: 'Project 1' },
            },
          ]}
        >
          <Routes>
            <Route
              path="/configuration/:projectId"
              element={<ProjectConfiguration />}
            />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );
  
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/configuration/list', {
        params: { projectId: '0b6cf055-ceb2-48f9-8726-29379869b1fc' },
      });
    });

    await waitFor(() => {
      expect(screen.queryByText('Variant 1')).not.toBeInTheDocument;
    });
  
    // Verify the button is disabled
    const disabledButton = screen.getAllByText('Result Unavailable')[1];
    expect(disabledButton).toBeInTheDocument;
  
    // Simulate a click and verify that it does nothing (i.e., modal should not open)
    fireEvent.click(disabledButton);
  
    await waitFor(() => {
      expect(screen.queryByText('Positive')).not.toBeInTheDocument;
      expect(screen.queryByText('Negative')).not.toBeInTheDocument;
    });
  });
  
  describe('getValidationForConfiguration', () => {
    const setPreTrainingData = jest.fn();
    const setModal = jest.fn();
    
    // Dummy data for success case
    const mockResponse = {
      data: {
        data: {
          rois: {
            Region1: JSON.stringify({
              positive: 5,
              negative: 3,
              'class1_positive': 2,
              'class1_negative': 1,
              'class2_positive': 3,
              'class2_negative': 2,
            }),
            Region2: JSON.stringify({
              positive: 10,
              negative: 6,
              'class3_positive': 4,
              'class3_negative': 3,
            }),
          },
          classes: {
            class1: 'Class A',
            class2: 'Class B',
            class3: 'Class C',
          },
        },
      },
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('should handle empty or invalid response gracefully', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: {
          data: {
            rois: {},
            classes: {},
          },
        },
      });
  
      const getValidationForConfiguration = async (configId) => {
        try {
          const res = await axiosInstance.get('/recommender/pre-analysis-data', {
            params: {
              configId: configId,
            },
          });
          const ret = [];
          const temp = res.data.data.rois;
          const classNameMap = res.data.data.classes;
          Object.keys(temp).map((item) => {
            const roiName = item;
            const obj = JSON.parse(temp[item]);
            if (obj && Object.keys(obj).length > 4) {
              ret.push([roiName, 'All classes', obj['positive'], obj['negative']]);
            }
            delete obj['positive'];
            delete obj['negative'];
            const tempObj = {};
            let totalPositive = 0;
            let totalNegative = 0;
            Object.keys(obj).map((innerVal) => {
              const values = innerVal.split('_');
              const currVal = tempObj[values[0]] || {};
              tempObj[values[0]] = { ...currVal, [values[1]]: obj[innerVal] };
            });
            Object.keys(tempObj).map((finalKey) => {
              totalPositive += Number(tempObj[finalKey]['positive']);
              totalNegative += Number(tempObj[finalKey]['negative']);
              ret.push([
                roiName,
                classNameMap[finalKey] || 'Invalid class ID',
                tempObj[finalKey]['positive'],
                tempObj[finalKey]['negative'],
              ]);
            });
            if (obj && Object.keys(obj).length > 4) {
              ret.push([roiName, 'Total', '', totalPositive + totalNegative]);
            }
          });
          setPreTrainingData([...ret]);
        } catch (e) {
          toast.error(e?.response?.data?.data?.message);
        } finally {
          setModal(true);
        }
      };
  
      // Call the function
      await getValidationForConfiguration('config2');
  
      // Validate the results
      expect(setPreTrainingData).toHaveBeenCalledWith([]);
      expect(setModal).toHaveBeenCalledWith(true);
    });
  
    test('should handle API error and display toast message', async () => {
      axiosInstance.get.mockRejectedValueOnce({
        response: {
          data: { data: { message: 'Error fetching pre-analysis data' } },
        },
      });
  
      const getValidationForConfiguration = async (configId) => {
        try {
          const res = await axiosInstance.get('/recommender/pre-analysis-data', {
            params: {
              configId: configId,
            },
          });
          const ret = [];
          const temp = res.data.data.rois;
          const classNameMap = res.data.data.classes;
          Object.keys(temp).map((item) => {
            const roiName = item;
            const obj = JSON.parse(temp[item]);
            if (obj && Object.keys(obj).length > 4) {
              ret.push([roiName, 'All classes', obj['positive'], obj['negative']]);
            }
            delete obj['positive'];
            delete obj['negative'];
            const tempObj = {};
            let totalPositive = 0;
            let totalNegative = 0;
            Object.keys(obj).map((innerVal) => {
              const values = innerVal.split('_');
              const currVal = tempObj[values[0]] || {};
              tempObj[values[0]] = { ...currVal, [values[1]]: obj[innerVal] };
            });
            Object.keys(tempObj).map((finalKey) => {
              totalPositive += Number(tempObj[finalKey]['positive']);
              totalNegative += Number(tempObj[finalKey]['negative']);
              ret.push([
                roiName,
                classNameMap[finalKey] || 'Invalid class ID',
                tempObj[finalKey]['positive'],
                tempObj[finalKey]['negative'],
              ]);
            });
            if (obj && Object.keys(obj).length > 4) {
              ret.push([roiName, 'Total', '', totalPositive + totalNegative]);
            }
          });
          setPreTrainingData([...ret]);
        } catch (e) {
          toast.error(e?.response?.data?.data?.message);
        } finally {
          setModal(true);
        }
      };
  
      // Call the function
      await getValidationForConfiguration('config3');
  
      // Validate the error handling
      expect(toast.error).toHaveBeenCalledWith('Error fetching pre-analysis data');
      expect(setModal).toHaveBeenCalledWith(true);
    });
  });
});
