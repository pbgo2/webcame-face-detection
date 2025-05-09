import * as faceapi from 'face-api.js';

export async function loadModels() {
  const MODEL_URL = '/models';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
  ]);
}

export async function detectFaces(input: HTMLVideoElement) {
  const detections = await faceapi.detectAllFaces(
    input,
    new faceapi.TinyFaceDetectorOptions()
  )
  .withFaceExpressions()
  .withAgeAndGender();

  return detections;
}
