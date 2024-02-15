import axiosInstance from '@/core/request/aixosinstance';
import Checkbox from '@/shared/ui/Checkbox';
import Input from '@/shared/ui/Input';
import InputFile from '@/shared/ui/InputFile';
import Label from '@/shared/ui/Label';
import { useFormik } from 'formik';
import React from 'react';
import { useLocation } from 'react-router-dom';

const objectivesModulesMapping = {
  assemblyInspection: "Assembly",
  cosmeticInspection: "Cosmetic",
  dimensioningInspection: "Dimensioning"
}

const AddCameraConfigurationDrawer = React.forwardRef((props, ref) => {
  const inputRef = React.useRef(null);
  const {pathname} = useLocation();
  const {closeDrawer} = props

  const formik = useFormik({
    initialValues: {
      name: '',
      file: null,
      objectives: [],
    },
    validate: (values) => {
      const errors = {};

      // Add your custom validation logic here
      if (!values.name) {
        errors.name = 'Camera configuration name is required';
      }

      return errors;
    },
    onSubmit: async (values) => {
      // change to form data
      const data = new FormData();
      const cameraConfigId = pathname.split("/")[6];

      data.append('name', values.name);
      const modules = []

      values.objectives.forEach((t) => {
        modules.push(objectivesModulesMapping[t])
      });


      data.append('file', values.file);
      data.append('modules', JSON.stringify(modules));
      data.append('cameraConfigId', 'f2d207ee-053c-40f5-8910-917d48f478c2')

      await axiosInstance.post('/cameraConfig/setup', data)
      closeDrawer()
    },
  });

  const handleCheckboxChange = (value) => {
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

  React.useImperativeHandle(ref, () => ({
    submitForm() {
      return formik.handleSubmit();
    },
  }));

  return (
    <div className="flex flex-col gap-4">
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
        <Label htmlFor="file">Camera configuration file</Label>
        <InputFile
          ref={inputRef}
          formik={formik}
          //onChange={(event) => formik.setFieldValue('file', event.target.files)}
          // onBlur={formik.handleBlur}
          // value={formik.values.name}
          // errorMessage={formik.errors.name}
        />
      </div>
      <div>
        <Label>Select Objective</Label>
        <div className="flex gap-2">
          <Checkbox
            id="assemblyInspection"
            value="assemblyInspection"
            name="objectives"
            checked={formik.values.objectives.includes('assemblyInspection')}
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
            checked={formik.values.objectives.includes('cosmeticInspection')}
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
            checked={formik.values.objectives.includes(
              'dimensioningInspection'
            )}
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
