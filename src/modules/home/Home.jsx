import Heading from '@/shared/layouts/main/heading';
import Drawer from '@/shared/ui/Drawer';
import Project from '@/shared/ui/ProjectCard';
import React from 'react';
import CreateProjectDrawer from './CreateProjectDrawer';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
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
        <ModalHeader>Confirmation Message</ModalHeader>

        <ModalBody>
          <p>
            The project <span className="font-semibold">#Project Name</span> and
            assosiated date will be permanently deleted, do you want to
            continue?
          </p>
        </ModalBody>

        <ModalFooter>
          <div className="ml-auto flex w-2/3 items-center gap-4">
            <Button size="xs" color="flat" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button size="xs" s>
              Delete
            </Button>
          </div>
        </ModalFooter>
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
        footer={
          <div className="flex w-2/3 items-end justify-end gap-2 ">
            <Button
              size="xs"
              color="flat"
              fullWidth={false}
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              size="xs"
              fullWidth={false}
              onClick={ref.current?.submitForm()}
            >
              Creat Project
            </Button>
          </div>
        }
      >
        <CreateProjectDrawer ref={ref} closeDrawer={closeDrawer} />
      </Drawer>
    </>
  );
}
