export function splitWords(str) {
  const words = str.split(/(?=[A-Z])/);
  const capitalizedSentence = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return capitalizedSentence.charAt(0).toUpperCase() + capitalizedSentence.slice(1);
}

export const validateFormField = (key, value, setErrors) => {
  let error = '';
  if(!value){
    error = `${splitWords(key)} is required.`
  }else{
    error = ''
  }
  setErrors(prev => ({
    ...prev,
    [key]: error
  }));
  return error;
}

export const validateForm = (errors, setErrors, formData) => {
  let formErrors = {...errors};
  for (const key in formData) {
    if (Object.hasOwnProperty.call(formData, key)) {
      formErrors[key] = validateFormField(key, formData[key], setErrors);
    }
  }
  return formErrors;
}