import axiosInstance from '@/core/request/aixosinstance';
import ArrowRight from '@/shared/icons/ArrowRight';
import Setting from '@/shared/icons/Setting';
import Heading from '@/shared/layouts/main/heading';
import Button from '@/shared/ui/Button';
import Radio from '@/shared/ui/Radio';
import React, { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedConfigurationAtom } from './state';
import { assemblyAtom, labelClassAtom, polygonsAtom, rectanglesAtom } from '../state';
import { loadedLabelsAtom, stepAtom } from '../assembly/state';
import { removeDuplicateFromArray } from '@/util/util';
import Modal from '@/shared/ui/Modal';
import { modalAtom } from '@/shared/states/modal.state';
import toast from 'react-hot-toast';
import { DEFAULT_ASSEMBLY } from '@/core/constants';

const columns = [
  '',
  'Variant Name',
  'Camera Position',
  'Camera Configuration',
  'Objective',
  'Configuration Status',
  'Pre-training Analysis',
];

const preTrainingColumns = ['ROI', 'Images with', 'Positive', 'Negative'];

const preAnalysisStatusMap = [
  {
    color: 'red',
    label: 'Result Unavailable',
    disabled: true,
    tooltip: 'Project configuration is still incomplete',
  },
  {
    color: 'yellow',
    label: 'Analysis Started',
    disabled: true,
    tooltip: 'Project analysis has started',
  },
  {
    color: 'yellow',
    label: 'In progress',
    disabled: true,
    tooltip:
      'Pre-analysis training is in progress. Please check back in 1 minute.',
  },
  { color: 'green', label: 'Analysis Complete', disabled: false, tooltip: '' },
  {
    color: 'red',
    label: 'Result Unavailable',
    disabled: true,
    tooltip: 'We encountered some error while running pre analysis',
  },
];

