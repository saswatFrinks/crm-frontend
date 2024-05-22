import AiTrainingLayout from './ai-training';
import AIAssembly from './ai-training/assembly';
import AIDetail from './ai-training/assembly/ai-detail';
import Cosmetic from './ai-training/cosmetic';
import Dimensioning from './ai-training/dimensioning';
import Instances from './instances';
import Annotation from './annotation';
import AnnotationJob from './anotation-job';
import Assembly from './assembly';
import CameraConfiguration from './camera-configuration';
import CameraPosition from './camera-position';
import DataSet from './data-set';
import Folder from './folder';
import ProjectConfiguration from './project-configuration';
import Variants from './variants';
import ProjectLayout from '@/shared/layouts/project';
import InstanceLayout from './instances/InstanceLayout';
import IndividualInstance from './instances/individual-instance';

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
          path: 'assembly/:configurationId',
          element: <Assembly />,
        },
      ],
    },
    {
      path: 'annotation/:projectId',
      children: [
        {
          path: '',
          element: <Annotation />,
        },
        {
          path: 'annotation-job/:configurationId/:datasetId',
          element: <AnnotationJob />,
        },
      ],
    },
    {
      path: 'ai-training/:projectId',
      element: <AiTrainingLayout />,
      children: [
        {
          path: 'assembly',
          children: [
            {
              path: '',
              element: <AIAssembly />,
            },
            {
              path: ':modelId',
              element: <AIDetail />,
            },
          ],
        },
        {
          path: 'dimensioning',
          element: <Dimensioning />,
        },
        {
          path: 'cosmetic',
          element: <Cosmetic />,
        },
      ],
    },
    {
      path: 'instances/:projectId',
      element: <InstanceLayout />,
      children: [
        {
          path: '',
          element: <Instances />,
        },
        {
          path: ':instanceId',
          element: <IndividualInstance />
        }
      ],
    },
  ],
};
