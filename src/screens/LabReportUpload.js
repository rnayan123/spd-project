import React, { useState, useEffect } from "react";
import { View, Button, Image } from "react-native";
// import ImagePicker from "react-native-image-picker";

import {
  getStorage,
  ref as storageRef,
  uploadFile,
  getDownloadURL,
} from "firebase/storage";
import {  launchImageLibrary } from "react-native-image-picker";
const LabReportUpload = ({ onLabReportUpload }) => {
  const [labReportImage, setLabReportImage] = useState(null);

  const pickLabReportImage = () => {
    const options = {
      title: "Select Lab Report Image",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error:", response.error);
      } else {
        setLabReportImage(response.uri);
      }
    });
  };

  const handleLabReportUpload = async () => {
    try {
      if (labReportImage) {
        const storage = getStorage();
        const labReportRef = storageRef(
          storage,
          `lab_reports/${Date.now()}.jpg`
        );

        // Assuming uploadFile is a function to upload the lab report
        await uploadFile(labReportRef, labReportImage);

        // Get download URL of the uploaded lab report
        const downloadURL = await getDownloadURL(labReportRef);

        // Pass the download URL to the parent component
        onLabReportUpload(downloadURL);

        console.log("Lab report uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading lab report:", error.message);
    }
  };

  return (
    <View>
      <Button title="Pick Lab Report Image" onPress={pickLabReportImage} />
      {labReportImage && (
        <Image
          source={{ uri: labReportImage }}
          style={{ width: 200, height: 200 }}
        />
      )}
      <Button title="Upload Lab Report" onPress={handleLabReportUpload} />
    </View>
  );
};

export default LabReportUpload;
