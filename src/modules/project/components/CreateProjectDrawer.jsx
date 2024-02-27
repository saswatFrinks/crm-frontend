import React from 'react';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Radio from '@/shared/ui/Radio';
import Select from '@/shared/ui/Select';
import InputList from '@/shared/ui/InputList';
import Checkbox from '@/shared/ui/Checkbox';
import { useFormik } from 'formik';
import axiosInstance from '@/core/request/aixosinstance';
import { getOrganizationId } from '@/util/util';
import storageService from '@/core/storage';

const CreateProjectDrawer = React.forwardRef((props, ref) => {
  const { closeDrawer, setShowLoader, fetchAllProjects } = props;
  const [plants, setPlants] = React.useState([]);
  const [teams, setTeams] = React.useState([]);
  const user = JSON.parse(storageService.get('user'));

  const fetchAllPlants = async () => {
    const res = await axiosInstance.get('/plant/getList', {
      params: {
        organizationId: getOrganizationId(),
      },
    });

    setPlants(res.data.data);
  };

  const fetchAllTeams = async () => {
    const res = await axiosInstance.get('/team/getList', {
      params: {
        organizationId: getOrganizationId(),
      },
    });

    setTeams(res.data.data);
  };

  React.useEffect(() => {
    fetchAllPlants();
    fetchAllTeams();
  }, []);

  const getPlantDropDown = () => {
    if (user.plantId) {
      return [{ id: user.plantId, name: user.plantName }];
    } else {
      return [{ id: '', name: 'Select' }, ...plants];
    }
  };

  const getTeamDropDown = () => {
    if (user.teamId) {
      return [{ id: user.teamId, name: user.teamName }];
    } else {
      return [{ id: '', name: 'Select' }, ...teams];
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      inspectionSpeed: 10,
      isCameraFixed: false,
      isItemFixed: false,
      plantId: user.plantId,
      teamId: user.teamId,
      objectives: [],
      variants: [],
      assemblyInspection: [],
      dimensioningInspection: [],
      cosmeticInspection: [],
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = 'Project name is required';
        return errors;
      }

      if (values.inspectionSpeed <= 0) {
        errors.inspectionSpeed = 'Inspection speed must be greater than 0';
        return errors;
      }

      if (!values.isCameraFixed) {
        errors.camera = 'Camera mount is mandatory';
        return errors;
      }

      if (!values.isItemFixed) {
        errors.item = 'Product flow is mandatory';
        return errors;
      }

      if (values.variants.length <= 1) {
        errors.variants = 'One variant is required';
        return errors;
      }

      if (!values.plantId) {
        errors.plantId = 'Plant name is required';
        return errors;
      }

      if (!values.teamId) {
        errors.teamId = 'Team name is required';
        return errors;
      }

      if (values.objectives.length === 0) {
        errors.objectives = 'Minimum one objective mandatory';
        return errors;
      }

      if (
        values.objectives.includes('assemblyInspection') &&
        values.assemblyInspection.length <= 1
      ) {
        errors.assemblyInspection = 'Minimum one class is mandatory';
        return errors;
      }

      if (
        values.objectives.includes('dimensioningInspection') &&
        values.dimensioningInspection.length <= 1
      ) {
        errors.dimensioningInspection = 'Minimum one class is mandatory';
        return errors;
      }

      if (
        values.objectives.includes('cosmeticInspection') &&
        values.cosmeticInspection.length <= 1
      ) {
        errors.cosmeticInspection = 'Minimum one class is mandatory';
        return errors;
      }

      return errors;
    },
    onSubmit: async (values) => {
      setShowLoader(true);
      const projectJson = createProjectJSON(values);
      await axiosInstance.post('/project/create', projectJson);
      setShowLoader(false);
      closeDrawer();
      fetchAllProjects();
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

    json['variants'] = values.variants
      .filter((variant) => variant.value.length > 0)
      .map((variant) => variant.value);

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
        {formik.errors.camera ? (
          <p className="text-xs text-red-500">{formik.errors.camera}</p>
        ) : null}
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
        {formik.errors.item ? (
          <p className="text-xs text-red-500">{formik.errors.item}</p>
        ) : null}
      </div>

      <div>
        <Label>Add variants</Label>
        <InputList
          placeholder="Enter variants"
          formik={formik}
          field="variants"
        />
        {formik.errors.variants ? (
          <p className="text-xs text-red-500">{formik.errors.variants}</p>
        ) : null}
      </div>

      <div>
        <Label>Plant</Label>
        <Select
          options={getPlantDropDown()}
          formik={formik}
          field="plantId"
          errorMessage={formik.errors.plantId}
        />
      </div>

      <div>
        <Label>Team</Label>
        <Select
          options={getTeamDropDown()}
          formik={formik}
          field="teamId"
          errorMessage={formik.errors.teamId}
        />
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
        {formik.errors.objectives ? (
          <p className="text-xs text-red-500">{formik.errors.objectives}</p>
        ) : null}
      </div>

      {formik.values.objectives.map((t) => (
        <div key={t}>
          <Label>Add classes for {getClassNameTitle(t)} </Label>
          <InputList placeholder="Enter class" formik={formik} field={t} />
          {formik.errors[t] ? (
            <p className="text-xs text-red-500">{formik.errors[t]}</p>
          ) : null}
        </div>
      ))}
    </form>
  );
});

CreateProjectDrawer.displayName = 'CreateProjectDrawer';
export default CreateProjectDrawer;
