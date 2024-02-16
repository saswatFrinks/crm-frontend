import React from 'react';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Radio from '@/shared/ui/Radio';
import Select from '@/shared/ui/Select';
import InputList from '@/shared/ui/InputList';
import Checkbox from '@/shared/ui/Checkbox';
import { useFormik } from 'formik';
import axiosInstance from '@/core/request/aixosinstance';

const CreateProjectDrawer = React.forwardRef((props, ref) => {
  const {closeDrawer} = props;
  const formik = useFormik({
    initialValues: {
      name: '',
      inspectionSpeed: 10,
      isCameraFixed: false,
      isItemFixed: false,
      plantId: '',
      teamId: '',
      objectives: [],
      variants: [],
      assemblyInspection: [],
      dimensioningInspection: [],
      cosmeticInspection: [],
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

      values.plantId = 'fb90acb7-3130-4d9a-92ae-1a02a6baf327'
      values.teamId = 'd7625654-7ab1-48ec-ba91-003b8ad0aed9'

      const projectJson = createProjectJSON(values);

      await axiosInstance.post('/project/create', projectJson)
      closeDrawer()
    },
  });

  const createProjectJSON = (values) => {
    const json = {
      name: values.name,
      inspectionSpeed: values.inspectionSpeed,
      isCameraFixed: values.isCameraFixed == 'fixed',
      isItemFixed: values.isItemFixed == 'stationary',
      plantId: values.plantId,
      teamId: values.teamId,
    };

    json['variants'] = values.variants.slice(1).map((variant) => variant.value);

    const map = new Map();

    addClassesToMap(values.assemblyInspection, map, 0);
    addClassesToMap(values.dimensioningInspection, map, 1);
    addClassesToMap(values.cosmeticInspection, map, 2);

    const classes = [];

    for (let [key, value] of map) {
      classes.push({
        name: key,
        objectives: value,
      });
    }

    json['classes'] = classes;
    return json;
  };

  const addClassesToMap = (classes, map, id) => {
    for (const classObj of classes) {
      if (classObj.value) {
        if (map.has(classObj.value)) {
          map.get(classObj.value).push(id);
        } else {
          map.set(classObj.value, [id]);
        }
      }
    }
  };

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
        <Label>Project name</Label>
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
        <Label>Inspection speed (products/minute)</Label>
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
        <Label>Camera mount</Label>
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
        <Label>Product flow</Label>
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
        <Label>Add variants</Label>
        <InputList
          placeholder="Enter variants"
          formik={formik}
          field="variants"
        />
      </div>

      <div>
        <Label>Plant</Label>
        <Select />
      </div>

      <div>
        <Label>Team</Label>
        <Select />
      </div>

      <div>
        <Label>Select Objective</Label>
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
          <Label>Add classes for {getClassNameTitle(t)} </Label>
          <InputList placeholder="Enter class" formik={formik} field={t} />
        </div>
      ))}
    </form>
  );
});

CreateProjectDrawer.displayName = 'CreateProjectDrawer';
export default CreateProjectDrawer;
