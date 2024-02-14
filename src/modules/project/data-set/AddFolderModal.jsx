import axiosInstance from '@/core/request/aixosinstance';
import { modalAtom } from '@/shared/states/modal.state';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

export default function AddFolderModal() {
  const setOpenModal = useSetRecoilState(modalAtom);
  const {pathname} = useLocation();

  const addFolder = async (values) => {
    const cameraConfigId = pathname.split("/")[8];
    await axiosInstance.post('/dataset/create', {
      cameraConfigId: 'f2d207ee-053c-40f5-8910-917d48f478c2',
      folderName: values.name,
    });
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validate: (values) => {
      const errors = {};

      // Add your custom validation logic here
      if (!values.name) {
        errors.name = 'Folder name is required';
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        addFolder(values);
        setOpenModal(false);
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <>
      <ModalHeader>Create Dataset Folder</ModalHeader>
      <ModalBody>
        <div className="mb-4">
          <Label>Folder name</Label>
          <Input
            placeholder="Enter folder name"
            type="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            errorMessage={formik.errors.name}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="ml-auto flex w-3/5 items-center justify-end gap-4">
          <Button
            size="xs"
            color="flat"
            fullWidth={true}
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>
          <Button size="xs" fullWidth={true} onClick={formik.handleSubmit}>
            Confirm
          </Button>
        </div>
      </ModalFooter>
    </>
  );
}
