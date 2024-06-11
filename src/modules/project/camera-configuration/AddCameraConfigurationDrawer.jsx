import axiosInstance from '@/core/request/aixosinstance';
import { modalAtom } from '@/shared/states/modal.state';
import Button from '@/shared/ui/Button';
import Checkbox from '@/shared/ui/Checkbox';
import Input from '@/shared/ui/Input';
import InputFile from '@/shared/ui/InputFile';
import Label from '@/shared/ui/Label';
import Modal, { ModalBody, ModalHeader } from '@/shared/ui/Modal';
import { validateRegexString } from '@/util/util';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

const objectivesModulesMapping = {
  assemblyInspection: 'Assembly',
  cosmeticInspection: 'Cosmetic',
  dimensioningInspection: 'Dimensioning',
};

const AddCameraConfigurationDrawer = React.forwardRef((props, ref) => {
  const inputRef = React.useRef(null);
  const params = useParams();
  const { closeDrawer, fetchAllCameraConfigs, editConfig } = props;
  const [initialObjectives, setInitialObjectives] = useState([]);
  const [openConfirm, setOpenConfirm] = useRecoilState(modalAtom)
  const [draftData, setDraftData] = useState(null);

  const objectivesMap = {
    assemblyInspection: 0,
    cosmeticInspection: 1,
    dimensioningInspection: 2,
  };

  const fetchAllClasses = async () => {
    const objectives = [];
    let res = await axiosInstance.get('/class/list', {
      params: {
        projectId: params.projectId,
      },
    });
    if (res.data.data.length > 0) objectives.push('assemblyInspection');

    res = await axiosInstance.get('/cosmetic/list', {
      params: {
        projectId: params.projectId,
      },
    });
    if (res.data.data.length > 0) objectives.push('cosmeticInspection');

    res = await axiosInstance.get('/dimensioning/list', {
      params: {
        projectId: params.projectId,
      },
    });
    if (res.data.data.length > 0) objectives.push('dimensioningInspection');

    formik.setValues({
      ...formik.values,
      objectives,
    });
    setInitialObjectives(objectives);

  };

  const formik = useFormik({
    initialValues: {
      name: '',
      order: '',
      objectives: [],
    },
    validate: (values) => {
      const errors = {};

      // Add your custom validation logic here
      if (!values.name) {
        errors.name = 'Camera configuration name is required';
      }

      if(formik.touched.name && values.name && validateRegexString(values.name) !== ''){
        errors.name = validateRegexString(values.name);
      }

      return errors;
    },
    onSubmit: async (values) => {
      // change to form data
      try {
        const modules = [];

        values.objectives.forEach((t) => {
          modules.push(objectivesModulesMapping[t]);
        });
        let data = {
          name: values.name,
          order: values.order,
          modules: modules,
          capturePositionId: params.cameraPositionId,
        };
        if (editConfig) {
          delete data.capturePositionId;
          data = {
            ...data,
            cameraConfigId: editConfig.id,
          };
          await axiosInstance.put('/cameraConfig/edit', data);
        } else {
          const instanceStatus = await axiosInstance.get('/cameraConfig/instance-status', {
            params: {
              projectId: params.projectId 
            }
          })
          if(instanceStatus.data.data.data === 0){
            await axiosInstance.post('/cameraConfig/setup', data);
            afterSubmit();
          }else{
            setOpenConfirm(true);
            setDraftData(data);
          }
        }
      } catch (err) {
        toast.error(err.response.data.data.details);
      }
    },
  });

  const afterSubmit = () => {
    fetchAllCameraConfigs();
    closeDrawer();
    formik.setValues({'name': '', 'order': '', objectives: [...initialObjectives]})
  }

  const handleCheckboxChange = (value) => {
    if (!initialObjectives.includes(value)) return;
    if (formik.values.objectives.includes(value)) {
      formik.setValues({
        ...formik.values,
        objectives: formik.values.objectives.filter((item) => item !== value),
      });
    } else {
      formik.setValues({
        ...formik.values,
        objectives: [...formik.values.objectives, value],
      });
    }
  };

  const createAfterConfirm = async () => {
    try {
      await axiosInstance.post('/cameraConfig/setup', draftData);
      afterSubmit();
      setOpenConfirm(false);
      setDraftData(null)
    } catch(error) {
      toast.error(error?.response?.data?.data?.details)
    }
  }

  React.useImperativeHandle(ref, () => ({
    submitForm() {
      return formik.handleSubmit();
    },
  }));

  useEffect(() => {
    fetchAllClasses();
  }, [])

  React.useEffect(() => {
    if (editConfig) {
      formik.setValues({
        ...formik.values,
        name: editConfig?.name,
        order: editConfig?.order,
      });
    }
  }, [editConfig]);

  return (
    <div className="flex flex-col gap-4">
      {openConfirm && draftData && <Modal>
        <ModalHeader>Confirmation</ModalHeader>
        <ModalBody>
          <div className="mb-4 font-medium text-lg">
            There are existing Instances which are using the already created camera configurations. If you create a new
            camera configuration, this will move those Instances to drafts which then need to be reconfigured to include
            this new configuration, before they can be downloaded. Do you want to proceed to create this camera
            configuration (which will move those Instances to drafts) ?
          </div>
          <div className="flex items-center justify-center mt-4 gap-4">
            <Button
              onClick = {() => setOpenConfirm(false)}
              variant='flat'
            >
              Cancel
            </Button>
            <Button
              onClick = {createAfterConfirm}
            >
              Create
            </Button>
          </div>
        </ModalBody>
      </Modal>}
      <div>
        <Label>Camera configuration name</Label>
        <Input
          placeholder="Enter camera configuration name"
          type="name"
          name="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          errorMessage={formik.errors.name}
        />
      </div>
      <div>
        <Label htmlFor="file">Capture Order</Label>
        <Input
          placeholder="Enter Capture Order"
          type="number"
          name="order"
          min="0"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.order}
          errorMessage={formik.errors.order}
        />
      </div>
      <div>
        <Label>Select Objective</Label>
        <div className="flex gap-2">
          <Checkbox
            id="assemblyInspection"
            value="assemblyInspection"
            name="objectives"
            checked={
              formik.values.objectives.includes('assemblyInspection') ||
              (editConfig &&
                editConfig?.objectives.includes(
                  objectivesMap.assemblyInspection
                ))
            }
            disabled={!initialObjectives.includes('assemblyInspection')}
            onChange={() => handleCheckboxChange('assemblyInspection')}
            htmlFor="assemblyInspection"
          />
          <Label htmlFor="assemblyInspection" main={false}>
            Assembly Inspection
          </Label>
        </div>
        <div className="flex gap-2">
          <Checkbox
            id="cosmeticInspection"
            value="cosmeticInspection"
            name="objectives"
            checked={
              formik.values.objectives.includes('cosmeticInspection') ||
              (editConfig &&
                editConfig?.objectives.includes(
                  objectivesMap.cosmeticInspection
                ))
            }
            disabled={!initialObjectives.includes('cosmeticInspection')}
            onChange={() => handleCheckboxChange('cosmeticInspection')}
            htmlFor="cosmeticInspection"
          />
          <Label htmlFor="cosmeticInspection" main={false}>
            Cosmetic Inspection
          </Label>
        </div>
        <div className="flex gap-2">
          <Checkbox
            id="dimensioningInspection"
            value="dimensioningInspection"
            name="objectives"
            checked={
              formik.values.objectives.includes('dimensioningInspection') ||
               (
                editConfig &&
                  editConfig?.objectives.includes(
                    objectivesMap.dimensioningInspection
                  )
              )
            }
            disabled={!initialObjectives.includes('dimensioningInspection')}
            onChange={() => handleCheckboxChange('dimensioningInspection')}
            htmlFor="dimensioningInspection"
          />
          <Label htmlFor="dimensioningInspection" main={false}>
            Dimensioning Inspection
          </Label>
        </div>
      </div>
    </div>
  );
});

export default AddCameraConfigurationDrawer;
