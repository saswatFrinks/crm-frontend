import { modalAtom } from '@/shared/states/modal.state';
import Button from '@/shared/ui/Button';
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import React from 'react';
import { useSetRecoilState } from 'recoil';

function DeleteModal({ deleteById, title = '', para = null }) {
  const setOpenModal = useSetRecoilState(modalAtom);

  return (
    <>
      <ModalHeader>Confirmation Message</ModalHeader>

      <ModalBody>
        {para && para != '' ? (
          <p>{para}</p>
        ) : (
          <p>
            The {`${title || 'project'}`} and
            assosiated date will be permanently deleted, do you want to continue?
          </p>
        )}
      </ModalBody>

      <ModalFooter>
        <div className="ml-auto flex w-2/3 items-center gap-4">
          <Button size="xs" variant='flat' color="flat" onClick={() => setOpenModal(false)}>
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
