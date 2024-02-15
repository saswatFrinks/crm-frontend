import React from 'react';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Radio from '@/shared/ui/Radio';
import Select from '@/shared/ui/Select';
import InputList from '@/shared/ui/InputList';
import Checkbox from '@/shared/ui/Checkbox';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';

const CreateProjectDrawer = React.forwardRef((props, ref) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      inspectionSpeed: 10,
      isCameraFixed: false,
      isItemFixed: false,
      plantId: '',
      teamId: '',
      objectives: [],
    },
    validate: (values) => {
      const errors = {};

      // Add your custom validation logic here
      if (!values.name) {
        errors.name = 'Project name is required';
      }

      if (values.inspectionSpeed <= 0) {
        errors.inspectionSpeed = 'Inspection speed must be greater than 0';
      }

      return errors;
    },
    onSubmit: async (values) => {
      console.log({ values });
      try {
        toast.success('Login successfully!');
      } catch (error) {
        toast.error(error.response.data.data.message);
      }
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

  const getClassNameTitle = (key) => {
    const obj = {
      assemblyInspection: 'Assembly Inspection',
      dimensioningInspection: 'Dimensioning Inspection',
      cosmeticInspection: 'Cosmetic Inspection',
    };

    return obj[key] ?? '';
  };

  React.useImperativeHandle(ref, () => ({
    submitForm() {
      formik.handleSubmit();
    },
  }));

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label className="mb-2">Project name</Label>
        <Input
          placeholder="Enter project name"
          type="text"
          name="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          errorMessage={formik.errors.name}
        />
      </div>

      <div>
        <Label className="mb-2">Inspection speed (products/minute)</Label>
        <Input
          placeholder="Enter Inspection Speed"
          type="number"
          name="inspectionSpeed"
          min={1}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.inspectionSpeed}
          errorMessage={formik.errors.inspectionSpeed}
        />
      </div>

      <div>
        <Label className="mb-2">Camera mount</Label>
        <div className="flex gap-8">
          <div className="flex gap-2">
            <Radio
              id="fixed"
              name="isCameraFixed"
              value="fixed"
              checked={formik.values.isCameraFixed == 'fixed'}
              onChange={formik.handleChange}
            />{' '}
            <Label htmlFor="fixed" main={false}>
              Fixed
            </Label>
          </div>
          <div className="flex gap-2">
            <Radio
              id="robo"
              name="isCameraFixed"
              value="robo"
              checked={formik.values.isCameraFixed == 'robo'}
              onChange={formik.handleChange}
            />
            <Label htmlFor="robo" main={false}>
              Robo
            </Label>
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-2">Product flow</Label>
        <div className="flex gap-8">
          <div className="flex gap-2">
            <Radio
              value="stationary"
              name="isItemFixed"
              id="stationary"
              checked={formik.values.isItemFixed == 'stationary'}
              onChange={formik.handleChange}
            />
            <Label htmlFor="stationary" main={false}>
              Stationary
            </Label>
          </div>
          <div className="flex gap-2">
            <Radio
              value="moving"
              name="isItemFixed"
              id="moving"
              checked={formik.values.isItemFixed == 'moving'}
              onChange={formik.handleChange}
            />{' '}
            <Label htmlFor="moving" main={false}>
              Moving
            </Label>
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-2">Add variants</Label>
        <InputList placeholder="Enter variants" />
      </div>

      <div>
        <Label className="mb-2">Plant</Label>
        <Select />
      </div>

      <div>
        <Label className="mb-2">Team</Label>
        <Select />
      </div>

      <div>
        <Label className="mb-2">Select Objective</Label>
        <div className="flex gap-4">
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

      {formik.values.objectives.map((t) => (
        <div key={t}>
          <Label className="mb-2">
            Add classes for {getClassNameTitle(t)}{' '}
          </Label>
          <InputList placeholder="Enter class" />
        </div>
      ))}
    </form>
  );
});

CreateProjectDrawer.displayName = 'CreateProjectDrawer';
export default CreateProjectDrawer;
