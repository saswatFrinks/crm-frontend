import axiosInstance from '@/core/request/aixosinstance';
import ArrowRight from '@/shared/icons/ArrowRight';
import ChevronDown from '@/shared/icons/ChevronDown';
import ChevronUp from '@/shared/icons/ChevronUp';
import Heading from '@/shared/layouts/main/heading';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import { removeDuplicates } from '@/util/util';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useParams } from 'react-router-dom';
import Dropdown from './Dropdown';

const IndividualInstance = () => {
  const location = useLocation();
  const params = useParams();

  const [loader, setLoader] = useState(false);
  const [instance, setInstance] = useState(null);
  const [project, setProject] = useState(null);
  const [modelData, setModelData] = useState([]);
  const [selectedModels, setSelectedModels] = useState(new Map());
  const [selectedPrimaryModels, setSelectedPrimaryModels] = useState(new Map());
  const [classColors, setClassColors] = useState(new Map());
  const [camera, setCamera] = useState(new Map());
  const [roiData, setRoiData] = useState(null);
  const [open, setOpen] = useState(new Map());
  const [primaryOpen, setPrimaryOpen] = useState(new Map());
  const [tableData, setTableData] = useState([]);

  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get('/project', {
        params: {
          projectId: params.projectId,
        },
      });
      setProject(res?.data?.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.data?.message || 'Cannot fetch project details'
      );
    }
  };

  const fetchInstanceData = async () => {
    try {
      const cameraIps = new Map();
      const response = await axiosInstance.get('/instance', {
        params: {
          instanceId: params.instanceId,
        },
      });

      setInstance(response?.data?.data?.instance);
      const instanceCameras = response?.data?.data?.cameras;
      instanceCameras?.forEach((cam) => {
        cameraIps.set(cam.id, cam.cameraIp);
      });
      setCamera(cameraIps);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await axiosInstance.get('/roi/models', {
        params: {
          instanceId: params.instanceId,
        },
      });
      const responseData = await response?.data?.data;
      setColors(responseData);

      const primaryModels = [];

      const mappingData = await responseData?.map((d) => {
        d?.models?.forEach(mo => {
          if(mo?.isTracker)primaryModels.push(mo?.id);
        })
        return {
          variantName: d.variantName,
          variantId: d.variantId,
          cameraPositionName: d.capturePositionName,
          cameraPositionId: d.capturePositionId,
          cameraConfigName: d.cameraConfigName,
          cameraConfigId: d.cameraConfigId,
          roiName: d.roiName,
          roiId: d.roiId,
          cameraId: d.linkedCamera.id,
          captureOrder: d.linkedCamera.captureOrder,
          classes: d.classes,
          models: d.models,
        }
      });

      const uniqueEntries = removeDuplicates(await mappingData);
      setModelData(uniqueEntries);
      await getSelectedModels(primaryModels);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message);
    }
  };

  const getSelectedModels = async (primaryModels) => {
    const res = await axiosInstance.get('/instance/deployed-models', {
      params: {
        instanceId: params.instanceId,
      },
    });

    const mapping = res?.data?.data;
    const newMap = new Map();
    const newRoiMap = new Map();
    mapping.forEach((m) => {
      if(primaryModels.includes(m.detectionModelId)){
        newRoiMap.set(m.roiId, m.detectionModelId);
      }else{
        newMap.set(m.roiId, m.detectionModelId);
      }
    });
    setSelectedModels(newMap);
    setSelectedPrimaryModels(newRoiMap);
  };

  const setColors = (modelsData) => {
    let classesData = [];
    let classes = new Map();
    modelsData.forEach((data) => {
      classesData = [...classesData, ...data?.classes];
      if(data?.primaryClass){
        classesData.push({
          ...data?.primaryClass,
          name: data?.primaryClass?.className
        })
      }
    });

    const uniqueClasses = removeDuplicates(classesData);
    uniqueClasses.forEach((data, i) => {
      classes.set(data?.id, {
        name: data?.name,
        color: `color-${(i % 10) + 1}`,
      });
    });

    setClassColors(classes);
  };

  const fetchAllData = async () => {
    setLoader(true);
    await fetchInstanceData();
    await fetchModels();
    await fetchProject();
    setLoader(false);
  };

  const openCloseDropdown = (roiId) => {
    openCloseRoi(roiId, !open.get(roiId));
  };

  const openCloseRoi = (roiId, flag) => {
    setOpen((prev) => {
      const newMap = new Map(prev);
      newMap.set(roiId, flag);
      return newMap;
    });
  };

  const openClosePrimaryDropdown = (roiId) => {
    openClosePrimaryRoi(roiId, !primaryOpen.get(roiId));
  };

  const openClosePrimaryRoi = (roiId, flag) => {
    setPrimaryOpen((prev) => {
      const newMap = new Map(prev);
      newMap.set(roiId, flag);
      return newMap;
    });
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    setTableData(Array.from({ length: 2 * modelData.length }, () => {}));
  }, [modelData]);

  const getAlignment = (column) => {
    switch (column) {
      case 'Capture Order':
      case 'ROI':
        return 'text-right';
      case 'Variant Name':
        return 'text-left';
      default:
        return 'text-center';
    }
  };

  const columns = [
    'Variant Name',
    'Camera Position',
    'Camera IP',
    'Camera Configuration',
    'Capture Order',
    'ROI',
  ];

  const isMoving = !project?.isItemFixed;

  return (
    <>
      <Heading
        subcontent={
          <>
            <Link
              to={`/instances/${params.projectId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>{location.state?.projectName || 'Project Name'}</span>
            </Link>
            <Link
              to={`/instances/${params.projectId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>Instances</span>
            </Link>
            <Link
              to={location.pathname}
              className="flex items-center gap-2"
              state={location.state}
            >
              <ArrowRight />
              <span>{instance?.name || 'Instance Name'}</span>
            </Link>
          </>
        }
      >
        <Link to={'/'}>Project</Link>
      </Heading>
      {loader ? (
        <ProjectCreateLoader title="Fetching Instance Details" />
      ) : (
        <div className="flex flex-col">
          <div className="flex-1 overflow-y-auto px-10 py-8">
            <table className="w-[80%] w-full text-left text-sm text-gray-500 rtl:text-right">
              <thead className="bg-white text-sm text-gray-700 ">
                <tr>
                  {columns?.map((t) => (
                    <th className={`px-6 py-3 ${getAlignment(t)}`} key={t}>
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData?.map((tableRow, index) => {
                  const data = index % 2 === 0 ? modelData[index / 2] : null;
                  if (!data) {
                    return (
                      open.get(modelData[(index - 1) / 2].roiId) && (
                        <Dropdown
                          data={modelData[(index - 1) / 2]}
                          classColors={classColors}
                          selectedModels={selectedModels}
                          key={index}
                        />
                      )
                    );
                  }
                  return (
                    <tr className="border-b bg-white" key={index}>
                      <td className="px-6 py-4">{data.variantName}</td>
                      <td className="px-6 py-4 text-center">
                        {data.cameraPositionName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {camera.get(data.cameraId)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {data.cameraConfigName}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {data.captureOrder}
                      </td>
                      <td
                        className="px-6 py-4 text-right"
                        onClick={() => openCloseDropdown(data.roiId)}
                      >
                        <div className="flex cursor-pointer items-center justify-end">
                          {data.roiName}
                          {open.get(data.roiId) ? (
                            <ChevronUp className={'text-sm'} />
                          ) : (
                            <ChevronDown className={'text-sm'} />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {isMoving && (
            <div className="flex-1 overflow-y-auto px-10 py-8 mt-8">
              <table className="w-[80%] w-full text-left text-sm text-gray-500 rtl:text-right">
                <thead className="bg-white text-sm text-gray-700 ">
                  <tr>
                    {columns?.map((t) => (
                      <th className={`px-6 py-3 ${getAlignment(t)}`} key={t}>
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((tableRow, index) => {
                    const data = index % 2 === 0 ? modelData[index / 2] : null;
                    if (!data) {
                      return (
                        primaryOpen.get(modelData[(index - 1) / 2].roiId) && (
                          <Dropdown
                            data={modelData[(index - 1) / 2]}
                            classColors={classColors}
                            selectedModels={selectedPrimaryModels}
                            isPrimary = {true}
                          />
                        )
                      );
                    }
                    return (
                      <tr className="border-b bg-white">
                        <td className="px-6 py-4">{data.variantName}</td>
                        <td className="px-6 py-4 text-center">
                          {data.cameraPositionName}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {camera.get(data.cameraId)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {data.cameraConfigName}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {data.captureOrder}
                        </td>
                        <td
                          className="px-6 py-4 text-right"
                          onClick={() => openClosePrimaryDropdown(data.roiId)}
                        >
                          <div className="flex cursor-pointer items-center justify-end">
                            {data.roiName}
                            {primaryOpen.get(data.roiId) ? (
                              <ChevronUp className={'text-sm'} />
                            ) : (
                              <ChevronDown className={'text-sm'} />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default IndividualInstance;
