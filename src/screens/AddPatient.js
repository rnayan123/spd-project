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
import {
  push,
  update,
  serverTimestamp,
  ref,
  uploadBytes,
} from "firebase/database";
import { storage } from "../../firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import { launchImageLibraryAsync } from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import AuthContext from "../../AuthContext";
import "@firebase/storage";

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
  const [image, setImage] = useState("");

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

  const pickImage = async () => {
    try {
      const result = await launchImageLibraryAsync();

      console.log("Image Picker Result:", result);

      if (!result.cancelled) {
        const selectedImage = result.assets[0].uri; // Use 'assets' property
        setImage(selectedImage);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const submitData = async () => {
    try {
      if (!image) {
        console.error("Image is not selected");
        return;
      }

      const storageRef = ref(storage, `patientImages/${Date.now().toString()}`);
      await uploadBytes(storageRef, image);

      // Create a new patient key
      const newPatientKey = push(ref(database, "patients")).key;

      // Update patient data in the database
      const updates = {};
      updates[`/patients/${newPatientKey}`] = formData;
      await update(ref(database), updates);

      console.log("Patient added successfully!");

      // Reset the form data and image state after submission
      setFormData({
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
      setImage("");
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
              placeholder="Weight"
              onChangeText={(text) =>
                setFormData({ ...formData, weight: text })
              }
            />
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Height"
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
                style={{ width: 200, height: 200 }}
              />
            )}
          </View>

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity style={styles.button} onPress={submitData}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default AddPatient;
