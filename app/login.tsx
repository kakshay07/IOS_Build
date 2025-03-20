import React, { useState } from 'react'
import imagePaths from '~/assets/constants/imagePaths';
import * as Location from 'expo-location';
// import { PermissionResponse } from 'expo-location';
import { KeyboardAvoidingView, Keyboard, Platform, SafeAreaView, StatusBar, TouchableWithoutFeedback, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Image, PermissionsAndroid, ToastAndroid, Alert, Linking } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import { useAuth } from './context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

 const login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const {loginContext} = useAuth()

      const handleLogin = async () => {
        // Validate username and password
        if (!username || !password) {
          setError('Please enter both username and password');
          return;
        }
      
        setIsLoading(true);
        setError('');
      
        try {
          // Prepare form data for the API request
          const formData = new FormData();
          formData.append('username', username);
          formData.append('password', password);
      
          // Call the API to authenticate the user
          const response = await axios.post(
            'https://emp.arisecraft.com/Auth/AuthenticateUserForLocation',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
//           const formData1 = new FormData();

// // Required DataTable Parameters
//           formData1.append("draw", "1");
//           formData1.append("start", "0");
//           formData1.append("length", "-1");

//           formData1.append("order[0][column]", "0");
//           formData1.append("order[0][dir]", "asc");

//           // Columns Data
//           const columns = [
//             { data: "0" },
//             { data: "login_datetime" },
//             { data: "LOGIN_SESSION_IP" },
//             { data: "logout_datetime" },
//             { data: "LOGOUT_SESSION_IP" },
//             { data: "ENTRY_FLAG" },
//             { data: "EARLY_LEAVE_PERMISSION" },
//             { data: "time_diff" },
//             { data: "8" }
//           ];

//           columns.forEach((col, index) => {
//             formData1.append(`columns[${index}][data]`, col.data);
//             formData1.append(`columns[${index}][name]`, "");
//             formData1.append(`columns[${index}][searchable]`, "true");
//             formData1.append(`columns[${index}][orderable]`, "true");
//             formData1.append(`columns[${index}][search][value]`, "");
//             formData1.append(`columns[${index}][search][regex]`, "false");
//           });

//           // Search Parameters
//           formData1.append("search[value]", "");
//           formData1.append("search[regex]", "false");

//           // Custom Parameters
//           formData1.append("empEvent_From", "2025-03-01");
//           formData1.append("empEvent_To", "2025-03-18");
//           formData1.append("user_id", "ACT10010@1");
//           formData1.append("entity_Id", "1");
const payload = {
  draw: 1,
  start: 0,
  length: -1,
  order: [{ column: 0, dir: "asc" }],
  columns: [
    { data: "0", name: "", searchable: true, orderable: true, search: { value: "", regex: false } },
    { data: "login_datetime", name: "", searchable: true, orderable: true, search: { value: "", regex: false } },
    { data: "LOGIN_SESSION_IP", name: "", searchable: true, orderable: true, search: { value: "", regex: false } },
    { data: "logout_datetime", name: "", searchable: true, orderable: true, search: { value: "", regex: false } },
    { data: "LOGOUT_SESSION_IP", name: "", searchable: true, orderable: true, search: { value: "", regex: false } },
    { data: "ENTRY_FLAG", name: "", searchable: true, orderable: true, search: { value: "", regex: false } },
    { data: "EARLY_LEAVE_PERMISSION", name: "", searchable: true, orderable: true, search: { value: "", regex: false } },
    { data: "time_diff", name: "", searchable: true, orderable: true, search: { value: "", regex: false } },
    { data: "8", name: "", searchable: true, orderable: true, search: { value: "", regex: false } },
  ],
  search: { value: "", regex: false },
  empEvent_From: "2025-03-01",
  empEvent_To: "2025-03-18",
  user_id: "ACT10010@1",
  entity_Id: "1",
};

// Axios JSON POST request
const response1 = await axios.post(
  "https://emp.arisecraft.com/Event/getEmpEvent",
  payload,
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);

console.log(response1.data ,"wtdd");


          // Axios POST Request
        
          // Extract response data
          const data = { ...response.data.ent_det };
          if(response.data.success == 0){
                Alert.alert(
                    '', // No title
                    'Username or Password is incorrect',
                    // [{ text: 'OK', onPress: () => {} }],
                    // { cancelable: true }
                );
                return;
            }
          // Check if the authentication was successful
          if (response.data.success == 1) {
             await AsyncStorage.setItem('user', JSON.stringify(data))
             loginContext(data);
            // try {
              const distanceCheck: {
                allowed: boolean;
                distance: number;
                accuracy: number;
              } = await checkLocationAndLogin(
                data.OFFICE_LATITUDE,
                data.OFFICE_LONGITUDE,
                data.LOGIN_DISTANCE
              );
      
              console.log(distanceCheck, 'Distance Check Result');
              // Handle the distance check result
              if (distanceCheck.allowed) {
                Alert.alert(
                    '', // No title
                    'You are in the allowed range',
                    // [{ text: 'OK', onPress: () => {} }],
                    // { cancelable: true }
                  );
                  router.replace('/home' ,);

              } else {
                console.log("Distance check fail")
                Alert.alert(
                    '', // No title
                    'You are not in the allowed range',
                    // [{ text: 'OK', onPress: () => {} }],
                    // { cancelable: true }
                  );

              }
            // } catch (error) {
            //   console.error('Error while checking location:', error);
            //   toastError.fire({
            //     title: 'Failed to check location. Please try again.',
            //   });
            // }
          } else {
            // Authentication failed
            // toastError.fire({
            //   title: 'Username or password is incorrect.',
            // });
          }
        } catch (error :any) {
          // Handle network or API errors
          setError('Network error. Please try again later.');
          console.error('Login error:', error);
        //   toastError.fire({
        //     title: 'Network error. Please try again later.',
        //   });
        } finally {
          // Reset loading state
          setIsLoading(false);
        }
      };

      async function requestLocationPermission(): Promise<boolean> {
        if (Platform.OS == 'android') {
          // Request location permission for Android
          const { status } = await Location.requestForegroundPermissionsAsync();
          return status == 'granted';
        } else if (Platform.OS === 'ios') {
          // Request location permission for iOS
          const { status } = await Location.requestForegroundPermissionsAsync();
          return status == 'granted';
        }
      
        // Default to true for other platforms (e.g., web)
        return true;
      }

      async function checkLocationAndLogin(
        office_lat: number,
        office_lng: number,
        max_distance: number
      ): Promise<{ allowed: boolean; distance: number; accuracy: number }> {
      
        // Request location permission
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          throw new Error('Permission denied');
        }
      
        // Get the current position
        try {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
      
          // Calculate the distance between the user and the office
          const distance = calculateDistance(userLat, userLng, office_lat, office_lng);
      
          // Check if the user is within the allowed distance
          return {
            allowed: distance <= max_distance,
            distance,
            accuracy:Number( position.coords.accuracy),
          };
        } catch (error) {
          console.error('Error occurred while fetching location:', error);
          throw new Error('Failed to fetch location');
        }
      }
  
      function calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
      ): number {
        // Radius of the Earth in meters
        const R = 6371000;
      
        // Convert latitude and longitude from degrees to radians
        const lat1Rad = toRadians(lat1);
        const lon1Rad = toRadians(lon1);
        const lat2Rad = toRadians(lat2);
        const lon2Rad = toRadians(lon2);
      
        // Difference in coordinates
        const dlat = lat2Rad - lat1Rad;
        const dlon = lon2Rad - lon1Rad;
      
        // Haversine formula
        const a =
          Math.sin(dlat / 2) * Math.sin(dlat / 2) +
          Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
        // Distance in meters
        const distance = R * c;
      
        return distance;
      }
      
      /**
       * Convert degrees to radians.
       * @param degrees - The angle in degrees.
       * @returns The angle in radians.
       */
      function toRadians(degrees: number): number {
        return (degrees * Math.PI) / 180;
      }
      
      // Example usage
    //   (async () => {
    //     try {
    //       const officeLat = 37.7749; // Example office latitude (San Francisco)
    //       const officeLng = -122.4194; // Example office longitude (San Francisco)
    //       const maxDistance = 5000; // Example maximum allowed distance (5 km)
      
    //       const result = await checkLocationAndLogin(officeLat, officeLng, maxDistance);
    //       console.log('Result:', result);
    //     } catch (error) {
    //       console.error('Error:', error);
    //     }
    //   })();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            {/* Replace with your actual logo */}
            <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>
              <Image source={imagePaths.icon} style={styles.logoImage} />
              </Text>
            </View>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
            
            <View style={styles.inputContainer}>
                <Text style={{marginLeft :10}}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
                <Text style={{marginLeft :10}}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.forgotPassword}>
             {/* <Text style={styles.forgotPasswordText}>Forgot Password?</Text>*/ }
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Copyright © {new Date().getFullYear()}{' '}
              <Text
              style={styles.linkText}
              onPress={() => Linking.openURL('https://www.arisecraft.com')}
                >
              Arisecraft Technology
              </Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 20,
    // backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius:50,
    resizeMode: 'contain',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
    paddingLeft: 4,
  },
  input: {
    backgroundColor: '#e9edf0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#424242',
    
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#5e35b1', // Purple color, you can change to your brand color
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#5e35b1',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    color: '#9e9e9e',
    fontSize: 12,
  },

  linkText: {
    color: '#007bff', // Blue color for link
    textDecorationLine: 'underline',
  },
});
export default login;
