"use client";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

const FaceDetector = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [ responseData,setResponseData] = useState({response: ''})
  const [name, setName] = useState('');
  const [data,setData] = useState([]);
  const loadModel = async () => {
    try {
      const model = await blazeface.load();
      console.log("BlazeFace model loaded successfully:", model);
      return model;
    } catch (error) {
      console.error("Error loading BlazeFace model:", error);
    }
  };

  const fetchData = async () => {
        
    let idAsInt = 123456;
    const API_URL = `http://localhost:8000/api/all/${idAsInt}`;
    console.log(API_URL);
    const token = localStorage.getItem("token")
    // alert(token)
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`,
            },
        });
        const data_new = await response.json();
        console.log(data_new)
        setData(data_new)

        
        
        setLoading(false)
    } catch (error) {
        console.error(error);
    }
};

  const drawFaceDetections = (ctx, predictions) => {
    if (predictions.length > 0) {
      predictions.forEach((prediction) => {
        const startX = prediction.topLeft[0];
        const startY = prediction.topLeft[1];
        const endX = prediction.bottomRight[0];
        const endY = prediction.bottomRight[1];
        const width = endX - startX;
        const height = endY - startY;

        // Get the canvas context
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, width, height);

        const landmarks = prediction.landmarks;
        capturePhoto(ctx);
        // Draw the landmarks
        ctx.fillStyle = "blue";
        landmarks.forEach((landmark) => {
          ctx.fillRect(landmark[0], landmark[1], 2, 2);
        });
      });
    }
  };

  const sendPhotoToBackend = async () => {
    // Send the captured photo to the backend
    // console.log(capturedPhoto);
    if (capturedPhoto) {
      try {
        // Extract base64-encoded image data
        const base64Data = capturedPhoto.split(',')[1];
        console.log(base64Data)
        let response = await fetch('http://127.0.0.1:8000/api/faceMatch/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64Data }),
        });
        response = await response.json();
        setResponseData({response: response.user})
          const usersWithHelloPhoto = data.filter(user => user.profilePhoto === response.user);

          const namesWithHelloPhoto = usersWithHelloPhoto.map(user => user.name);

          if (namesWithHelloPhoto.length > 0) {
              setName(namesWithHelloPhoto)
          } else {
              console.log("No users found.");
          }
        
      
      } catch (error) {
        console.error('Error sending photo to backend:', error);
      }
    }
  };
  

  const capturePhoto = (ctx) => {
    const video = webcamRef.current.video;
    const photo = document.createElement("canvas");
    photo.width = video.width;
    photo.height = video.height;
    const photoCtx = photo.getContext("2d");
    photoCtx.drawImage(video, 0, 0, video.width, video.height);
    setCapturedPhoto(photo.toDataURL("image/jpeg")); // Save the photo in the state
    sendPhotoToBackend()
  };

  const detectFaces = async (model) => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const ctx = canvasRef.current.getContext("2d");

      // Draw the video on the canvas
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

      const predictions = await model.estimateFaces(video);

      drawFaceDetections(ctx, predictions);

      // Loop through the frames with a delay
      setTimeout(() => {
        requestAnimationFrame(() => {
          detectFaces(model);
        });
      }, 100); // Adjust the delay as needed
    }
  };

  useEffect(() => {
    fetchData();
    loadModel().then((model) => {
      detectFaces(model);
    });
  }, []);

  return (
    <div className="items-center min-h-screen grid justify-center">
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block', width:"400px",height:"400px",borderRadius: '50%', overflow: 'hidden', margin: '20px' }} className="object-cover">
        <Webcam ref={webcamRef} style={{ borderRadius: '50%',width:"400px",height:"400px"}} className="object-cover" mirrored="false"/>
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, borderRadius: '50%',width:"400px",height:"400px",transform: 'scaleX(-1)' }} className="object-cover" />
      </div>      
    </div>
    <button id="myCheck" onClick={sendPhotoToBackend} className="bg-green-500 rounded-md text-white px-4 py-2 inline-block">Send</button>
      <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', background: 'red' }}>
        <p>{name}</p>
      </div>
    </div>
  );
};

export default FaceDetector;