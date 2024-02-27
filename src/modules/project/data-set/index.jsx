import ArrowRight from '@/shared/icons/ArrowRight';
import Heading from '@/shared/layouts/main/heading';
import React from 'react';
import Variant from '../variants/Variant';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '@/shared/states/modal.state';
import Modal from '@/shared/ui/Modal';
import AddFolderModal from './AddFolderModal';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '@/core/request/aixosinstance';

export default function DataSet() {
  const setModalState = useSetRecoilState(modalAtom);
  const params = useParams();
  const [folders, setFolders] = React.useState([]);

  const fetchAllFolders = async () => {
    const res = await axiosInstance.get('/dataset/folders', {
      params: {
        cameraConfigId: params.cameraConfigId
      }
    })

    setFolders(res.data.data)
  }

  React.useEffect(() => {
    fetchAllFolders();
  }, [])

  return (
    <>
      <Modal>
        <AddFolderModal fetchAllFolders={fetchAllFolders}/>
      </Modal>

      <Heading
        subcontent={
          <>
            <Link
              to={`/project/${params.projectId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>Project Name</span>
            </Link>
            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>Variant Name</span>
            </Link>

            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}/camera-position/${params.cameraPositionId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>Camera Position</span>
            </Link>

            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}/camera-position/${params.cameraPositionId}/camera-config/${params.cameraConfigId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>Camera Config</span>
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
                <Variant.Card key={folder.id} title={folder.name} to={`folder/${folder.id}`} />
              )
            })}
        </div>
      </div>
    </>
  );
}
