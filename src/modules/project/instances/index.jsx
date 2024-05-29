import axiosInstance from '@/core/request/aixosinstance'
import Plus from '@/shared/icons/Plus'
import Button from '@/shared/ui/Button'
import Drawer from '@/shared/ui/Drawer'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import CreateInstanceDrawer from './CreateInstanceDrawer'
import { useRecoilState } from 'recoil'
import { addInstanceAtom, defaultAddInstanceValue } from './state'
import toast from 'react-hot-toast'
import Action from '@/modules/team-user/Action'
import { modalAtom } from '@/shared/states/modal.state'
import Modal from '@/shared/ui/Modal'
import DeleteModal from '@/modules/team-user/DeleteModal'
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader'
import Heading from '@/shared/layouts/main/heading'
import ArrowRight from '@/shared/icons/ArrowRight'
import Download from '@/shared/icons/Download'

const Instances = () => {
  const params = useParams();
  const location = useLocation();
  const [instances, setInstances] = useState([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [editIndex, setEditIndex] = useState(null);
  const [id, setId] = useState('');
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [modalOpen, setModalOpen] = useRecoilState(modalAtom);
  const [loader, setLoader] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [project, setProject] = React.useState(null);

  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get('/project', {
        params: {
          projectId: params.projectId,
        },
      })
      setProject(res?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message || 'Cannot fetch project details');
    }
  };
  
  const childRefs = Array.from({length: 5}, () => React.useRef({}));
  
  const handleNext = async () => {
    try {
      if(childRefs[step-1].current){
        const res = await childRefs[step-1].current.handleSubmit();
        if(res === null)return;
      }
      setStep((t) => {
        if (t == 5) {
          closeDrawer();
          return 1;
        }
        return t + 1;
      });
    } catch (error) {
      toast.error(error?.message)
    }
  };

  const handleBack = () => {
    setStep((t) => {
      if (t == 1) return t;
      return t - 1;
    });
  };

  const closeDrawer = () => {
    setEditIndex(null);
    setOpen(false);
    setAddInstance(defaultAddInstanceValue);
    setStep(1);
    fetchAllInstances();
  }

  const openDrawer = () => {
    setOpen(true);
  }

  const handleOpenModal = (type) => {
    if(type === 'edit'){
      openDrawer();
    } else if(type === 'delete'){
      setModalOpen(true);
    }
  }

  const handleEdit = (index) => {
    setEditIndex(index);
    handleOpenModal('edit')
  }

  const fetchAllInstances = async () => {
    try {
      setLoader(true);
      const res = await axiosInstance.get('/instance/list', {
        params: {
          projectId: params.projectId,
        },
      })

      let responseInstances = res?.data?.data;
      responseInstances = responseInstances.sort((instance1, instance2) => (instance2.instances.isActive - instance1.instances.isActive));
      setInstances(responseInstances);
    } catch(error) {
      toast.error(error?.response?.data?.data?.message)
    } finally {
      setLoader(false);
    }
  };

  const deleteInstance = async () => {
    try {
      await axiosInstance.delete('/instance/delete-draft', {
        params: {
          instanceId: id
        }
      });
      fetchAllInstances();
    } catch (error){
      toast.error(error?.response?.data?.data?.message)
    }
  }

  const downloadInstance = async (instanceId, instanceName, isActive) => {
    try {
      if(!isActive)return;
      setDownloadLoader(true);
      const res = await axiosInstance.get('/instance/download', {
        params: {
          instanceId
        }
      })
      const blob = new Blob([res.data], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${instanceName.toLowerCase().split(' ').join('_')}.sql`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch(error) {
      toast.error(error?.response?.data?.data?.message);
    } finally {
      setDownloadLoader(false);
    }
  }

  useEffect(() => {
    fetchAllInstances()
    fetchProject()
  }, [])

  const columns = ['Instance Name', 'Date Created', 'Validity', 'Plant', 'Instance ID', 'Download', '']

  return (
    <>
      {downloadLoader && (
        <ProjectCreateLoader title='Downloading Instance'/>
      )}
      <Heading
        subcontent={
          <>
            <Link
              to={`/instances/${params.projectId}`}
              className="flex items-center gap-2"
              state={{...location.state, projectName: project?.name}}
            >
              <ArrowRight />
              <span>{project?.name || 'Project Name'}</span>
            </Link>
          </>
        }
      >
        <Link to={'/'}>Project</Link>
      </Heading>

      <div className='m-5'>
        <Modal>
          <DeleteModal title={'instance'} deleteById={deleteInstance} />
        </Modal>
        <div className="mb-8 flex items-center justify-between">
          <h1 className=" text-2xl font-semibold">Instances</h1>
          <Button fullWidth={false} size="sm" onClick={openDrawer}>
            <div className="flex items-center gap-2">
              <Plus />
              Create Instance
            </div>
          </Button>
        </div>

        <div className="placeholder:*: relative shadow-md sm:rounded-lg">
          {loader ? (
            <ProjectCreateLoader title='Loading Instances'/>
          ) : (
            <table className="w-full text-left text-sm text-gray-500 rtl:text-right ">
              <thead className="bg-white text-sm uppercase text-gray-700 ">
                <tr>
                  {columns?.map((t) => (
                    <th scope="col" className="px-6 py-3" key={t}>
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {instances?.map((instance, index) => {
                  return (
                    <tr
                      className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                      key={instance.id}
                    >
                      <td className="px-6 py-4">
                        <Link 
                          to={`/instances/${params.projectId}/${instance?.instances?.isActive ? instance.instances.id : ''}`}
                          state={{...location.state, projectName: project?.name}}
                          className={`${instance?.instances?.isActive ? 'underline text-f-primary' : ''} font-medium`}
                        >
                          {instance?.instances?.name}{'   '}
                          {!instance?.instances?.isActive && <sup className='text-[#FF1212] text-sm'>draft</sup>}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(
                          Number(instance?.instances?.createdAt)
                        ).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">{instance?.instances?.valid ? 'Valid' : 'Not Valid'}</td>
                      <td className="px-6 py-4">{instance?.plant?.name}</td>
                      <td className="px-6 py-4">{instance?.instances?.id}</td>
                      <td className="px-6 py-4">
                        <span 
                          onClick={() => downloadInstance(instance?.instances?.id, instance?.instances?.name, instance?.instances?.isActive)}
                          className={`${instance?.instances?.isActive ? 'cursor-pointer' : ''}`}
                        >
                          <Download 
                            disabled={!instance?.instances?.isActive}
                          />
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Action
                          handleOpenModal = {handleOpenModal}
                          handleEdit = {handleEdit}
                          editIndex = {index}
                          id = {instance?.instances?.id}
                          setId = {setId}
                          allowDelete = {!instance?.instances?.isActive}
                        />
                      </td>
                    </tr>
                  );
                })}
                </tbody>
            </table>
          )}
        </div>

        {open && (<Drawer
          isOpen={open}
          handleClose={closeDrawer}
          title="Create a new instance"
          size="7xl"
          footer={
            <div className="grid w-full grid-cols-12">
              <div className="col-span-8 col-start-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {step > 1 && (
                    <Button
                      size="xs"
                      fullWidth={false}
                      variant="flat"
                      className="min-w-[150px]"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  )}

                  {step < 5 ? (
                    <Button
                      size="xs"
                      fullWidth={false}
                      className="min-w-[150px]"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button onClick={handleNext} size="xs" fullWidth={false} className="min-w-[150px]">
                      Finish
                    </Button>
                  )}
                </div>

                <Button
                  size="xs"
                  variant="flat"
                  fullWidth={false}
                  className="min-w-[150px]"
                  onClick={closeDrawer}
                >
                  Cancel
                </Button>
              </div>
            </div>
          }
        >
          <CreateInstanceDrawer editInstance={editIndex !== null && instances[editIndex]} childRefs = {childRefs} step={step} />
        </Drawer>)}
      </div>
    </>
  )
}

export default Instances
