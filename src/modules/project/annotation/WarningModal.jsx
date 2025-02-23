import axiosInstance from '@/core/request/aixosinstance';
import { modalAtom } from '@/shared/states/modal.state';
import Button from '@/shared/ui/Button';
import { ModalBody, ModalHeader } from '@/shared/ui/Modal';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

const WarningModal = ({warningIndex, configId, config}) => {
  const params = useParams();
  const location = useLocation();
  const [preTrainingData, setPreTrainingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useRecoilState(modalAtom);
  const locationState= {
    variantName: config.variant,
    cameraPositionName: config.cameraPosition,
    cameraConfigName: config.cameraConfig,
    folderName: config?.datasetName
  }

  const columns = ['', 'Positive', 'Negative'];

  const warnings = [
    'Please, first, create a dataset folder for this camera configuration from the Build flow of this project. Then, upload the positive & negative images in this newly created dataset folder for this configuration according to the pre-training analysis result for this camera configuration.',
    'Please upload the positive & negative images in the mentioned dataset folder, within the table column Dataset, for this configuration according to the pre-training analysis result for this camera configuration.'
  ]

  const buttons = [
    {
      name: 'Create Dataset Folder',
      to: `/project/${params.projectId}/variant/${config.variantId}/camera-position/${config.cameraPositionId}/camera-config/${config.cameraConfigId}`
    }, 
    {
      name: 'Upload Images',
      to: `/project/${params.projectId}/variant/${config.variantId}/camera-position/${config.cameraPositionId}/camera-config/${config.cameraConfigId}/folder/${config.datasetId}`
    }
  ]

  const getValidationForConfiguration = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/recommender/pre-analysis-data', {
        params: {
          configId
        },
      });
      const ret = [];
      const temp = res.data.data.rois;
      const classNameMap = res.data.data.classes;
      Object.keys(temp).map((item) => {
        const obj = JSON.parse(temp[item]);
        ret.push(['Overall', obj['positive'], obj['negative']]);
        delete obj['positive'];
        delete obj['negative'];
        const tempObj = {};
        Object.keys(obj).map((innerVal) => {
          const values = innerVal.split('_');
          const currVal = tempObj[values[0]] || {};
          tempObj[values[0]] = { ...currVal, [values[1]]: obj[innerVal] };
        });
        Object.keys(tempObj).map((finalKey) => {
          console.log(finalKey);
          ret.push([
            classNameMap[finalKey] || 'Invalid class ID',
            tempObj[finalKey]['positive'],
            tempObj[finalKey]['negative'],
          ]);
        });
      });
      setPreTrainingData([...ret]);
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getValidationForConfiguration();

    return () => setOpen(false);
  }, [])

  return (
    <div>
      {loading && (
        <ProjectCreateLoader title='Fetching ROI details'/>
      )}
      <ModalHeader>Message</ModalHeader>
      <ModalBody>
        <div className="m-2">
          {warnings[warningIndex]}
        </div>
        {preTrainingData.length > 0 && (
          <div className='mx-auto pl-5 pr-10'>
            <table className="w-full text-left mb-4 text-sm text-gray-500">
              <thead className="bg-white text-sm text-gray-700 ">
                <tr className='text-right'>
                  {columns.map((t) => (
                    <th scope="col" className="pl-6 py-3 text-right" key={t}>
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                  {preTrainingData?.map(trainingData => (
                    <tr scope='row' className='bg-white border-b'>
                      {trainingData?.map((data, index) => {
                        if(index === 0){
                          return <th
                            scope="row"
                            className="whitespace-nowrap pr-6 py-4 font-normal text-gray-900 "
                          >{data}</th>
                        }
                        return <td className='text-right pl-6 py-4'>{data}</td>
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className='text-right mt-7'>
              <Button
                fullWidth={false}
                size='xs'
                onClick={() => setOpen(false)}
              >
                <Link
                  to={buttons[warningIndex]?.to}
                  state={{...location.state, ...locationState}}
                >
                  {buttons[warningIndex]?.name}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </ModalBody>
    </div>
  )
}

export default WarningModal
