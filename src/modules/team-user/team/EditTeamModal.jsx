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

export default function EditTeamModal({ team, fetchAllTeams }) {
  const setOpenModal = useSetRecoilState(modalAtom);
  const formik = useFormik({
    initialValues: {
      name: team.name || '',
    },
    validate: (values) => {
      const errors = {};

      // Add your custom validation logic here
      if (!values.name) {
        errors.name = 'team name is required';
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        if(Object.values(formik.errors).some(error => error.length > 0))return;
        await axiosInstance.put('/team/rename', {
					teamId: team.id,
          name: values.name,
        });
        setOpenModal(false)
        fetchAllTeams();
      } catch (error) {
        toast.error(error?.response?.data?.data?.details);
      }
    },
  });

  if(!team)return <></>;

  return (
    <>
      <ModalHeader>Edit team</ModalHeader>
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
