import Checkbox from '@/shared/ui/Checkbox';
import Input from '@/shared/ui/Input';
import InputFile from '@/shared/ui/InputFile';
import Label from '@/shared/ui/Label';
import { useFormik } from 'formik';
import React from 'react';

const AddCameraConfigurationDrawer = React.forwardRef((props, ref) => {
  const inputRef = React.useRef(null);

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
      console.log(values);

      // change to form data
      const data = new FormData();

      data.append('name', values.name);

      values.objectives.forEach((t) => {
        data.append('objectives', t);
      });

      data.append('file', inputRef.current?.selectedFile);
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
        <Label className="mb-2">Camera configuration name</Label>
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
          // onChange={formik.handleChange}
          // onBlur={formik.handleBlur}
          // value={formik.values.name}
          // errorMessage={formik.errors.name}
        />
      </div>
      <div>
        <Label className="mb-2">Select Objective</Label>
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
