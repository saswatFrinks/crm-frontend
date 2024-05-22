import axiosInstance from '@/core/request/aixosinstance'
import Plus from '@/shared/icons/Plus'
import Button from '@/shared/ui/Button'
import Drawer from '@/shared/ui/Drawer'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import CreateInstanceDrawer from './CreateInstanceDrawer'
import { useRecoilState } from 'recoil'
import { addInstanceAtom } from './state'
import toast from 'react-hot-toast'

const Instances = () => {
  const params = useParams();
  const [instances, setInstances] = useState([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const addInstance = useRecoilState(addInstanceAtom);
  
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
    setOpen(false);
  }

  const openDrawer = () => {
    setOpen(true);
  }
  const fetchAllInstances = async () => {
    const res = await axiosInstance.get('/instance/list', {
      params: {
        projectId: params.projectId,
      },
    })
    setInstances(res?.data?.data);
  };

  useEffect(() => {
    fetchAllInstances()
  }, [])

  const columns = ['Instance Name', 'Date Created', 'Validity', 'Plant', 'Instance ID', 'Download']

  return (
    <div>
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
            {instances?.map((instance) => {
              return (
                <tr
                  className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                  key={instance.id}
                >
                  <td className="px-6 py-4">{instance?.instances?.name}</td>
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
                </tr>
              );
            })}
            </tbody>
        </table>
      </div>

      <Drawer
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
        <CreateInstanceDrawer childRefs = {childRefs} step={step} />
      </Drawer>
    </div>
  )
}

export default Instances
