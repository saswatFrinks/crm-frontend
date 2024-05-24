import ArrowRight from '@/shared/icons/ArrowRight';
import Heading from '@/shared/layouts/main/heading';
import React from 'react';
import Variant from '../variants/Variant';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '@/shared/states/modal.state';
import Modal from '@/shared/ui/Modal';
import AddFolderModal from './AddFolderModal';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '@/core/request/aixosinstance';
import { CiFileOn } from 'react-icons/ci';
import Action from '@/modules/team-user/Action';
import DeleteModal from '@/modules/team-user/DeleteModal';
import toast from 'react-hot-toast';
import Button from '@/shared/ui/Button';

export default function DataSet() {
  const setModalState = useSetRecoilState(modalAtom);
  const params = useParams();
  const navigate = useNavigate();
  const [folders, setFolders] = React.useState([]);
  const [action, setAction] = React.useState('add');
  const [editIndex, setEditIndex] = React.useState(0);
  const [id, setId] = React.useState('');
  const location = useLocation();

  const fetchAllFolders = async () => {
    const res = await axiosInstance.get('/dataset/folders', {
      params: {
        cameraConfigId: params.cameraConfigId,
      },
    });

    setFolders(res.data.data);
  };

  const deleteFolder = async () => {
    try {
      await axiosInstance.delete('/dataset', {
        params: {
          id: id,
        },
      });
      fetchAllFolders();
    } catch (error) {
      toast.error(error.response.data.data.message);
    }
  };
  
  const goToConfig = () => {
    navigate(`/configuration/${params.projectId}`)
  }

  React.useEffect(() => {
    fetchAllFolders();
  }, []);

  const renderModalAction = () => {
    const obj = {
      add: <AddFolderModal fetchAllFolders={fetchAllFolders} />,
      delete: <DeleteModal deleteById={deleteFolder} title={'dataset'} />,
      edit: (
        <AddFolderModal
          editFolder={folders[editIndex]}
          fetchAllFolders={fetchAllFolders}
        />
      ),
    };

    return obj[action];
  };

  const handleOpenModal = (type) => {
    setAction(type);
    setModalState(true);
  };

  const handleEdit = (index) => {
    handleOpenModal('edit');
    setEditIndex(index);
  };

  return (
    <>
      <Modal>{renderModalAction()}</Modal>

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
        <Link to="/" className="mb-8">
          Project
        </Link>
      </Heading>

      <div className="p-10">
        <h1 className="text-2xl font-semibold">Data Sets</h1>
        <div className="mt-10 flex flex-wrap gap-6">
          <Variant.Create
            onClick={() => handleOpenModal('add')}
            title="Create Folder"
          />

          {folders.map((folder, i) => {
            return (
              <Link
                to={`folder/${folder.id}`}
                key={folder.id}
                state={{ ...location.state, folderName: folder.name }}
                className=" flex basis-80 items-center justify-between rounded-md border border-gray-300/90 bg-white px-10 py-4 shadow-sm"
              >
                <div className="inline-flex rounded-md bg-[#E7E7FF]/50 p-2">
                  <CiFileOn className="h-6 w-6 text-f-primary duration-100 group-hover:h-6 group-hover:w-6" />
                </div>
                {folder.name}
                <div
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                >
                  <Action
                    id={folder.id}
                    handleEdit={handleEdit}
                    handleOpenModal={handleOpenModal}
                    editIndex={i}
                    setId={setId}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Button
        fullWidth={false}
        className='absolute bottom-10 right-10'
        onClick={goToConfig}
      >
        Finish this build configuration
      </Button>
    </>
  );
}
