"use client";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

// ...
// ...

const FaceDetector = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const lastFaceRef = useRef(null);
  const [capturedImageData, setCapturedImageData] = useState(null);

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
    // Draw the current face detection
    if (predictions.length > 0) {
      const face = predictions[0];
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(face.topLeft[0], face.topLeft[1], face.width, face.height);

      ctx.fillStyle = "blue";
      face.landmarks.forEach((landmark) => {
        ctx.fillRect(landmark[0], landmark[1], 2, 2);
      });
    }
  };

  const capturePhoto = (video, predictions) => {
    // Assuming there is at least one face detected
    if (predictions.length > 0) {
      const currentFace = predictions[0];

      // Check if the current face is significantly different from the last captured face
      if (
        !lastFaceRef.current ||
        Math.abs(currentFace.topLeft[0] - lastFaceRef.current.topLeft[0]) > 10 ||
        Math.abs(currentFace.topLeft[1] - lastFaceRef.current.topLeft[1]) > 10 ||
        Math.abs(currentFace.width - lastFaceRef.current.width) > 10 ||
        Math.abs(currentFace.height - lastFaceRef.current.height) > 10
      ) {
        // Update the last captured face
        lastFaceRef.current = currentFace;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        canvas.width = videoWidth;
        canvas.height = videoHeight;

        // Draw the current face detection
        drawFaceDetections(ctx, predictions);

        // Draw the current video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to base64-encoded image data
        const newImageData = canvas.toDataURL("image/png");

        // Update capturedImageData state
        setCapturedImageData(newImageData);
        localStorage.setItem("IMG",newImageData)

        // Send newImageData to your backend API if needed
        // sendPhotoToBackend(newImageData);
      }
    }
  };

  useEffect(() => {
    loadModel().then((model) => {
      detectFaces(model);
    });

    // Set a timer to capture a photo every 20 seconds
    const photoCaptureInterval = setInterval(() => {
      capturePhoto(webcamRef.current.video, lastFaceRef.current);
    }, 20000);

    // Cleanup interval on component unmount
    return () => clearInterval(photoCaptureInterval);
  }, []);

  const detectFaces = async (model) => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const ctx = canvasRef.current.getContext("2d");

      // Estimate faces and landmarks
      const predictions = await model.estimateFaces(video);

      // Draw the current face detection
      drawFaceDetections(ctx, predictions);

      // Capture photo only when a new face is detected
      capturePhoto(video, predictions);

      // Loop through the frames with a delay
      setTimeout(() => {
        requestAnimationFrame(() => {
          detectFaces(model);
        });
      }, 100); // Adjust the delay as needed
    }
  };

  return (
    <div>
      <Webcam ref={webcamRef} />
      <canvas ref={canvasRef} />
      {capturedImageData && (
        <div>
          <h2>Newly Captured Photo:</h2>
          <img src={capturedImageData} alt="Captured Face" />
        </div>
      )}
    </div>
  );
};

export default FaceDetector;
