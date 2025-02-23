import { modalAtom } from '@/shared/states/modal.state';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useSetRecoilState } from 'recoil';
import axiosInstance from '@/core/request/aixosinstance';
import { getOrganizationId } from '@/util/util';

export default function AddTeamModal({fetchTeamNames}) {
  const setOpenModal = useSetRecoilState(modalAtom);

  const formik = useFormik({
    initialValues: {
      name: '',
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
        console.log(values);
        if(Object.values(formik.errors).some(error => error.length > 0))return;
        await axiosInstance.post('/team/create', {
          name: values.name,
          organizationId: getOrganizationId()
        })
        setOpenModal(false)
        fetchTeamNames()
      } catch (error) {
        toast.error(error?.response?.data?.data?.details?.userMessage || error?.response?.data?.data?.message);
      }
    },
  });

  return (
    <>
      <ModalHeader>Add team</ModalHeader>
      <ModalBody>
        <div className="mb-4">
          <Label>Team Name</Label>
          <Input
            placeholder="Enter team name"
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
          <Button size="xs" fullWidth={true} onClick={() => {
            formik.handleSubmit() 
          }}>
            Confirm
          </Button>
        </div>
      </ModalFooter>
    </>
  );
}
