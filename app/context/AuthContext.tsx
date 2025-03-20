// app/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// type RootStackParamList = {
//     LoginScreen: undefined;
//     Home: undefined;
//   };
// type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;


// Define types
type User = {
    ENTITY_CODE: string;
    USER_ID: string;
    CUST_CODE: string;
    EMP_NUM: string;
    USER_NAME: string;
    PASSWORD: string;
    NE_PASSWORD: string;
    USER_REG_DATE: string;
    USER_EXP_DATE: string | null;
    USER_TYPE: string;
    USER_ACTIVE: string;
    OFFICE_LATITUDE: string;
    OFFICE_LONGITUDE: string;
    LOGIN_DISTANCE: string;
    DISTANCE_LOGIN: string;
    ROLE_ID: string;
    CR_BY: string;
    CR_ON: string;
    MO_BY: string | null;
    MO_ON: string | null;
    AU_BY: string | null;
    AU_ON: string | null;
    REMARKS: string;
    ROLE_COMPANY: string | null;
    TBA_KEY: string | null;
  };
  

type AuthContextType = {
  user: User | null;
  loginContext: (userData: User) => void; // Changed to not return a promise
  logout: () => void;
  isLoading: boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loginContext: () => {},
  logout: () => {},
  isLoading: true
});

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    //   const navigation = useNavigation<LoginScreenNavigationProp>();
    
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router =useRouter();

  // Check if user is logged in on app start
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error retrieving user data', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function - removed async since we're calling it without await
  const loginContext = async (userData: User) => {
    console.log("does it comes here in context or not")
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      // Navigate only after data is stored
      router.push('/home');
    } catch (error) {
      console.error('Error saving user data', error);
    }
  };

  // Logout function
  const logout = () => {
    AsyncStorage.removeItem('user')
      .then(() => {
        setUser(null);
        // navigation.navigate('LoginScreen')
        router.push("/login");
        console.log("LOGOUT");
        ;

      })
      .catch((error) => {
        console.error('Error removing user data', error);
      });
  };

  return (
    <AuthContext.Provider value={{ user, loginContext, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export  { AuthContext, useAuth };
export default AuthProvider;