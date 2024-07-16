import ArrowRight from '@/shared/icons/ArrowRight';
import Heading from '@/shared/layouts/main/heading';
import { modalAtom } from '@/shared/states/modal.state';
import { useSetRecoilState } from 'recoil';
import Variant from '../variants/Variant';
import React from 'react';
import Drawer from '@/shared/ui/Drawer';
import Button from '@/shared/ui/Button';
import AddCameraConfigurationDrawer from './AddCameraConfigurationDrawer';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '@/core/request/aixosinstance';
import { CiFileOn } from 'react-icons/ci';
import Action from '@/modules/team-user/Action';
import toast from 'react-hot-toast';
import Modal from '@/shared/ui/Modal';
import DeleteModal from '@/modules/team-user/DeleteModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Drag from '@/shared/icons/Drag';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';

export default function CameraConfiguration() {
  const [open, setOpenDrawer] = React.useState(false);
  const params = useParams();
  const [cameraConfigs, setCameraConfigs] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(null);
  const [editConfig, setEditConfig] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [id, setId] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleOpenModal = async (type, deleteId = null) => {
    if (type === 'delete') {
      const instanceStatus = await axiosInstance.get(
        '/cameraConfig/instance-status',
        {
          params: {
            projectId: params.projectId,
          },
        }
      );
      const maxOrder = Math.max(...cameraConfigs.map((item) => item.order));
      const element = cameraConfigs.find((item) => item.id === deleteId);
      const isHighestOrder = element ? element.order === maxOrder : false;
      if (instanceStatus.data.data.data !== 0) {
        setTitle(
          `There are existing Instances which are using this camera configuration. If you delete it, those Instances
          will lose all data related to this camera configuration along with loss of other data stored within this
          configuration as well (like datasets, ROIs, classes, etc.). 
          ${
            !isHighestOrder
              ? 'This action will additionally update the capture order for the remaining Camera Configurations.'
              : ''
          }
          Do you want to proceed to delete this camera configuration (which will delete this configuration from the existing Instances) ?`
        );
      } else if (!isHighestOrder) {
        setTitle(
          'This action will additionally update the capture order for the remaining Camera Configurations. Do you want to proceed to delete this camera configuration?'
        );
      }
    }
    setModalState(true);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditConfig(cameraConfigs[index]);
    openDrawer();
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      cameraConfigs,
      result.source.index,
      result.destination.index
    );

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));
    
    await reorderConfigs(updatedItems?.map(item => ({id: item?.id, order: item?.order})))
    setCameraConfigs(updatedItems);
  };

  const reorderConfigs = async (configs) => {
    try {
      setLoader(true);
      await axiosInstance.put('cameraConfig/reorder-configs', {configs})
      await fetchAllCameraConfigs();
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    } finally {
      setLoader(false);
    }
  }

  React.useEffect(() => {
    fetchAllCameraConfigs();

    return () => setModalState(false);
  }, []);

  return (
    <>
      {loader && <ProjectCreateLoader title='Updating Camera Configurations' />}
      <Modal>
        <DeleteModal
          deleteById={deleteCameraConfig}
          title={'camera configuration'}
          para={title}
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
        <div className="mt-10 flex gap-6">
          <div className="min-w-[320px]">
            <Variant.Create
              onClick={openDrawer}
              title="Add Camera Configuration"
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="cameraConfigs" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-wrap gap-6"
                  >
                    {cameraConfigs
                      .sort((a, b) => a.order - b.order)
                      .map((cameraConfig, i) => {
                        return (
                          <Draggable
                            key={cameraConfig.id}
                            draggableId={cameraConfig.id}
                            index={i}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="min-w-[320px] rounded-md border border-gray-300/90 bg-white px-5 py-4 shadow-sm"
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-pointer p-2"
                                    onClick={(event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                    }}
                                  >
                                    <Drag />
                                  </div>
                                  <div
                                    className="flex basis-80 cursor-pointer items-center justify-between"
                                    onClick={() =>
                                      navigate(
                                        `camera-config/${cameraConfig.id}`,
                                        {
                                          state: {
                                            ...location.state,
                                            cameraConfigName: cameraConfig.name,
                                          },
                                        }
                                      )
                                    }
                                  >
                                    <div className="inline-flex rounded-md bg-[#E7E7FF]/50 p-2">
                                      <CiFileOn className="h-7 w-7 text-f-primary duration-100 group-hover:h-6 group-hover:w-6" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <div>{cameraConfig.name}</div>
                                      <div className="text-center text-xs font-medium text-gray-500">
                                        Capture Order: {cameraConfig?.order}
                                      </div>
                                    </div>
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
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
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
        {open && (
          <AddCameraConfigurationDrawer
            editConfig={editConfig}
            ref={ref}
            closeDrawer={closeDrawer}
            fetchAllCameraConfigs={fetchAllCameraConfigs}
          />
        )}
      </Drawer>
    </>
  );
}
