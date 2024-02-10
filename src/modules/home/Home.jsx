import Heading from '@/shared/layouts/main/heading';
import Drawer from '@/shared/ui/Drawer';
import Project from '@/shared/ui/ProjectCard';
import React from 'react';
import CreateProjectDrawer from './CreateProjectDrawer';
import Modal from '@/shared/ui/Modal';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '@/shared/states/modal.state';
import { IoClose } from 'react-icons/io5';
import Button from '@/shared/ui/Button';

export default function Home() {
  const [open, setOpenDrawer] = React.useState(false);

  const setOpenModal = useSetRecoilState(modalAtom);

  const ref = React.useRef();

  const closeDrawer = () => {
    setOpenDrawer(false);
  };

  const openDrawer = () => {
    setOpenDrawer(true);
  };

  return (
    <>
      <Modal>
        <div className="w-full max-w-lg rounded-md bg-white shadow-lg">
          <div className="flex items-center justify-between border-b-[1px] p-5">
            <h3 className="font-semibold">Confirmation Message</h3>
            <IoClose
              size={16}
              className="cursor-pointer"
              onClick={() => setOpenModal(false)}
            />
          </div>
          <div className="p-5">
            <p>
              The project <span className="font-semibold">#Project Name</span> and
              assosiated date will be permanently deleted, do you want to
              continue?
            </p>
          </div>
          <div className=" border-t-[1px]  p-5">
            <div className="ml-auto flex w-2/3 items-center gap-4">
              {' '}
              <Button
                size="xs"
                color="flat"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
              <Button size="xs" s>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Heading>Project</Heading>

      <div className="flex  flex-wrap gap-6 p-6">
        <Project.Create onClick={openDrawer} />

        {Array(10)
          .fill(1)
          .map((t, i) => (
            <Project.Card key={i} />
          ))}
      </div>

      <Drawer
        isOpen={open}
        handleClose={closeDrawer}
        title={'Create a new project'}
        handleSubmit={() => {
          ref.current?.submitForm();
        }}
      >
        <CreateProjectDrawer ref={ref} closeDrawer={closeDrawer} />
      </Drawer>
    </>
  );
}
