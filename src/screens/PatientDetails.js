import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import React from "react";

const PatientDetails = ({ route }) => {
  const {
    age,
    weight,
    dateOfArrival,
    doctorID,
    patientDisease,
    patientName,
    appointmentDate,
    patientPhoneNumber,
    patientuid,
    prescription,
    height

  } = route.params;
   const calculateBMI = () => {
    // Convert weight and height to numbers
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    // Check if weight and height are valid numbers
    if (!isNaN(weightNum) && !isNaN(heightNum) && heightNum !== 0) {
      // Calculate BMI (weight / height^2)
      const bmi = (weightNum / (heightNum * heightNum)).toFixed(2);

      return bmi;
    }

    return ''; // Return an empty string if calculation is not possible
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.footer}
          source={require("../../assets/header-login-screen.png")}
        />
        <Text style={styles.topText}>Patient Details</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.subContainer}
      >
        <Text style={styles.headingText}>Patient Information</Text>
        <Image source={require("../../assets/patientimg.png")} />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Patient Name"
            value={patientName}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Appointment Date:</Text>
          <TextInput
            style={styles.input}
            placeholder="Appointment Date"
            value={appointmentDate}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Disease:</Text>
          <TextInput
            style={styles.input}
            placeholder="Patient Disease"
            value={patientDisease}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={patientPhoneNumber}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Prescription:</Text>
          <TextInput
            style={styles.input}
            placeholder="Prescription"
            value={prescription}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>age:</Text>
          <TextInput
            style={styles.input}
            placeholder="age"
            value={age}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>weight:</Text>
          <TextInput
            style={styles.input}
            placeholder="weight"
            value={weight}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>height:</Text>
          <TextInput
            style={styles.input}
            placeholder="height"
            value={height}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>BMI:</Text>
          <TextInput
            style={styles.input}
            placeholder="BMI"
            value={calculateBMI()}
            editable={false}
          />
        </View>
        
      </ScrollView>
    </View>
    
  );
};

export default PatientDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    width: "95%",
  },
  scrollContainer: {
    alignItems: "center",
  },
  topText: {
    position: "absolute",
    top: 70,
    fontWeight: "bold",
    color: "white",
    fontSize: 18,
  },
  bottomText: {
    position: "absolute",
    bottom: 50,
    color: "white",
    fontSize: 14,
  },
  headingText: {
    fontWeight: "bold",
    color: "#35A2CD",
    fontSize: 25,
    marginBottom: 8,
  },
  simpleText: {
    marginBottom: 15,
  },
  label: {
    color: "#35A2CD",
    fontWeight: "bold",
  },
  inputContainer: {
    width: "90%",
    backgroundColor: "rgb(221,220,220)",
    borderRadius: 12,
    height: 60,
    alignItems: "flex-start",
    paddingTop: 8,
    paddingLeft: 10,
    margin: 12,
  },
  input: {
    width: "90%",
    height: 40,
    borderRadius: 12,
  },
  button: {
    marginTop: 10,
    height: 35,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#35A2CD",
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
  },
});
