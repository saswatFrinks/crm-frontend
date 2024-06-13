import React, { useState } from 'react';
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
import { v4 as uuidv4, validate } from 'uuid';
import AutofilledDisabledInput from '@/shared/ui/AutofilledDisabledInput';
import toast, { Toaster } from 'react-hot-toast';
import Info from '@/shared/icons/Info';

const CreateProjectDrawer = React.forwardRef((props, ref) => {
  const { closeDrawer, setShowLoader, fetchAllProjects, projectToEdit } = props;
  const [plants, setPlants] = React.useState([]);
  const [teams, setTeams] = React.useState([]);
  const [variants, setVariants] = React.useState([]);
  const [assemblyClasses, setAssemblyClasses] = React.useState([]);
  const [cosmeticClasses, setCosmeticClasses] = React.useState([]);
  const [dimensionClasses, setDimensionClasses] = React.useState([]);

  const [hover, setHover] = useState("");
  const user = JSON.parse(storageService.get('user'));
  const inspectionTypes = [
    { id: '0', name: 'Fast' },
    { id: '1', name: 'Balanced' },
    { id: '2', name: 'Accurate' },
  ];

  const fetchAllVariants = async () => {
    if (!projectToEdit) return;
    const res = await axiosInstance.get('/variant/fetch', {
      params: {
        projectId: projectToEdit.id,
      },
    });
    setVariants(res.data.data);
  };

  const fetchAllClasses = async () => {
    if (!projectToEdit) return;

    const objectives = [];
    let res = await axiosInstance.get('/class/list', {
      params: {
        projectId: projectToEdit.id,
      },
    });
    if (res.data.data.length > 0) objectives.push('assemblyInspection');
    setAssemblyClasses(res.data.data);

    res = await axiosInstance.get('/cosmetic/list', {
      params: {
        projectId: projectToEdit.id,
      },
    });
    if (res.data.data.length > 0) objectives.push('cosmeticInspection');
    setCosmeticClasses(res.data.data);

    res = await axiosInstance.get('/dimensioning/list', {
      params: {
        projectId: projectToEdit.id,
      },
    });
    if (res.data.data.length > 0) objectives.push('dimensioningInspection');
    setDimensionClasses(res.data.data);

    formik.setValues({
      ...formik.values,
      objectives,
    });
  };

  const fetchAllPlants = async () => {
    const res = await axiosInstance.get('/plant/getList', {
      params: {
        organizationId: getOrganizationId(),
      },
    });
    const plantsFetched = res.data.data;

    setPlants(plantsFetched);
  };

  const fetchAllTeams = async () => {
    const res = await axiosInstance.get('/team/getList', {
      params: {
        organizationId: getOrganizationId(),
      },
    });
    const teamsFetched = res.data.data;

    setTeams(teamsFetched);
  };

  React.useEffect(() => {
    fetchAllPlants();
    fetchAllTeams();
    fetchAllVariants();
    fetchAllClasses();
  }, []);

  const getAutofilledObjectives = (value) => {
    switch (value) {
      case 'assemblyInspection':
        return assemblyClasses;
      case 'cosmeticInspection':
        return cosmeticClasses;
      case 'dimensioningInspection':
        return dimensionClasses;
      default:
        return [];
    }
  };

  const getPlantDropDown = () => {
    if (user?.plantId) {
      return [{ id: user?.plantId, name: user?.plantName }];
    } else {
      return [{ id: '', name: 'Select' }, ...plants];
    }
  };

  const getTeamDropDown = () => {
    if (user?.teamId) {
      return [{ id: user?.teamId, name: user?.teamName }];
    } else {
      return [{ id: '', name: 'Select' }, ...teams];
    }
  };

  const formik = useFormik({
    initialValues: {
      name: projectToEdit?.name || '',
      description: projectToEdit?.description || '',
      inspectionSpeed: projectToEdit?.inspectionSpeed || null,
      cameraCount: projectToEdit?.cameraCount || null,
      isCameraFixed: projectToEdit
        ? projectToEdit?.isCameraFixed
          ? 'fixed'
          : 'robo'
        : '',
      isItemFixed: projectToEdit
        ? projectToEdit?.isItemFixed
          ? 'stationary'
          : 'moving'
        : '',
      inspectionType: projectToEdit ? projectToEdit.inspectionType : '',
      plantId: user?.plantId,
      teamId: user?.teamId,
      objectives: [],
      variants: [],
      assemblyInspection: [],
      dimensioningInspection: [],
      cosmeticInspection: [],
    },
    validate: (values) => {
      const errors = {};
      if (formik.touched.name && !values.name) {
        errors.name = 'Project name is required';
      }

      if (formik.touched.description && !values.description) {
        errors.description = 'Project Description is required';
      }

      if (projectToEdit) return errors;

      if (formik.touched.inspectionSpeed && values.inspectionSpeed <= 0) {
        errors.inspectionSpeed = 'Inspection speed must be greater than 0';
      }

      if (formik.touched.isCameraFixed && !values.isCameraFixed) {
        errors.camera = 'Camera mount is mandatory';
      }

      if (formik.touched.isItemFixed && !values.isItemFixed) {
        errors.item = 'Product flow is mandatory';
      }

      if (
        formik.touched.variants &&
        values.variants.length <= 1 &&
        !variants.length
      ) {
        errors.variants = 'One variant is required';
      }

      if (formik.touched.inspectionType && !values.inspectionType) {
        errors.inspectionType = 'Inspection Type is required';
      }

      if (formik.touched.cameraCount && values.cameraCount <= 0) {
        errors.cameraCount = 'Number of camera must be greater than 0';
      }

      if (formik.touched.plantId && !values.plantId) {
        errors.plantId = 'Plant name is required';
      }

      if (formik.touched.teamId && !values.teamId) {
        errors.teamId = 'Team name is required';
      }

      if (formik.touched.objectives && values.objectives.length === 0) {
        errors.objectives = 'Minimum one objective mandatory';
      }

      if (
        formik.touched.assemblyInspection &&
        values.objectives.includes('assemblyInspection') &&
        values.assemblyInspection.length <= 1
      ) {
        errors.assemblyInspection = 'Minimum one class is mandatory';
      }

      if (
        formik.touched.dimensioningInspection &&
        values.objectives.includes('dimensioningInspection') &&
        values.dimensioningInspection.length <= 1
      ) {
        errors.dimensioningInspection = 'Minimum one class is mandatory';
      }

      if (
        formik.touched.cosmeticInspection &&
        values.objectives.includes('cosmeticInspection') &&
        values.cosmeticInspection.length <= 1
      ) {
        errors.cosmeticInspection = 'Minimum one class is mandatory';
      }

      return errors;
    },
    onSubmit: async (values) => {
      const errors = await formik.validateForm();
      const canContinue = Object.values(errors).every(
        (error) => error.length === 0
      );
      if (!canContinue) return;
      setShowLoader(true);
      let projectJson = createProjectJSON(values);
      try {
        if (projectToEdit) {
          projectJson = {
            projectId: projectToEdit.id,
            classes: projectJson.classes,
            variants: projectJson.variants,
            name: projectJson.name,
            description: projectJson.description,
          };
          await axiosInstance.put('/project/edit', projectJson);
        } else {
          await axiosInstance.post('/project/create', projectJson);
        }
        closeDrawer();
        await fetchAllProjects();
      } catch (error) {
        toast.error(error.response.data.data.message);
      } finally {
        setShowLoader(false);
      }
    },
  });

  const createProjectJSON = (values) => {
    const json = {
      name: values.name,
      description: values.description,
      inspectionSpeed: values.inspectionSpeed,
      isCameraFixed: values.isCameraFixed == 'fixed',
      isItemFixed: values.isItemFixed == 'stationary',
      plantId: values.plantId,
      teamId: values.teamId,
      inspectionType: Number(values.inspectionType),
      cameraCount: values.cameraCount,
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
    if (getAutofilledObjectives(value).length > 0) return;
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
        <Label>Project Description</Label>
        <Input
          placeholder="Enter project description"
          type="text"
          name="description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          errorMessage={formik.errors.description}
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
          disabled={!!projectToEdit}
          onKeyDown={(e) => {
            if (e.key === '.') e.preventDefault();
          }}
        />
      </div>

      <div>
        <Label>Number of Camera</Label>
        <Input
          placeholder="Enter number of camera"
          type="number"
          name="cameraCount"
          min={1}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.cameraCount}
          errorMessage={formik.errors.cameraCount}
          disabled={!!projectToEdit}
          onKeyDown={(e) => {
            if (e.key === '.') e.preventDefault();
          }}
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
              disabled={!!projectToEdit}
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
              disabled={!!projectToEdit}
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
              disabled={!!projectToEdit}
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
              disabled={!!projectToEdit}
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
        <Label>Inspection Requirement</Label>
        <div className="flex gap-8">
          {inspectionTypes.map((type) => {
            return (
              <div className="flex gap-2">
                <Radio
                  id={type.name}
                  name={'inspectionType'}
                  value={type.id}
                  checked={formik.values.inspectionType == type.id}
                  onChange={formik.handleChange}
                  disabled={!!projectToEdit}
                />{' '}
                <Label htmlFor={type.name} main={false}>
                  {type.name}
                </Label>
              </div>
            );
          })}
        </div>
        {formik.errors.inspectionType ? (
          <p className="text-xs text-red-500">{formik.errors.inspectionType}</p>
        ) : null}
      </div>

      <div>
        <div className="relative flex items-center gap-1">
          <Label>Add variants</Label>
          <div
            onMouseEnter={() => setHover("variant")}
            onMouseLeave={() => setHover("")}
            className="relative my-2"
          >
            <Info />
            {hover === "variant" && (
              <span className="absolute bottom-full left-1/2 mb-2 w-[250px] -translate-x-1/2 -translate-y-2 transform rounded-md bg-f-primary px-2 py-1 text-center text-sm text-white transition-opacity duration-300">
                Add the different names of the variants possible within this
                inspection project here
              </span>
            )}
          </div>
        </div>
        <div className="align-items-center flex flex-wrap gap-4">
          {projectToEdit &&
            variants?.map((variant) => {
              return <AutofilledDisabledInput value={variant.name} />;
            })}
          <InputList
            placeholder="Enter variants"
            formik={formik}
            field="variants"
          />
        </div>

        {formik.errors.variants ? (
          <p className="text-xs text-red-500">{formik.errors.variants}</p>
        ) : null}
      </div>

      {!projectToEdit && (
        <div>
          <Label>Plant</Label>
          <Select
            options={getPlantDropDown()}
            formik={formik}
            field="plantId"
            errorMessage={formik.errors.plantId}
          />
        </div>
      )}

      {!projectToEdit && (
        <div>
          <Label>Team</Label>
          <Select
            options={getTeamDropDown()}
            formik={formik}
            field="teamId"
            errorMessage={formik.errors.teamId}
          />
        </div>
      )}

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
          <div className="relative flex items-center gap-1">
            <Label>Add classes for {getClassNameTitle(t)} </Label>
            <div
              onMouseEnter={() => setHover("assembly")}
              onMouseLeave={() => setHover("")}
              className="relative my-2"
            >
              <Info />
              {hover === "assembly" && (
                <span className="absolute bottom-full left-1/2 mb-2 w-[280px] -translate-x-1/2 -translate-y-2 transform rounded-md bg-f-primary px-2 py-1 text-center text-sm text-white transition-opacity duration-300">
                  Add all the different objects as classes which you want to
                  inspect (including the Primary Object class) within this
                  inspection project here
                </span>
              )}
            </div>
          </div>

          <div className="align-items-center flex flex-wrap gap-4">
            {getAutofilledObjectives(t).map((objective) => {
              return <AutofilledDisabledInput value={objective.name} />;
            })}
            <InputList placeholder="Enter class" formik={formik} field={t} />
          </div>
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
