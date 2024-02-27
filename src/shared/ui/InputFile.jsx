import React from 'react';
import Upload from '../icons/Upload';
import X from '../icons/X';

const InputFile = React.forwardRef(({ value, formik = null, ...props }, ref) => {
  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleChange = (e) => {
    console.log(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
    formik?.setFieldValue('file', e.target.files[0])
  };

  React.forwardRef(ref, () => ({
    selectedFile,
  }));

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="file"
        className="flex cursor-pointer items-center gap-2 rounded-full bg-f-primary px-4 py-1.5 text-white duration-100 hover:bg-f-secondary"
      >
        <Upload />
        Upload
      </label>
      {selectedFile && (
        <>
          <p>{selectedFile.name}</p>
          <X onClick={() => setSelectedFile(null)} />
        </>
      )}
      <input type="file" id="file" hidden onChange={handleChange} {...props} />
    </div>
  );
});

export default InputFile;
