import CameraConfiguration from './camera-configuration';
import CameraPosition from './camera-position';
import DataSet from './data-set';
import Folder from './folder';
import ProjectConfiguration from './project-configuration';
import Variants from './variants';
import ProjectLayout from '@/shared/layouts/project';

export const projectRouter = {
  path: '',
  element: <ProjectLayout />,
  children: [
    {
      path: 'project/:projectId',
      element: <Variants />,
    },
    {
      path: 'project/:projectId/variant/:variantId',
      element: <CameraPosition />,
    },
    {
      path: 'project/:projectId/variant/:variantId/camera-position/:cameraPositionId',
      element: <CameraConfiguration />,
    },
    {
      path: 'project/:projectId/variant/:variantId/camera-position/:cameraPositionId/camera-config/:cameraConfigId',
      element: <DataSet />,
    },
    {
      path: 'project/:projectId/variant/:variantId/camera-position/:cameraPositionId/camera-config/123/folder/123',
      element: <Folder />,
    },

    {
      path: 'configuration/:projectId',
      element: <ProjectConfiguration />,
    },
  ],
};
