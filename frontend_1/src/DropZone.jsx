import React from 'react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './DropZone.css'; // Import your CSS file
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
export default function DropZone(props) {
const [valid,setValid] = useState(false)

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: ['.docx', '.pdf', '.txt', '.csv'],
    onDrop: acceptedFiles => {
      setValid(false);
      // Perform your logic here with the accepted files
      console.log('Accepted Files:', acceptedFiles);
      // Example: You can pass the accepted files to a parent component
      const fileSizeLimit = 100 * 1024 * 1024; // 100 MB
      if (acceptedFiles[0].size > fileSizeLimit) {
        toast.error('File size exceeds the maximum limit (100 MB)');
        return;
      }
   
   if(acceptedFiles[0].name.includes("docx")|| acceptedFiles[0].name.includes("pdf") || acceptedFiles[0].name.includes("txt") || acceptedFiles[0].name.includes("csv")){
      props.setFile(acceptedFiles[0]);
      setValid(true);
   
   toast.success("File Uploaded Successfully");
   }
   else{
  
    toast.error("Please Upload the correct file")
   }
      
    }
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(Limit 100 MB per file & Only *.docx *.pdf *.txt *.csv files will be accepted)</em>
        
      </div>
      <aside>
       <h4>Selected file</h4>
       { valid && <ul>{acceptedFileItems}</ul>}
       
      </aside>
      <ToastContainer
      position="top-center"
      autoClose={3000}
      />
    </section>
  );
}

