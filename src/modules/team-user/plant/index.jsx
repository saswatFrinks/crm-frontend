import Button from '@/shared/ui/Button';
import React from 'react';
import { FaPlus } from 'react-icons/fa6';
import Action from '../Action';
import Modal from '@/shared/ui/Modal';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '@/shared/states/modal.state';
import AddPlantModal from './AddPlantModal';
import DeleteModal from '../DeleteModal';
import { getOrganizationId } from '@/util/util';
import axiosInstance from '@/core/request/aixosinstance';
import EditPlantModal from './EditPlantModal';

export default function Plants() {
  const columns = ['Plant Name', 'Location'];
  const setModalState = useSetRecoilState(modalAtom);

  const [action, setAction] = React.useState('add');
  const [id, setId] = React.useState('')
  const [editIndex, setEditIndex] = React.useState(null);
  const [plants, setPlants] = React.useState([]);

  const deletePlant = async () => {
    if(id) {
      await axiosInstance.delete('/plant/', {
        params: {
          plantId: id
        }
      })
      setId('')
      fetchAllPlants()
    }
  }

  const fetchAllPlants = async () => {
    const res = await axiosInstance.get('/plant/getList', {
      params: {
        organizationId: getOrganizationId(),
      },
    });
    setPlants(res.data.data);
  };

  React.useEffect(() => {
    fetchAllPlants();

    return () => setModalState(false);
  }, []);

  const renderModalAction = () => {
    const obj = {
      add: <AddPlantModal fetchAllPlants={fetchAllPlants}/>,
      delete: <DeleteModal deleteById={deletePlant}/>,
      edit: <EditPlantModal fetchAllPlants={fetchAllPlants} plant={plants[editIndex]}/>
    };

    return obj[action];
  };

  const handleOpenModal = (type) => {
    setAction(type);
    setModalState(true);
  };

  const handleEdit = (index) => {
    handleOpenModal('edit')
    setEditIndex(index)
  }

  return (
    <>
      <Modal>{renderModalAction()}</Modal>

      <div>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Plants</h1>
          <Button
            fullWidth={false}
            size="xs"
            onClick={() => handleOpenModal('add')}
          >
            <div className="flex items-center gap-2">
              <FaPlus />
              Add plant
            </div>
          </Button>
        </div>

        <div className="placeholder:*: relative shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right ">
            <thead className="bg-white text-sm uppercase text-gray-700 ">
              <tr>
                {columns.map((t) => (
                  <th scope="col" className="px-6 py-3" key={t}>
                    {t}
                  </th>
                ))}

                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {plants.map((plant,i) => {
                return (
                  <tr className="border-b bg-white" key={plant.id}>
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                    >
                      {plant.name}
                    </th>
                    <td className="px-6 py-4">{plant.location}</td>
                    <td className="px-6 py-4">
                      <Action handleOpenModal={handleOpenModal} id={plant.id} setId={setId} editIndex={i} handleEdit={handleEdit}/>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
