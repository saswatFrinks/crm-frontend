/* eslint-disable no-prototype-builtins */
import ArrowRight from '@/shared/icons/ArrowRight';

import { NavLink, useLocation, useParams } from 'react-router-dom';
import Result from './Result';
import Detail from './Detail';
import React, { useEffect } from 'react';
import axiosInstance from '@/core/request/aixosinstance';

export default function AIDetail() {
  const { hash } = useLocation();
  const params = useParams();

  const [modelInfo, setModelInfo] = React.useState(null);
  const [datasets, setDatasets] = React.useState(null);
  const [loader, setLoader] = React.useState(false);

  const fetchModelInfo = async (id) => {
    setLoader(true);
    try {
      const resp = await axiosInstance.get('/model/model-data', {
        params: {
          modelId: id,
        },
      });
      const temp = resp.data.data;
      temp.augmentations = JSON.parse(resp.data.data.augmentations);
      const datasetMap = {};
      resp.data.data.datasets.map((item) => {
        if (!datasetMap.hasOwnProperty(item.cameraConfigId)) {
          datasetMap[item.cameraConfigId] = {
            datasetInfo: {
              variantName: item.variantName,
              capturePositionName: item.capturePositionName,
              cameraConfigName: item.cameraConfigName,
            },
            datasets: [],
          };
        }
        datasetMap[item.cameraConfigId]['datasets'].push(item);
      });
      console.log('datasetMap:', datasetMap);
      setModelInfo({ ...temp });
      setDatasets({ ...datasetMap });
      setLoader(false);
    } catch (e) {
      setLoader(false);
    }
  };

  React.useEffect(() => {
    fetchModelInfo(params.modelId);
  }, [params.modelId]);

  const tabs = [
    {
      title: 'Training Results',
      fragment: '#result',
    },
    {
      title: 'Model Details',
      fragment: '#detail',
    },
  ];

  const tabObj = {
    '#result': <Result />,
    '#detail': (
      <Detail modelInfo={modelInfo} datasets={datasets} loader={loader} />
    ),
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <h1
          className="cursor-pointer text-2xl font-semibold"
          onClick={() => {
            window.location.assign('../assembly');
          }}
        >
          AI Models
        </h1>{' '}
        <ArrowRight /> <span>Model {modelInfo?.name}</span>
      </div>

      <div className="border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <ul className="-mb-px flex flex-wrap">
          {/* {tabs.map((t) => (
            <li key={t.fragment} className="me-2">
              <NavLink
                to={t.fragment}
                className={`${hash == t.fragment ? 'border-f-primary hover:border-f-primary' : 'border-transparent hover:border-gray-300'} inline-block rounded-t-lg border-b-2  p-4  hover:text-gray-600 dark:hover:text-gray-300`}
              >
                {t.title}{' '}
              </NavLink>
            </li>
          ))} */}
        </ul>
      </div>

      <div className="p-4">{tabObj[hash]}</div>
    </>
  );
}
