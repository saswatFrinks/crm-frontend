/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axiosInstance from '@/core/request/aixosinstance';
import { RecoilRoot } from 'recoil';
import { selectedFileAtom, uploadedFileListAtom } from '@/modules/project/state';
import UploadImagesStep from '@/modules/project/assembly/upload-image-step';
import { BASE_URL } from '@/util/url';
import { MemoryRouter } from 'react-router-dom';

// Mock axiosInstance
jest.mock('@/core/request/aixosinstance', () => ({
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

// Mock BASE_URL correctly
jest.mock('@/util/url', () => ({
  BASE_URL: 'http://mocked-base-url.com',
}));

describe('UploadImagesStep Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with correct text and upload buttons', () => {
    render(
      <RecoilRoot>
        <MemoryRouter>
          <UploadImagesStep />
        </MemoryRouter>
      </RecoilRoot>
    );

    expect(
      screen.getByText(
        'Upload one master image of perfectly good product for configuring inspection parameters.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Browse Images')).toBeInTheDocument();
  });

  test('uploads images and updates Recoil state', async () => {
    const mockUploadedFileList = Array.from({ length: 10 }, () => null);

    // Mock the axios post request
    axiosInstance.post.mockResolvedValue({ data: {} });

    render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(uploadedFileListAtom, mockUploadedFileList);
        }}
      >
        <MemoryRouter>
          <UploadImagesStep />
        </MemoryRouter>
      </RecoilRoot>
    );

    const fileInput = screen.getByLabelText('Browse Images');
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/configuration/upload-base-image',
        expect.any(FormData)
      );
    });
  });

  test('handles upload error and displays toast message', async () => {
    const mockUploadedFileList = Array.from({ length: 10 }, () => null);

    axiosInstance.post.mockRejectedValue({
      response: { data: { data: { message: 'Upload failed' } } },
    });

    render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(uploadedFileListAtom, mockUploadedFileList);
        }}
      >
        <UploadImagesStep />
      </RecoilRoot>
    );

    const fileInput = screen.getByLabelText('Browse Images');
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Upload failed');
    });
  });

  test('fetches all images and updates Recoil state on load', async () => {
    const mockUploadedFileList = Array.from({ length: 10 }, () => null);

    axiosInstance.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            index: 0,
            imageId: 'img0',
            name: 'img0.png',
            url: `${BASE_URL}/configurationImage/view?imageId=img0`,
          },
        ],
      },
    });

    render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(uploadedFileListAtom, mockUploadedFileList);
        }}
      >
        <UploadImagesStep />
      </RecoilRoot>
    );

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith('/configurationImage/images', {
        params: { configurationId: '1234' },
      });

      expect(screen.getByText('img0.png')).toBeInTheDocument();
    });
  });

  test('handles delete image functionality correctly', async () => {
    const mockUploadedFileList = [
      { id: 'img0', name: 'test-image.png', index: 0 },
    ];

    axiosInstance.delete.mockResolvedValueOnce({});

    render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(uploadedFileListAtom, mockUploadedFileList);
        }}
      >
        <UploadImagesStep />
      </RecoilRoot>
    );

    // Simulate clicking the trash icon to delete the image
    fireEvent.click(screen.getByText('Trash').closest('span'));

    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/configuration/', {
        params: {
          id: 'img0',
          configurationId: '1234',
        },
      });
    });
  });

  test('handles deletion error and displays toast message', async () => {
    const mockUploadedFileList = [
      { id: 'img0', name: 'test-image.png', index: 0 },
    ];

    axiosInstance.delete.mockRejectedValue({
      response: { data: { data: { message: 'Deletion failed' } } },
    });

    render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(uploadedFileListAtom, mockUploadedFileList);
        }}
      >
        <UploadImagesStep />
      </RecoilRoot>
    );

    // Simulate clicking the trash icon to delete the image
    fireEvent.click(screen.getByText('Trash').closest('span'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Deletion failed');
    });
  });
});
