import { modalAtom } from '@/shared/states/modal.state';
import Button from '@/shared/ui/Button';
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { useSetRecoilState } from 'recoil';

function DeleteObjectModal({ handleSubmit }) {
  const setOpenModal = useSetRecoilState(modalAtom);

  return (
    <>
      <ModalHeader>Delete Object</ModalHeader>

      <ModalBody>
        <p>
          The Object and associated data will be permanently deleted, do you
          want to continue?
        </p>
      </ModalBody>

      <ModalFooter>
        <div className="ml-auto flex w-2/3 items-center gap-4">
          <Button size="xs" variant="flat" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button
            size="xs"
            color="danger"
            onClick={() => {
              handleSubmit();
              setOpenModal(false);
            }}
          >
            Delete
          </Button>
        </div>
      </ModalFooter>
    </>
  );
}

export default DeleteObjectModal;
