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

export default function CameraPosition() {
  const setModalState = useSetRecoilState(modalAtom);
  const params = useParams();
  const [cameraPositions, setCameraPositions] = React.useState([]);
  const location = useLocation();

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
  }, []);

  return (
    <>
      <Modal>
        <AddCameraPositionModal fetchAllCameraPosition={fetchAllCameraPosition}/>
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
          </>
        }
      >
        Project
      </Heading>

      <div className="p-10">
        <h1 className="text-2xl font-semibold">Camera Position</h1>
        <div className="mt-10 flex flex-wrap gap-6">
          <Variant.Create
            onClick={() => setModalState(true)}
            title="Add Camera Position"
          />

          {cameraPositions.map((cameraPosition) => {
            return (
              <Variant.Card
                key={cameraPosition.id}
                title={cameraPosition.name}
                to={`camera-position/${cameraPosition.id}`}
                state={{...location.state, cameraPositionName: cameraPosition.name}}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
