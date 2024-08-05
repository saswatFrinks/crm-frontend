import ArrowRight from '@/shared/icons/ArrowRight';
import Heading from '@/shared/layouts/main/heading';
import { modalAtom } from '@/shared/states/modal.state';
import Modal from '@/shared/ui/Modal';
import { useSetRecoilState } from 'recoil';
import Variant from '../variants/Variant';
import AddCameraPositionModal from './AddCameraPositionModal';
import { Link, useLocation, useParams } from 'react-router-dom';
import axiosInstance from '@/core/request/aixosinstance';
import React from 'react';
import { CiFileOn } from 'react-icons/ci';
import Action from '@/modules/team-user/Action';
import DeleteModal from '@/modules/team-user/DeleteModal';

export default function CameraPosition() {
  const setModalState = useSetRecoilState(modalAtom);
  const params = useParams();
  const [cameraPositions, setCameraPositions] = React.useState([]);
  const [action, setAction] = React.useState('add');
  const [editIndex, setEditIndex] = React.useState(0);
  const [id, setId] = React.useState('');
  const location = useLocation();

  const deleteCameraPosition = async () => {
    try {
      await axiosInstance.delete('/capturePosition', {
        params: {
          id: id,
        },
      });
      fetchAllCameraPosition();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllCameraPosition = async () => {
    const res = await axiosInstance.get('/capturePosition/fetch', {
      params: {
        variantId: params.variantId,
      },
    });
    setCameraPositions(res.data.data);
  };

  React.useEffect(() => {
    fetchAllCameraPosition();

    return () => setModalState(false);
  }, []);

  const renderModalAction = () => {
    const obj = {
      add: (
        <AddCameraPositionModal
          fetchAllCameraPosition={fetchAllCameraPosition}
        />
      ),
      delete: <DeleteModal deleteById={deleteCameraPosition} />,
      edit: (
        <AddCameraPositionModal
          fetchAllCameraPosition={fetchAllCameraPosition}
          editPosition={cameraPositions[editIndex]}
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
              state={{ ...location.state }}
            >
              <ArrowRight />
              <span>{location.state.projectName}</span>
            </Link>
            <Link
              to={`/project/${params.projectId}/variant/${params.variantId}`}
              className="flex items-center gap-2"
              state={{ ...location.state }}
            >
              <ArrowRight />
              <span>{location.state.variantName}</span>
            </Link>
          </>
        }
      >
        <Link to="/" className="mb-8">
          Project
        </Link>
      </Heading>

      <div className="p-10">
        <h1 className="text-2xl font-semibold">Camera Position</h1>
        <div className="mt-10 flex flex-wrap gap-6">
          <Variant.Create
            onClick={() => {
              handleOpenModal('add');
            }}
            title="Add Camera Position"
          />

          {cameraPositions.map((cameraPosition, i) => {
              return (
                <Link
                  to={`camera-position/${cameraPosition.id}`}
                  key={cameraPosition.id}
                  state={{
                    ...location.state,
                    cameraPositionName: cameraPosition.name,
                  }}
                  className=" flex basis-80 items-center justify-between rounded-md border border-gray-300/90 bg-white px-10 py-4 shadow-sm"
                >
                  <div className="inline-flex rounded-md bg-[#E7E7FF]/50 p-2">
                    <CiFileOn className="h-6 w-6 text-f-primary duration-100 group-hover:h-6 group-hover:w-6" />
                  </div>
                  {cameraPosition.name}
                  <div
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  >
                    <Action
                      id={cameraPosition.id}
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
    </>
  );
}
