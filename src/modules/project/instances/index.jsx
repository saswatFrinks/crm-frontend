import axiosInstance from '@/core/request/aixosinstance'
import Plus from '@/shared/icons/Plus'
import Button from '@/shared/ui/Button'
import Drawer from '@/shared/ui/Drawer'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CreateInstanceDrawer from './CreateInstanceDrawer'
import { useRecoilState } from 'recoil'
import { addInstanceAtom, defaultAddInstanceValue } from './state'
import toast from 'react-hot-toast'
import Action from '@/modules/team-user/Action'
import { modalAtom } from '@/shared/states/modal.state'
import Modal from '@/shared/ui/Modal'
import DeleteModal from '@/modules/team-user/DeleteModal'
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader'
import Chip from '@/shared/ui/Chip'

const Instances = () => {
  const params = useParams();
  const [instances, setInstances] = useState([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [editIndex, setEditIndex] = useState(null);
  const [id, setId] = useState('');
  const [addInstance, setAddInstance] = useRecoilState(addInstanceAtom);
  const [modalOpen, setModalOpen] = useRecoilState(modalAtom);
  const [loader, setLoader] = useState(false);
  
  const childRefs = Array.from({length: 5}, () => React.useRef({}));
  
  const handleNext = async () => {
    try {
      if(childRefs[step-1].current){
        await childRefs[step-1].current.handleSubmit();
      }
      setStep((t) => {
        if (t == 5) {
          closeDrawer();
          return 1;
        }
        return t + 1;
      });
    } catch (error) {
      toast.error(error.message)
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
      console.log({
        instanceId: id
      })
      await axiosInstance.delete('/instance/delete-draft', {
        params: {
          instanceId: id
        }
      });
    } catch (error){
      toast.error(error?.response?.data?.data?.message)
    }
  }

  useEffect(() => {
    fetchAllInstances()
  }, [])

  const columns = ['Instance Name', 'Date Created', 'Validity', 'Plant', 'Instance ID', 'Download', '']

  return (
    <div>
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
                      {instance?.instances?.name}{'   '}
                      {!instance?.instances?.isActive && <sup className='text-[#FF1212] text-sm'>draft</sup>}
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
  )
}

export default Instances
