import axiosInstance from '@/core/request/aixosinstance';
import { modalAtom } from '@/shared/states/modal.state';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useSetRecoilState } from 'recoil';

export default function EditVariantModal({ fetchAllVariants, editVariant }) {
  const setOpenModal = useSetRecoilState(modalAtom);

  const addVariants = async (values) => {
    await axiosInstance.put('/variant/edit', {
      variantId: editVariant.id,
      name: values.name,
    });
    fetchAllVariants();
  };

  const formik = useFormik({
    initialValues: {
      name: editVariant.name,
    },
    validate: (values) => {
      const errors = {};

      // Add your custom validation logic here
      if (!values.name) {
        errors.name = 'Team name is required';
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        addVariants(values);
        setOpenModal(false);
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <>
      <ModalHeader>Edit product variant</ModalHeader>
      <ModalBody>
        <div className="mb-4">
          <Label>Variant Name</Label>
          <Input
            placeholder="Enter the variant name"
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