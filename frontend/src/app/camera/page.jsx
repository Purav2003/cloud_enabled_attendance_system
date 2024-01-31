"use client";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

const FaceDetector = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const loadModel = async () => {
    try {
      const model = await blazeface.load();
      console.log("BlazeFace model loaded successfully:", model);
      return model;
    } catch (error) {
      console.error("Error loading BlazeFace model:", error);
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
  
        // Modify this part to draw the box with a different style or not at all
        // Example: Draw a red rectangle without fill
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, width, height);
  
        const landmarks = prediction.landmarks;
  
        // Draw the landmarks
        ctx.fillStyle = "blue";
        landmarks.forEach((landmark) => {
          ctx.fillRect(landmark[0], landmark[1], 2, 2);
        });
      });
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
  };

  const sendPhotoToBackend = async () => {
    // Send the captured photo to the backend
    if (capturedPhoto) {
      console.log(capturedPhoto);
      try {
        const response = await fetch('http://localhost:8000/api/faceMatch/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: capturedPhoto }),
        });

        if (response.status === "success") {
          console.log('Photo successfully sent to backend');
        } else {
          console.error('Failed to send photo to backend');
        }
      } catch (error) {
        console.error('Error sending photo to backend:', error);
      }
    }
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

    // Remove the drawImage line
    // ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

    const predictions = await model.estimateFaces(video);

    // ctx.clearRect(0, 0, videoWidth, videoHeight); // Clear the canvas
    drawFaceDetections(ctx, predictions);
    capturePhoto(ctx);

    // Loop through the frames with a delay
    setTimeout(() => {
      requestAnimationFrame(() => {
        detectFaces(model);
      });
    }, 100); // Adjust the delay as needed
  }
};

  

  useEffect(() => {
    loadModel().then((model) => {
      detectFaces(model);
    });
  }, []);

  return (
    <div>
      <Webcam ref={webcamRef} mirrored={0} />
      <canvas ref={canvasRef} className="absolute top-0"/>
      <button id="myCheck" onClick={() => capturePhoto(canvasRef.current.getContext("2d"))}>Capture Photo</button>
      <img src={capturedPhoto} alt="Captured" />
      <button id="myCheck" onClick={sendPhotoToBackend}>Send Photo to Backend</button>
    </div>
  );
};

export default FaceDetector;
