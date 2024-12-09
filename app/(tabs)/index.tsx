import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import Detect from "@/assets/images/detect.png";

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationString, setLocationString] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  // Request location permissions and fetch coordinates
  const getCurrentLocation = async () => {
    setErrorMsg(null); // Reset error message
    setLoading(true); // Show loading indicator
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      await fetchAddress(currentLocation);
    } catch (error) {
      setErrorMsg("Failed to fetch location. Please try again.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Reverse geocode the location to get a human-readable address
  const fetchAddress = async (location) => {
    try {
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLocationString(`${address.city}, ${address.region}`);
    } catch (error) {
      setErrorMsg("Unable to fetch address from location.");
    }
  };

  // useEffect(() => {
  //   getCurrentLocation();
  // }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Auto-Detect Location</Text>
        <TouchableOpacity style={styles.detectButton} onPress={getCurrentLocation}>
          <Image style={styles.icon} source={Detect} />
          {loading ? (
            <ActivityIndicator size="small" color="orange" />
          ) : (
            <Text style={styles.buttonText}>Press to auto-detect your location</Text>
          )}
        </TouchableOpacity>
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
        {locationString && (
          <Text style={styles.locationText}>Detected Location: {locationString}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#2A3980",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  locationText: {
    fontSize: 16,
    marginTop: 10,
    color: "#000",
  },
});
