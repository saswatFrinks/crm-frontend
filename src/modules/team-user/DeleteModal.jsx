import { modalAtom } from '@/shared/states/modal.state';
import Button from '@/shared/ui/Button';
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import React from 'react';
import { useSetRecoilState } from 'recoil';

function DeleteModal({ deleteById }) {
  const setOpenModal = useSetRecoilState(modalAtom);

  return (
    <>
      <ModalHeader>Confirmation Message</ModalHeader>

      <ModalBody>
        <p>
          The project <span className="font-semibold">#name</span> and
          assosiated date will be permanently deleted, do you want to continue?
        </p>
      </ModalBody>

      <ModalFooter>
        <div className="ml-auto flex w-2/3 items-center gap-4">
          <Button size="xs" color="flat" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button
            size="xs"
            onClick={() => {
              setOpenModal(false);
              deleteById()
            }}
          >
            Delete
          </Button>
        </div>
      </ModalFooter>
    </>
  );
}

export default DeleteModal;
