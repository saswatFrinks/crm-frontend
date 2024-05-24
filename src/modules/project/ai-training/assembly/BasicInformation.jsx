import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import TextArea from '@/shared/ui/TextArea';
import { useRecoilState } from 'recoil';
import { modelInfoAtom } from './state';
import { useState } from 'react';
import { validateForm, validateFormField } from '../util';

export default function BasicInformation({formRef}) {
  const [modelInfo, setModelInfo] = useRecoilState(modelInfoAtom);
  const [errors, setErrors] = useState({
    modelName: '',
    modelDescription: ''
  });

  const validateBasicForm = () => {
    return validateForm(errors, setErrors, modelInfo);
  }

  const handleSubmit = () => {
    const formErrors = validateBasicForm();
    if(Object.values(formErrors).some(error => error !== ''))return false;
    return true;
  }

  formRef.current = {handleSubmit}

  return (
    <>
      <h3 className="mb-8 text-2xl font-semibold">Basic Information</h3>
      <p className="mb-8">
        Provide the basic information for the AI model you wish to build and
        train for this project. These AI models will run on the instance to
        inspect the product as per the configurations created under the
        configurations page. You can train multiple AI models for this project
        depending upon complexity.
      </p>
      <p className="mb-8">
        Reach out to Frinks AI technical support team to assist you in this
        process if required.
      </p>
      <form className="flex flex-col gap-4">
        <div>
          <Label required={true}>Model Name</Label>
          <Input
            placeholder="Enter model name"
            value={modelInfo.modelName}
            onChange={(e) =>{
              setModelInfo({ ...modelInfo, modelName: e.target.value })
              validateFormField('modelName', e.target.value, setErrors)
            }}
            errorMessage={errors?.modelName}
          />
        </div>
        <div>
          <Label required={true}>Model Description</Label>
          <TextArea
            placeholder="Enter model description"
            rows={6}
            value={modelInfo.modelDescription}
            onChange={(e) =>{
              setModelInfo({ ...modelInfo, modelDescription: e.target.value })
              validateFormField('modelDescription', e.target.value, setErrors)
            }}
            errorMessage={errors?.modelDescription}
          />
        </div>
      </form>
    </>
  );
}
