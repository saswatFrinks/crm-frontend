import AiTraining from './ai-training';
import Assembly from './assembly';
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
      path: 'project/:projectId/variant/:variantId/camera-position/:cameraPositionId/camera-config/:cameraConfigId/folder/:folderId',
      element: <Folder />,
    },
    {
      path: 'configuration/:projectId',
      children: [
        {
          path: '',
          element: <ProjectConfiguration />,
        },
        {
          path: 'assembly',
          element: <Assembly />,
        },
      ],
    },
    {
      path: 'ai-training/:projectId',
      element: <AiTraining />,
    },
  ],
};
