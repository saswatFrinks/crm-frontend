/* eslint-disable */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axiosInstance from '@/core/request/aixosinstance';
import useImage from 'use-image';
import toast from 'react-hot-toast';
import UploadImage from '@/modules/project/assembly/components/UploadImage';
import { RecoilRoot } from 'recoil';
import {
  selectedFileAtom,
  uploadedFileListAtom,
  rectanglesAtom,
  polygonsAtom,
  imageStatusAtom,
} from '@/modules/project/state'; // Import your atoms
import { stepAtom } from '@/modules/project/assembly/state';
import * as ReactHooks from 'react';

// Mocking external dependencies
jest.mock('use-image', () => ({
  __esModule: true,
  default: jest.fn(() => [null, false]), // No image by default, returns [image, loading]
}));

jest.mock('@/core/request/aixosinstance', () => ({
  get: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

// Mock react-konva to avoid the canvas error
jest.mock('react-konva', () => ({
  Stage: ({ children }) => <div>{children}</div>,
  Layer: ({ children }) => <div>{children}</div>,
  Rect: () => <div>Rect</div>, // Mock Rect as a div
}));

// Ensure correct import for KonvaImageView
jest.mock('@/modules/project/assembly/components/KonvaImageView', () => ({
  __esModule: true,
  default: () => <div>KonvaImageView</div>, // Mock KonvaImageView
}));

describe('UploadImage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    useImage.mockReturnValue([{ width: 100, height: 100 }, false]);
  });

  test('renders the component with step 0', async () => {
    render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(stepAtom, 0); // Initialize step to 0
          set(rectanglesAtom, []); // Initialize rectangles as empty array
          set(polygonsAtom, []); // Initialize polygons as empty array
        }}
      >
        <UploadImage type={null} />
      </RecoilRoot>
    );

    // Check if the message for step 0 is shown
    expect(
      screen.getByText('Upload images to get started with the configuration')
    ).toBeInTheDocument;
  });

  // test('renders the loading state when an image is loading', async () => {
  //   const mockUploadedFileList = [
  //     { id: 'file1', url: 'blob:http://example.com/1' },
  //     { id: 'file2', url: 'blob:http://example.com/2' },
  //   ];
  
  //   const selectedFile = { id: 'file1', url: 'blob:http://example.com/1' };
  
  //   render(
  //     <RecoilRoot
  //       initializeState={({ set }) => {
  //         set(uploadedFileListAtom, mockUploadedFileList);
  //         set(selectedFileAtom, selectedFile);
  //         set(imageStatusAtom, { drawMode: false });
  //         // Set the Recoil state that simulates the loading state
  //         set(rectanglesAtom, []); // To prevent a break on rectangle drawing
  //         set(polygonsAtom, []); // To prevent a break on polygon drawing
  //       }}
  //     >
  //       <UploadImage type={null} />
  //     </RecoilRoot>
  //   );
  
  //   // Wait for the "Loading Image" text to appear
  //   await waitFor(() => {
  //     expect(screen.getByText('Loading Image')).toBeInTheDocument();
  //   });
  // });  

  // test('caches images using the cacheImages function and axios', async () => {
  //   const mockUploadedFileList = [];

  //   // Mock axios response
  //   axiosInstance.get.mockResolvedValueOnce({
  //     data: new ArrayBuffer(8), // Simulate image data
  //   });

  //   render(
  //     <RecoilRoot
  //       initializeState={({ set }) => {
  //         set(uploadedFileListAtom, mockUploadedFileList); // Initialize uploaded file list
  //       }}
  //     >
  //       <UploadImage type={null} />
  //     </RecoilRoot>
  //   );

  //   // Simulate the caching of images
  //   await waitFor(() => {
  //     expect(axiosInstance.get).toHaveBeenCalledWith(
  //       '/configurationImage/view',
  //       {
  //         params: { imageId: 'file1' },
  //         responseType: 'arraybuffer',
  //       }
  //     );
  //   });
  // });

  // test('handles axios error during image caching and shows toast error', async () => {
  //   const mockUploadedFileList = [{ id: 'file1', url: 'blob:http://example.com/1' }];

  //   // Mock axios to reject with an error
  //   axiosInstance.get.mockRejectedValueOnce({
  //     response: { status: 400, data: { data: { message: 'Image not found' } } },
  //   });

  //   render(
  //     <RecoilRoot
  //       initializeState={({ set }) => {
  //         set(uploadedFileListAtom, mockUploadedFileList); // Initialize uploaded file list
  //       }}
  //     >
  //       <UploadImage type={null} />
  //     </RecoilRoot>
  //   );

  //   // Simulate the caching process and check for error
  //   await waitFor(() => {
  //     expect(axiosInstance.get).toHaveBeenCalled();
  //   });

  //   // Ensure the toast error is shown
  //   await waitFor(() => {
  //     expect(toast.error).toHaveBeenCalledWith('Image not found');
  //   });
  // });

  test('renders KonvaImageView when file and step are valid', async () => {
    const mockFile = { id: 'file1', url: 'blob:http://example.com/1' };
    const mockStep = 1;
    const mockRectangles = [];
    const mockPolygons = [];

    // Mock the useImage hook to return a valid image
    useImage.mockReturnValue([{ width: 100, height: 100 }, false]);

    render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(selectedFileAtom, mockFile); // Initialize selected file
          set(rectanglesAtom, mockRectangles); // Initialize rectangles
          set(polygonsAtom, mockPolygons); // Initialize polygons
          set(stepAtom, mockStep); // Initialize step
        }}
      >
        <UploadImage type={null} />
      </RecoilRoot>
    );

    // Ensure KonvaImageView is rendered when the image is loaded
    await waitFor(() => {
      expect(screen.getByText('KonvaImageView')).toBeInTheDocument; // Since we mock KonvaImageView
    });
  });
});