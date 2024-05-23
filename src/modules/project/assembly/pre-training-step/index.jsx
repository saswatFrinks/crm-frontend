// import { useState } from "react";
// import { useRecoilValue } from "recoil";
// import { annotationMapAtom, assemblyAtom, imageDimensionAtom, rectanglesAtom, uploadedFileListAtom } from "../../state";
// import { cloneDeep } from "lodash";
// import { RECTANGLE_TYPE } from "@/core/constants";
// import axiosInstance from "@/core/request/aixosinstance";

import axiosInstance from '@/core/request/aixosinstance';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { assemblyAtom } from '../../state';
import { useRecoilState } from 'recoil';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import { classOptionsAtom } from '../../project-configuration/state';

const statusEnum = {
  not_started: 0,
  started: 1,
  running: 2,
  completed: 3,
  errored: 4,
};

export default function PreTrainingStep() {
  const columns = ['ROI', '', 'Positive', 'Negative'];
  const [loader, setLoader] = useState(null);
  const [starter, setStarter] = useState(false);
  const [info, setInfo] = useState({});
  const [roiMap, setRoiMap] = useState({});
  const params = useParams();
  const eventSourceRef = useRef();
  // const [configuration] = useRecoilState(assemblyAtom);
  const [classOptions] = useRecoilState(classOptionsAtom);
  const [classMap, setClassMap] = useState({});

  const helper = async () => {
    const tempRoiMap = {};
    const res = await axiosInstance.get('/configuration/rois', {
      params: { configurationId: params.configurationId },
    });
    const resp=JSON.parse(res.data.data.data)
    resp.map((configItem) => {
      console.log("configItem:",configItem)
      tempRoiMap[configItem.id]=configItem.name
    });
    setRoiMap({ ...tempRoiMap });
    const tempClassMap = {};
    classOptions.map((item) => {
      tempClassMap[item.id] = item.name;
    });
    setClassMap({ ...tempClassMap });
    setLoader('Starting pre-training analysis, please wait...');
    try {
      console.log('params:', params);
      await axiosInstance.get('/recommender/start', {
        params: {
          configId: params.configurationId,
        },
      });
      // startSSE();
      setStarter(true);
    } catch (e) {
      console.error('Error in pre training helper:', e);
      toast.error(e?.response?.data?.data?.message);
    }
  };

  const startSSE = () => {
    console.log('started SSE');
    eventSourceRef.current = new EventSource(
      `${import.meta.env.VITE_BASE_API_URL}/recommender/sse`,
      { withCredentials: true }
    );
    const sse = eventSourceRef.current;
    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Got sse data:', data);
      if (data.config_id == params.configurationId) {
        if (Number(data.status) == statusEnum['completed']) {
          const ret = [];
          const temp = data.roi;
          Object.keys(temp).map((item) => {
            const roiName = roiMap[item];
            const obj = temp[item];
            ret.push([roiName, 'All classes', obj['positive'], obj['negative']]);
            delete obj['positive'];
            delete obj['negative'];
            const tempObj = {};
            Object.keys(obj).map((innerVal) => {
              const values = innerVal.split('_');
              const currVal = tempObj[values[0]] || {};
              tempObj[values[0]] = { ...currVal, [values[1]]: obj[innerVal] };
            });
            Object.keys(tempObj).map((finalKey) => {
              console.log('finalKey:', finalKey);
              ret.push([
                roiName,
                classMap[finalKey] || 'Invalid class ID',
                tempObj[finalKey]['positive'],
                tempObj[finalKey]['negative'],
              ]);
            });
          });
          console.log('ret:', ret);
          setInfo([...ret]);
          setStarter(false);
          setLoader(null);
        } else if (Number(data.status) == statusEnum['running']) {
          setLoader(
            'Pre-training analysis in progress. This may take around 2 minutes...'
          );
        } else if (Number(data.status) == statusEnum['started']) {
          setLoader('Starting pre-training analysis, please wait...');
        } else if (Number(data.status) == statusEnum['errored']) {
          toast.error(data.error);
          setLoader(null);
        }
      }
    };
  };

  useEffect(() => {
    helper();
  }, []);

  useEffect(() => {
    console.log('loader:', loader);
  }, [loader]);

  useEffect(()=>{
    if(starter){
      startSSE()
    }
  },[starter])

  return (
    <>
      {loader !== null ? (
        <ProjectCreateLoader title={loader} />
      ) : (
        <div className="flex flex-col gap-4">
          <h3 className="text-center text-2xl font-semibold">
            Your project is configured!{' '}
          </h3>
          <p className="text-center text-lg">
            Below are the data recommendations for good training results:
          </p>
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
              {info &&
                info?.length &&
                info.map((roiRow, index) => {
                  return (
                    <tr
                      key={index}
                      className="border-b odd:bg-white even:bg-[#C6C4FF]/10"
                    >
                      {roiRow.map((item, ind) => {
                        return (
                          <td className="px-6 py-4" key={ind}>
                            {item}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
