import ArrowRight from '@/shared/icons/ArrowRight';
import Heading from '@/shared/layouts/main/heading';
import React from 'react';
import Variant from '../variants/Variant';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '@/shared/states/modal.state';
import Modal from '@/shared/ui/Modal';
import AddFolderModal from './AddFolderModal';
import { Link, useLocation, useParams } from 'react-router-dom';
import axiosInstance from '@/core/request/aixosinstance';

export default function DataSet() {
  const setModalState = useSetRecoilState(modalAtom);
  const params = useParams();
  const [folders, setFolders] = React.useState([]);
  const location = useLocation();

  const fetchAllFolders = async () => {
    const res = await axiosInstance.get('/dataset/folders', {
      params: {
        cameraConfigId: params.cameraConfigId,
      },
    });

    setFolders(res.data.data);
  };

  React.useEffect(() => {
    fetchAllFolders();
  }, []);

  return (
    <>
      <Modal>
        <AddFolderModal fetchAllFolders={fetchAllFolders} />
      </Modal>

      <Heading
        subcontent={
          <>
            <Link
              to={`/project/${params.projectId}`}
              className="flex items-center gap-2"
              state={location.state}
            >
              <ArrowRight />
              <span>{location.state.projectName}</span>
            </Link>
            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}`}
              className="flex items-center gap-2"
              state={location.state}
            >
              <ArrowRight />
              <span>{location.state.variantName}</span>
            </Link>

            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}/camera-position/${params.cameraPositionId}`}
              className="flex items-center gap-2"
              state={location.state}
            >
              <ArrowRight />
              <span>{location.state.cameraPositionName}</span>
            </Link>

            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}/camera-position/${params.cameraPositionId}/camera-config/${params.cameraConfigId}`}
              className="flex items-center gap-2"
              state={location.state}
            >
              <ArrowRight />
              <span>{location.state.cameraConfigName}</span>
            </Link>
          </>
        }
      >
        Project
      </Heading>

      <div className="p-10">
        <h1 className="text-2xl font-semibold">Data Sets</h1>
        <div className="mt-10 flex flex-wrap gap-6">
          <Variant.Create
            onClick={() => setModalState(true)}
            title="Create Folder"
          />

          {folders.map((folder) => {
            return (
              <Variant.Card
                key={folder.id}
                title={folder.name}
                to={`folder/${folder.id}`}
                state={{...location.state, folderName: folder.name}}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
