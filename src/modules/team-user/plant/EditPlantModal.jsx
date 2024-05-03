import axiosInstance from '@/core/request/aixosinstance';
import { modalAtom } from '@/shared/states/modal.state';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { getOrganizationId } from '@/util/util';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useSetRecoilState } from 'recoil';

export default function EditPlantModal({ plant, fetchAllPlants }) {
  const setOpenModal = useSetRecoilState(modalAtom);
  const formik = useFormik({
    initialValues: {
      name: plant.name || '',
      location: plant.location || '',
    },
    validate: (values) => {
      const errors = {};

      // Add your custom validation logic here
      if (!values.name) {
        errors.name = 'Plant name is required';
      }

      if (!values.location) {
        errors.location = 'Plant location is required';
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        await axiosInstance.put('/plant', {
					plantId: plant.id,
          name: values.name,
          location: values.location,
        });
        fetchAllPlants();
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <>
      <ModalHeader>Edit plant</ModalHeader>
      <ModalBody>
        <div className="mb-4">
          <Label>Plant Name</Label>
          <Input
            placeholder="Enter plant name"
            type="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            errorMessage={formik.errors.name}
          />
        </div>
        <div>
          <Label>Plant Location</Label>
          <Input
            placeholder="Enter plant location"
            type="location"
            name="location"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.location}
            errorMessage={formik.errors.location}
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
          <Button size="xs" fullWidth={true} onClick={() => {
            formik.handleSubmit()
            setOpenModal(false)
          }}>
            Confirm
          </Button>
        </div>
      </ModalFooter>
    </>
  );
}
