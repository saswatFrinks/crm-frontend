import { modalAtom } from '@/shared/states/modal.state';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import AddTeamModal from './AddTeamModal';
import DeleteModal from './DeleteModal';
import Modal from '@/shared/ui/Modal';
import Button from '@/shared/ui/Button';
import { FaPlus } from 'react-icons/fa6';
import Action from './Action';
import axiosInstance from '@/core/request/aixosinstance';
import { getOrganizationId } from '@/util/util';

export default function Teams() {
  const columns = ['Team Name'];
  const setModalState = useSetRecoilState(modalAtom);

  const [action, setAction] = React.useState('add');
  const [teamNames, setTeamNames] = React.useState([]);

  const fetchTeamNames = async () => {
    const res = await axiosInstance.get('/team/getList', {
      params: {
        organizationId: getOrganizationId(),
      },
    });

    setTeamNames(res.data.data);
  };

  React.useEffect(() => {
    fetchTeamNames();
  }, []);

  const renderModalAction = () => {
    const obj = {
      add: <AddTeamModal fetchTeamNames={fetchTeamNames}/>,
      delete: <DeleteModal />,
    };

    return obj[action];
  };

  const handleOpenModal = (type) => {
    setAction(type);
    setModalState(true);
  };

  return (
    <>
      <Modal>{renderModalAction()}</Modal>

      <div>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Plants</h1>
          <Button
            fullWidth={false}
            size="xs"
            onClick={() => handleOpenModal('add')}
          >
            <div className="flex items-center gap-2">
              <FaPlus />
              Add team
            </div>
          </Button>
        </div>

        <div className="placeholder:*: relative shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right ">
            <thead className="bg-white text-xs uppercase text-gray-700 ">
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
              {teamNames.map((teamName, index) => {
                return (
                  <tr className="border-b odd:bg-white even:bg-gray-50  " key={index}>
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                    >
                      {teamName.name}
                    </th>
                    <td className="px-6 py-4">
                      <Action handleOpenModal={handleOpenModal} />
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
