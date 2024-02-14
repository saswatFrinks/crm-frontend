import Checkbox from '@/shared/ui/Checkbox';
import Input from '@/shared/ui/Input';
import InputFile from '@/shared/ui/InputFile';
import Label from '@/shared/ui/Label';
import { useFormik } from 'formik';
import React from 'react';

const AddCameraConfigurationDrawer = React.forwardRef((props, ref) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      file: null,
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
      console.log(values);
    },
  });

  React.useImperativeHandle(ref, () => ({
    submitForm() {
      return formik.handleSubmit();
    },
  }));

  return (
    <div>
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
        <Label>Camera configuration file</Label>
        <InputFile
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          errorMessage={formik.errors.name}
        />
      </div>
      <div>
        <Label>Select Objective</Label>
        <div className="flex gap-2">
          <Checkbox
            id="assemblyInspection"
            value="assemblyInspection"
            name="objectives"
            checked={false}
            // checked={formik.values.objectives.includes('assemblyInspection')}
            // onChange={() => handleCheckboxChange('assemblyInspection')}
            htmlFor="assemblyInspection"
          />
          <Label htmlFor="assemblyInspection" main={false}>
            Assembly Inspection
          </Label>
        </div>
        <div className="flex gap-2">
          <Checkbox
            id="assemblyInspection"
            value="assemblyInspection"
            name="objectives"
            checked={false}
            // checked={formik.values.objectives.includes('assemblyInspection')}
            // onChange={() => handleCheckboxChange('assemblyInspection')}
            htmlFor="assemblyInspection"
          />
          <Label htmlFor="assemblyInspection" main={false}>
            Cosmetic Inspection
          </Label>
        </div>
        <div className="flex gap-2">
          <Checkbox
            id="assemblyInspection"
            value="assemblyInspection"
            name="objectives"
            checked={false}
            // checked={formik.values.objectives.includes('assemblyInspection')}
            // onChange={() => handleCheckboxChange('assemblyInspection')}
            htmlFor="assemblyInspection"
          />
          <Label htmlFor="assemblyInspection" main={false}>
            Dimensioning Inspection
          </Label>
        </div>
      </div>
    </div>
  );
});

export default AddCameraConfigurationDrawer;
