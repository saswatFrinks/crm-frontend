import { modalAtom } from '@/shared/states/modal.state';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import DeleteModal from './DeleteModal';
import Modal from '@/shared/ui/Modal';
import Button from '@/shared/ui/Button';
import { FaPlus } from 'react-icons/fa6';
import Action from './Action';
import Drawer from '@/shared/ui/Drawer';
import CreateUserDrawer from './CreateProjectDrawer';
import { IoIosSend } from 'react-icons/io';

export default function User() {
  const columns = ['User name', 'Email id', 'Phone Number', 'Plant', 'Team'];
  const setModalState = useSetRecoilState(modalAtom);

  const ref = React.useRef(null);

  const [action, setAction] = React.useState('delete');

  const [open, setOpenDrawer] = React.useState(false);

  const closeDrawer = () => {
    setOpenDrawer(false);
  };

  const openDrawer = () => {
    setOpenDrawer(true);
  };

  const renderModalAction = () => {
    const obj = {
      delete: <DeleteModal />,
    };

    return obj[action];
  };

  const handleOpenModal = () => {
    setModalState(true);
  };

  return (
    <>
      <Modal>{renderModalAction()}</Modal>

      <div>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Users</h1>
          <Button fullWidth={false} size="xs" onClick={openDrawer}>
            <div className="flex items-center gap-2">
              <FaPlus />
              Add user
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
              <tr className="border-b odd:bg-white even:bg-gray-50  ">
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                >
                  Apple MacBook Pro 17
                </th>
                <td className="px-6 py-4">some text</td>
                <td className="px-6 py-4">some text</td>
                <td className="px-6 py-4">some text</td>
                <td className="px-6 py-4">some text</td>

                <td className="px-6 py-4">
                  <Action handleOpenModal={handleOpenModal} hasReset={true} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Drawer
        isOpen={open}
        handleClose={closeDrawer}
        title={'Create a new project'}
        size="xs"
        footer={
          <div className="flex w-2/3 items-end justify-end gap-2 ">
            <Button size="xs" color="flat" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button size="xs" onClick={ref.current?.submitForm()}>
              <div className="flex items-center justify-center gap-2">
                <IoIosSend />
                Send Invite
              </div>
            </Button>
          </div>
        }
      >
        <CreateUserDrawer ref={ref} />
      </Drawer>
    </>
  );
}