export default function ProjectConfiguration() {
  const params = useParams();
  const location = useLocation();
  // console.log(location)

  const [configurations, setConfigurations] = React.useState([]);
  const [open, setOpen] = React.useState(null);
  const [modal, setModal] = useRecoilState(modalAtom);
  const [preTrainingData, setPreTrainingData] = React.useState([]);
  const setRectangles = useSetRecoilState(rectanglesAtom);
  const setPolygons = useSetRecoilState(polygonsAtom);
  const setSteps = useSetRecoilState(stepAtom);
  const setLabelsLoaded = useSetRecoilState(loadedLabelsAtom);
  const setConfiguration = useSetRecoilState(assemblyAtom);

  const [selectedConfiguration, setSelectedConfiguration] = useRecoilState(
    selectedConfigurationAtom
  );

  const getConfigurations = async () => {
    try {
      const res = await axiosInstance.get('/configuration/list', {
        params: {
          projectId: params.projectId,
        },
      });
      setConfigurations(removeDuplicateFromArray(res.data.data, 'id'));
    } catch (error) {
      console.error(
        'Got error trying to get configurations for the project:',
        error
      );
      toast.error(error.response.data.data.message);
    }
  };

  useEffect(() => {
    getConfigurations();
    setRectangles([]);
    setPolygons([]);
    setSteps(0);
    setLabelsLoaded(Array.from({ length: 10 }, () => false));
    setConfiguration(DEFAULT_ASSEMBLY);
  }, []);

  const getValidationForConfiguration = async (configId) => {
    try {
      const res = await axiosInstance.get('/recommender/pre-analysis-data', {
        params: {
          configId: configId,
        },
      });
      const ret = [];
      const temp = res.data.data.rois;
      const classNameMap = res.data.data.classes;
      Object.keys(temp).map((item) => {
        const roiName = item;
        const obj = JSON.parse(temp[item]);
        if (obj && Object.keys(obj).length > 4) {
          ret.push([roiName, 'All classes', obj['positive'], obj['negative']]);
        }
        delete obj['positive'];
        delete obj['negative'];
        const tempObj = {};
        let totalPositive = 0;
        let totalNegative = 0;
        Object.keys(obj).map((innerVal) => {
          const values = innerVal.split('_');
          const currVal = tempObj[values[0]] || {};
          tempObj[values[0]] = { ...currVal, [values[1]]: obj[innerVal] };
        });
        Object.keys(tempObj).map((finalKey) => {
          // console.log(finalKey);
          totalPositive += Number(tempObj[finalKey]['positive']);
          totalNegative += Number(tempObj[finalKey]['negative']);
          ret.push([
            roiName,
            classNameMap[finalKey] || 'Invalid class ID',
            tempObj[finalKey]['positive'],
            tempObj[finalKey]['negative'],
          ]);
        });
        if (obj && Object.keys(obj).length > 4) {
          ret.push([roiName, 'Total', '', totalPositive + totalNegative]);
        }
      });
      console.log('ret:', ret);
      setPreTrainingData([...ret]);
    } catch (e) {
      toast.error(e?.response?.data?.data?.message);
    } finally {
      setModal(true);
    }
  };

  useEffect(() => {
    if (open != null) {
      getValidationForConfiguration(open);
    }
  }, [open]);

  useEffect(() => {
    if (!modal) {
      setOpen(null);
    }
  }, [modal]);

  return (
    <>
      {open !== null && (
        <Modal>
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right ">
            <thead className="bg-white text-sm uppercase text-gray-700 ">
              <tr>
                {preTrainingColumns.map((t) => (
                  <th scope="col" className="px-6 py-3" key={t}>
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preTrainingData &&
                preTrainingData?.length &&
                preTrainingData.map((roiRow, index) => {
                  return (
                    <tr
                      key={index}
                      className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                    >
                      {roiRow.map((item, ind) => {
                        return (
                          <td key={ind} className="px-6 py-4">
                            {item}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Modal>
      )}
      <Heading
        subcontent={
          <>
            <Link
              to={`/project/${params.projectId}`}
              className="flex items-center gap-2"
              state={location.state}
            >
              <ArrowRight />
              <span>{location.state?.projectName}</span>
            </Link>
          </>
        }
      >
        <Link to="/" className="mb-8">
          Project
        </Link>
      </Heading>

      <div className="p-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className=" text-2xl font-semibold">Project Configuration</h1>
          <Button
            fullWidth={false}
            size="xs"
            disabled={selectedConfiguration.id === ''}
          >
            <div>
              {selectedConfiguration.id ? (
                <Link
                  state={location.state}
                  className="flex items-center gap-2"
                  to={`${selectedConfiguration.objective.toLowerCase()}/${selectedConfiguration.id}`}
                >
                  <Setting /> {'Start Configuration'}
                </Link>
              ) : (
                <span className="flex items-center gap-2">
                  <Setting /> {'Start Configuration'}
                </span>
              )}
            </div>
          </Button>
        </div>

        <div className="placeholder:*: relative shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right ">
            <thead className="bg-white text-sm uppercase text-gray-700 ">
              <tr>
                {columns.map((t) => (
                  <th scope="col" className="px-6 py-3" key={t}>
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {configurations.map((config, index) => {
                return (
                  <tr
                    className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                    key={config.id}
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 "
                    >
                      <Radio
                        value="stationary"
                        name="isItemFixed"
                        id="stationary"
                        checked={selectedConfiguration.id === config.id}
                        onClick={(e) => {
                          setSelectedConfiguration({
                            id: config.id,
                            objective: config.objective,
                          });
                        }}
                      />
                    </th>
                    <td className="px-6 py-4">{config.variant}</td>
                    <td className="px-6 py-4">{config.cameraPosition}</td>
                    <td className="px-6 py-4">{config.cameraConfig}</td>
                    <td className="px-6 py-4">{config.objective}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`${config.status == 'Pending' ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {config.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-${preAnalysisStatusMap[Number(config.analysisStatus)].color}-500
                         ${preAnalysisStatusMap[Number(config.analysisStatus)].disabled ? 'underLine' : ''}`}
                      >
                        <button
                          className={`color-${preAnalysisStatusMap[Number(config.analysisStatus)].color}-500`}
                          style={{
                            cursor: preAnalysisStatusMap[
                              Number(config.analysisStatus)
                            ].disabled
                              ? 'default'
                              : 'pointer',
                          }}
                          onClick={() => {
                            if (
                              preAnalysisStatusMap[
                                Number(config.analysisStatus)
                              ].disabled
                            ) {
                              return;
                            }
                            setOpen(config.id);
                          }}
                        >
                          {
                            preAnalysisStatusMap[Number(config.analysisStatus)]
                              .label
                          }
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
