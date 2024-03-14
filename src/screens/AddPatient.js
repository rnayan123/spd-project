import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { push, update, serverTimestamp, ref } from "firebase/database";
import { storage } from "../../firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import { launchImageLibraryAsync } from "expo-image-picker";
import AuthContext from "../../AuthContext";
import { database } from "../../firebaseConfig";
import { ref as sRef } from "firebase/storage";
import { uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
// import RNFS from "react-native-fs";

import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { useEffect } from "react";

const AddPatient = () => {
  const authContext = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    appointmentDate: "",
    patientPhoneNumber: "",
    patientDisease: "",
    age: "",
    weight: "",
    height: "",
    prescription: "",
    dateOfArrival: serverTimestamp(),
    doctorID: authContext.user,
  });
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f7f7f7",
      padding: 20,
    },
    headerContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    footer: {
      width: "100%",
      height: 200,
      resizeMode: "cover",
    },
    topText: {
      fontWeight: "bold",
      fontSize: 24,
      marginVertical: 10,
      color: "#3498db",
    },
    scrollContainer: {
      flexGrow: 1,
    },
    headingText: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 10,
      color: "#333",
    },
    input: {
      height: 40,
      borderColor: "#3498db",
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
      paddingHorizontal: 10,
      backgroundColor: "#fff",
      color: "#333",
    },
    datePicker: {
      marginBottom: 15,
    },
    button: {
      backgroundColor: "#3498db",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: "#ffffff",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 18,
    },
  });

  // useEffect(() => {
  //   async function requestPermissions() {
  //     const { status } =
  //       await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== "granted") {
  //       console.error("Media library permission not granted");
  //     }
  //   }

  //   requestPermissions();
  // }, []);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    setFormData({
      ...formData,
      appointmentDate: currentDate.toISOString(),
    });
  };

  const showDatePicker = () => {
    setShow(true);
  };

  // const pickImage = async () => {
  //   try {
  //     const result = await launchImageLibraryAsync();

  //     console.log("Image Picker Result:", result);

  //     if (!result.cancelled) {
  //       const selectedImage = result.assets[0].uri; // Use 'assets' property
  //       console.log("Selected Image URI:", selectedImage);
  //       // RNFS.readFile(selectedImage, "utf8")
  //       //   .then((contents) => {
  //       //     // setFileContents(contents);
  //       //     console.log(contents);
  //       //   })
  //       //   .catch((err) => {
  //       //     console.log(err.message);
  //       //   });
  //       setImage(selectedImage);
  //     }
  //   } catch (error) {
  //     console.error("Error picking image:", error);
  //   }
  // };

  const pickImage = async () => {
    try {
      const result = await launchImageLibraryAsync();

      console.log("Image Picker Result:", result);

      if (!result.cancelled) {
        const asset = result.assets[0];
        const fileUri = Asset.fromModule(asset.uri).uri;
        setImage(fileUri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      const fileName = `patientImage_${Date.now().toString()}.jpg`;

      const storageRef = sRef(storage, `patientImages/${fileName}`);

      const metadata = {
        contentType: "image/jpeg",
      };

      await uploadBytes(storageRef, imageUri, metadata);

      const imageUrl = await getDownloadURL(storageRef);
      console.log("Image uploaded successfully. URL:", imageUrl);

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleAddPatient = async () => {
    try {
      // Trigger image upload only if an image is selected
      if (image) {
        setIsUploading(true);
        const imageUrl = await uploadImage(image);
        setIsUploading(false);

        setFormData({
          ...formData,
          imageUrl,
        });
      }

      const newPatientKey = push(ref(database, "patients")).key;

      const updates = {};
      updates[`/patients/${newPatientKey}`] = formData;
      await update(ref(database), updates);

      console.log("Patient added successfully!");

      setFormData({
        patientName: "",
        appointmentDate: "",
        patientPhoneNumber: "",
        patientDisease: "",
        age: "",
        weight: "",
        height: "",
        prescription: "",
        doctorID: authContext.user,
      });
      setImage(null);
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.footer}
          source={require("../../assets/header-login-screen.png")}
        />
        <Text style={styles.topText}>Add Patient</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        <KeyboardAvoidingView behavior="position">
          <Text style={styles.headingText}>Add your Patient Info</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Patient Name"
              onChangeText={(text) =>
                setFormData({ ...formData, patientName: text })
              }
            />
          </View>
          <View>
            <View style={styles.datePicker}>
              <Text onPress={showDatePicker} style={{ opacity: 0.6 }}>
                Appointment Date:{" "}
              </Text>
              {show && (
                <DateTimePicker value={date} onChange={handleDateChange} />
              )}
            </View>
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Patient Phone Number"
              onChangeText={(text) =>
                setFormData({ ...formData, patientPhoneNumber: text })
              }
            />
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Patient Disease"
              onChangeText={(text) =>
                setFormData({ ...formData, patientDisease: text })
              }
            />
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Age"
              onChangeText={(text) => setFormData({ ...formData, age: text })}
            />
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Weight(in kg)"
              onChangeText={(text) =>
                setFormData({ ...formData, weight: text })
              }
            />
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Height (in meter)"
              onChangeText={(text) =>
                setFormData({ ...formData, height: text })
              }
            />
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Prescription"
              onChangeText={(text) =>
                setFormData({ ...formData, prescription: text })
              }
            />
          </View>

          <View style={styles.container}>
            <TouchableOpacity onPress={pickImage}>
              <Text>Pick Image</Text>
            </TouchableOpacity>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200, marginTop: 10 }}
              />
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleAddPatient}>
            <Text style={styles.buttonText}>
              {isUploading ? "Adding Patient..." : "Add Patient"}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default AddPatient;
