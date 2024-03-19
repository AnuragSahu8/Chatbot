## Project structure

In this project there are  2 directories

1. `backend` containing the server side **python** code
2. `frontend` containing the client side **typescript** code.\


### Backend

**Requirements**: Python 3.10 or above.

1. `main.py` which is the entry point to our server
2. This project has a few Python packages as dependencies, you can install them in your virtual environment using `requirements.txt`.
3. We will be using [`conda`](https://docs.conda.io/projects/conda/en/stable/) package manager to create a virtual environment `chatbot` using `conda create -n chatbot python=3.10` and then `conda activate chatbot` to activate the environment.
4. Then install the python packages using `pip install -r requirements.txt`

#### Running the backend server

To launch the server, navigate to the `backend` directory and run:

##### `uvicorn main:app --reload`

This will start the server at [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

### Frontend

The project structure within the `frontend` directory follows the official `create-react-app` structure as in the [docs](https://create-react-app.dev/docs/folder-structure).

**Requirements**: We are using `node V20.11.1` and `npm 10.2.4`. They can be downloaded via [installer](https://nodejs.org/en). For more information check [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

#### How to launch the react app

1. Navigate to the `frontend` directory and run `npm install`
2. Then you can run:

   ##### `npm start`

   This will launch the app in development mode.\
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

## The assignment

### Backend

1. In my beckend I choose to use FastAPI due to my previous hands-on experience with it.

In main.py file i have create 4 functionality.
 1. first for handelling the uploaded file response 
 2. second for handelling the file size limit  with the proper allowed extension.
 3. I used the Google Generative API for my LLM model as it is the latest and most updated version.and aslo the model is performing best  and giving the accurate result on the given text.
 4. create a predict function as an end point which takes the question and the uploaded file and return back the response of the user question. 



### Frontend

1. Added a pop up which notifies that the file has been uploaded properly.
2. Extend the app's functionality to accept `.txt`,`.docx` & `.pdf` files in addition to `.csv` files.
3. Also added  some styling to the bare bones app structure. I used CSS due to its simplicity and foundational nature.
4. add a functionality for handelling large file.
5. handeled edges  case like unsupported file type (video/mp3, .ppt etc..).
