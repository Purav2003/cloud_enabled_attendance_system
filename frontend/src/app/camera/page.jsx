"use client";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

const FaceDetector = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

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

        // Get the canvas context
        ctx.strokeStyle = "white";
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

  const detectFaces = async (model) => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

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
    loadModel().then((model) => {
      detectFaces(model);
    });
  }, []);

  return (
    <div>
      <Webcam ref={webcamRef} />
      <canvas ref={canvasRef} />
    </div> 
  );
};

export default FaceDetector;