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
import { ref, push, update, serverTimestamp } from "firebase/database";
import DateTimePicker from "@react-native-community/datetimepicker";
import ImagePicker from "react-native-image-picker";
import { uploadBytes, getDownloadURL } from "firebase/database";
import { getStorage, ref as storageRef, uploadFile } from "firebase/storage";
import LabReportUpload from "./LabReportUpload";

const pickLabReportImage = (setLabReportImage) => {
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

import AuthContext from "../../AuthContext";
import { database } from "../../firebaseConfig";

const AddPatient = () => {
  const authContext = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [labReportImage, setLabReportImage] = useState(null);
  const [formData, setFormData] = useState({
    patientName: "",
    appointmentDate: "",
    patientPhoneNumber: "",
    patientDisease: "",
    cost: "",
    prescription: "",
    dateOfArrival: serverTimestamp(),
    doctorID: authContext.user,
  });

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
    },
    buttonText: {
      color: "#ffffff",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 18,
    },
  });

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

  const myFirebase = async () => {
    try {
      if (!formData.appointmentDate) {
        console.error("Invalid appointment date");
        return;
      }

      // Create a new patient key
      const newPatientKey = push(ref(database, "patients")).key;

      // Update patient data in the database
      const updates = {};
      updates[`/patients/${newPatientKey}`] = formData;
      await update(ref(database), updates);

      console.log("Patient added successfully!");

      // Upload lab report image
      if (labReportImage) {
        try {
          const storage = getStorage();
          const labReportRef = storageRef(
            storage,
            `lab_reports/${newPatientKey}`
          );

          // Assuming uploadFile is a function to upload the lab report
          await uploadFile(labReportRef, labReportImage);

          // Get download URL of the uploaded lab report
          const downloadURL = await getDownloadURL(labReportRef);

          // Update formData with the lab report URL
          setFormData({ ...formData, labReportURL: downloadURL });

          console.log("Lab report uploaded successfully!");
        } catch (labReportError) {
          console.error("Error uploading lab report:", labReportError.message);
        }
      }
    } catch (error) {
      console.error("Error adding patient:", error.message);
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
              placeholder="age"
              onChangeText={(text) => setFormData({ ...formData, age: text })}
            />
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="weight"
              onChangeText={(text) =>
                setFormData({ ...formData, weight: text })
              }
            />
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="height"
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
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => pickLabReportImage(setLabReportImage)}
            >
              <Text style={styles.buttonText}>Pick Lab Report Image</Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => myFirebase()}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default AddPatient;
