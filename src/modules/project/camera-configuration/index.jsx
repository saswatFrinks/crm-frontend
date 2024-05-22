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
import { CiFileOn } from 'react-icons/ci';
import Action from '@/modules/team-user/Action';
import toast from 'react-hot-toast';
import Modal from '@/shared/ui/Modal';
import DeleteModal from '@/modules/team-user/DeleteModal';

export default function CameraConfiguration() {
  const [open, setOpenDrawer] = React.useState(false);
  const params = useParams();
  const [cameraConfigs, setCameraConfigs] = React.useState([]);
  const [editIndex, setEditIndex] = React.useState(null);
  const [editConfig, setEditConfig] = React.useState(null);
  const [id, setId] = React.useState('');
  const location = useLocation();

  const setModalState = useSetRecoilState(modalAtom);

  const fetchAllCameraConfigs = async () => {
    try {
      const res = await axiosInstance.get('/cameraConfig/fetch', {
        params: {
          capturePositionId: params.cameraPositionId,
        },
      });
      setCameraConfigs(res.data.data);
    } catch (error) {
      toast.error(error.response.data.data.message);
    }
  };

  React.useEffect(() => {
    fetchAllCameraConfigs();
  }, []);

  const ref = React.useRef(null);

  const deleteCameraConfig = async () => {
    try {
      await axiosInstance.delete('/cameraConfig', {
        params: {
          id: id,
        },
      });
      fetchAllCameraConfigs();
    } catch (error) {
      toast.error(error.response.data.data.message);
    }
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
    setEditIndex(null);
    setEditConfig(null);
  };

  const openDrawer = () => {
    setOpenDrawer(true);
  };

  const handleOpenModal = (type) => {
    setModalState(true);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditConfig(cameraConfigs[index]);
    openDrawer();
  };

  return (
    <>
      <Modal>
        <DeleteModal
          deleteById={deleteCameraConfig}
          title={'camera configuration'}
        />
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
          </>
        }
      >
        <Link to="/" className="mb-8">
          Project
        </Link>
      </Heading>

      <div className="p-10">
        <h1 className="text-2xl font-semibold">Camera Configuration</h1>
        <div className="mt-10 flex flex-wrap gap-6">
          <Variant.Create
            onClick={openDrawer}
            title="Add Camera Configuration"
          />

          {cameraConfigs.map((cameraConfig, i) => {
            return (
              <Link
                to={`camera-config/${cameraConfig.id}`}
                key={cameraConfig.id}
                state={{
                  ...location.state,
                  cameraConfigName: cameraConfig.name,
                }}
                className=" flex basis-80 items-center justify-between rounded-md border border-gray-300/90 bg-white px-10 py-4 shadow-sm"
              >
                <div className="inline-flex rounded-md bg-[#E7E7FF]/50 p-2">
                  <CiFileOn className="h-6 w-6 text-f-primary duration-100 group-hover:h-6 group-hover:w-6" />
                </div>
                {cameraConfig.name}
                <div
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                >
                  <Action
                    id={cameraConfig.id}
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
        <AddCameraConfigurationDrawer
          editConfig={editConfig}
          ref={ref}
          closeDrawer={closeDrawer}
          fetchAllCameraConfigs={fetchAllCameraConfigs}
        />
      </Drawer>
    </>
  );
}
