/* eslint-disable no-prototype-builtins */
import ArrowRight from '@/shared/icons/ArrowRight';

import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import Result from './Result';
import Detail from './Detail';
import React, { useEffect } from 'react';
import axiosInstance from '@/core/request/aixosinstance';
import Evaluation from './Evaluation';
import toast from 'react-hot-toast';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '@/shared/states/modal.state';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import Button from '@/shared/ui/Button';

export default function AIDetail() {
  const { hash } = useLocation();
  const params = useParams();
  const nav = useNavigate()

  const [modelInfo, setModelInfo] = React.useState(null);
  const [datasets, setDatasets] = React.useState(null);
  const [loader, setLoader] = React.useState(false);
  const [modalInfo, setModalInfo] = React.useState([])
  const setModalOpen = useSetRecoilState(modalAtom)

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

  React.useEffect(() => {
    const checkModelEvaluated = async () => {
      try {
        const response = await axiosInstance.get('/model/validated', {
          params: {
            modelId: params.modelId,
          },
        });
        if (!response.data.data.valid) {
          console.log('Not a valid modal', response.data.data)
          setModalInfo(response.data?.data?.missing || []);
          setModalOpen(true)
        }
      } catch (e) {
        toast.error('Invalid request');
      }
    };
    setModalOpen(false);
    checkModelEvaluated();
  }, []);

  const tabs = [
    {
      title: 'Training Results',
      fragment: '#result',
    },
    {
      title: 'Evaluation Results',
      fragment: '#evaluation',
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
    '#evaluation': <Evaluation />,
  };

  return (
    <>
      <Modal>
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <h3 className="font-semibold">Insufficient Training Data</h3>
        </div>
        <ModalBody>
          Some of the output files of the model training are not generated due to insufficient training data used. Below is the list of such missing files:
          <br/>
            {modalInfo.map((entry, i)=><h4 key={i} className="font-semibold">{i+1}. {entry}</h4>)}
          <br/>
          We recommend using at least 100 images per configuration to train the model correctly.
          </ModalBody>
        <ModalFooter><Button onClick={()=>{nav('../', {replace: true, relative: true}); setModalOpen(false)}}>OK</Button></ModalFooter>
      </Modal>
      <div className="mb-6 flex items-center gap-2">
        <h1
          className="cursor-pointer text-2xl font-semibold"
          onClick={() => {
            window.location.assign('../assembly');
          }}
        >
          AI Models
        </h1>{' '}
        <ArrowRight />{' '}
        <span className="text-lg font-medium">Model {modelInfo?.name}</span>
      </div>

      <div className="border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <ul className="-mb-px flex flex-wrap">
          {tabs.map((t) => (
            <li key={t.fragment} className="me-2">
              <NavLink
                to={t.fragment}
                className={`${hash == t.fragment ? 'border-f-primary hover:border-f-primary' : 'border-transparent hover:border-gray-300'} inline-block rounded-t-lg border-b-2 p-4  text-lg  hover:text-gray-600 dark:hover:text-gray-300`}
              >
                {t.title}{' '}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white">
        <div
          className="p-10"
          style={{
            width: '90%',
            margin: '0 auto',
          }}
        >
          {tabObj[hash]}
        </div>
      </div>
    </>
  );
}
