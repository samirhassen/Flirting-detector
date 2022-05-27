import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Animated } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

/**
 * 1) Request camera permission
 * 2) Implementera kamera
 * 3) Ta foto
 * 4) Flippa kamera (bak till fram)
 * 5) Ta hand om randfall
 * 6) Lägg till overlay
 * 8) Face igenkännig then aniskt utryck
 * (7 spara undan bilden långvarigt)
 */

 const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /*
  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 300,
      }
    ).start();
  }, [fadeAnim])
  */
  return (
    <Animated.View                 // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim,         // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
}

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean>();
  const [camera, setCamera] = useState<Camera | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [faces, setFaces] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  const snapPic = async () => {
    const data = await camera.takePictureAsync()
    console.log(data)
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleFacesDetected = ({ faces }) => {
    setFaces(faces);
    console.log(faces);
  }

  function ShowFaceData () {
    if(faces.length !== 0) {
      return faces.map((face, index) => {
        const smiling = face.smilingProbability > 0.7;
        const flirting = face.leftEyeOpenProbability < 0.25 && face.rightEyeOpenProbability > 0.7;
        return (
        <View>
          <Text style={styles.faces}> Amount of faces {faces.length} </Text>
          <Text style={styles.faces}> You're Smiling : {smiling.toString()} </Text>  
          <Text style={styles.faces}> Flirting : {flirting.toString()} </Text>  
        </View>
        )
      })
    }
    else 
      return <Text style={styles.faces}> No faces detected </Text>
  }

  return (
    <View style={styles.container}>
      <Camera 
      style={styles.camera}
      type={type}
      ref={ref => setCamera(ref)}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 500,
        tracking: true,
      }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={snapPic}>
            <Text style={styles.text}> Snap Pic </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back);
            }}>              
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
        <ShowFaceData />
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: "#00f",
    flexDirection: 'row',
    marginTop: 40,
    width: 100,
    height: 50,
  },
  button: {
    flex: 1,
    alignItems: "flex-start"
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  faces: {
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    fontSize: 25
  }
});
