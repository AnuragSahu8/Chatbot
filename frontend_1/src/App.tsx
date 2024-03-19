import React, { useState } from "react";
import "./App.css";
import Dropzone from "./DropZone";
import DropZone from "./DropZone";


import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import TypewriterEffect from "./TypewriterEffect";
import { log } from "console";





export default function App() {
  const [result, setResult] = useState<string | undefined>("");
  const [question, setQuestion] = useState<string | undefined>("");
  const [file, setFile] = useState<File | undefined>();
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  



  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      
      setFileUploaded(true); // Set fileUploaded to true when a file is uploaded
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
console.log("hello");

    const formData = new FormData();
    if (file) {
      console.log(file);
      formData.append("file", file);
    }
    if (question) {
      formData.append("question", question);
    }
    setResult("");

    try {
      const response = await fetch("https://chatbot-xqja.onrender.com/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(data.result); // Set the result from the backend to the state
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="appBlock">

      {/* Display file upload status message */}
      {fileUploaded ? (
        <p className="fileUploadStatus">File uploaded successfully!</p>
      ) : (
        <p className="fileUploadStatus">Please upload a file.</p>
      )}


      <DropZone setFile={setFile} handleSubmit ={handleSubmit}/>


      {/* <form className="form">
        <label className="questionLabel" htmlFor="question">
          Question:
        </label>
        <input
          className="questionInput"
          id="question"
          type="text"
          value={question || ""}
          onChange={handleQuestionChange}
          placeholder="Ask your question here"
        />

        <br />
        <label className="fileLabel" htmlFor="file">
          Upload file (.docx, .pdf, .txt, .csv):
        </label>

        <input
          type="file"
          id="file"
          name="file"
          accept=".docx,.pdf,.txt,.csv"
          onChange={handleFileChange}
          className="fileInput"
        />
        <br />
        <button
          className="submitBtn"
          type="submit"
          disabled={!file || !question}
        >
          Submit
        </button>
        
      </form> */}
      

      <TextField
          id="outlined-multiline-flexible"
          label="Enter your Question"
          multiline
          style={{ width: '400px' }}
          maxRows={4}
          value={question}
          onChange={handleQuestionChange}
        />
      <br/>
      <form  onSubmit={handleSubmit}>
      <Button variant="contained" disabled={(question && file!=undefined)?false:true} style={{marginTop:"10px", width:"200px"}} type="submit">Submit</Button>
      </form>   
      {/* Display the result from the backend */}
      {/* {result && (
        <p className="resultOutput">Result: {result}</p>
      )} */}



<div style={{display:"flex", overflow:"scroll",border:"1px solid black", width:"100%", height:"400px", marginTop:"1%" }} className="typewriter">
 
<TypewriterEffect result={result} />
  </div>



      
    </div>
  );
}

