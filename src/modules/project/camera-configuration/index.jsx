import ArrowRight from '@/shared/icons/ArrowRight';
import Heading from '@/shared/layouts/main/heading';
import { modalAtom } from '@/shared/states/modal.state';
import { useSetRecoilState } from 'recoil';
import Variant from '../variants/Variant';
import React from 'react';
import Drawer from '@/shared/ui/Drawer';
import Button from '@/shared/ui/Button';
import AddCameraConfigurationDrawer from './AddCameraConfigurationDrawer';
import { Link, useLocation, useParams } from 'react-router-dom';
import axiosInstance from '@/core/request/aixosinstance';

export default function CameraConfiguration() {
  const [open, setOpenDrawer] = React.useState(false);
  const params = useParams();
  const [cameraConfigs, setCameraConfigs] = React.useState([]);
  const location = useLocation();

  const fetchAllCameraConfigs = async () => {
    const res = await axiosInstance.get('/cameraConfig/fetch', {
      params: {
        capturePositionId: params.cameraPositionId,
      },
    });
    setCameraConfigs(res.data.data);
  };

  React.useEffect(() => {
    fetchAllCameraConfigs();
  }, []);

  const ref = React.useRef(null);

  const closeDrawer = () => {
    setOpenDrawer(false);
  };

  const openDrawer = () => {
    setOpenDrawer(true);
  };

  return (
    <>
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
          </>
        }
      >
        Project
      </Heading>

      <div className="p-10">
        <h1 className="text-2xl font-semibold">Camera Configuration</h1>
        <div className="mt-10 flex flex-wrap gap-6">
          <Variant.Create
            onClick={openDrawer}
            title="Add Camera Configuration"
          />

          {cameraConfigs.map((cameraConfig) => {
            return (
              <Variant.Card
                key={cameraConfig.id}
                title={cameraConfig.name}
                to={`camera-config/${cameraConfig.id}`}
                state={{...location.state, cameraConfigName: cameraConfig.name}}
              />
            );
          })}
        </div>
      </div>

      <Drawer
        isOpen={open}
        handleClose={closeDrawer}
        title={'Add camera configuration'}
        size="xs"
        footer={
          <div className="flex  items-end justify-end gap-4 ">
            <Button
              size="xs"
              color="flat"
              fullWidth={false}
              className="min-w-[150px]"
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              size="xs"
              fullWidth={false}
              className="min-w-[150px]"
              onClick={() => ref.current?.submitForm()}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <AddCameraConfigurationDrawer ref={ref} closeDrawer={closeDrawer} fetchAllCameraConfigs={fetchAllCameraConfigs}/>
      </Drawer>
    </>
  );
}
