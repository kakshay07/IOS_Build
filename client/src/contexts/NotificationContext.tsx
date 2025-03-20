import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getassignedtasknotification, getduedatenotification, GetInvoiceNull, getreceiptnotification, requestHandler } from '../utils/api';
import { toastError } from '../utils/SweetAlert';
import { urlBase64ToUint8Array } from '../utils';
import { axios } from '../utils/axios';
import { useAuth } from './AuthContext';
import Swal from 'sweetalert2';

interface NotificationContextType {
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  getCountOfAssignedtasks: () => void;
  notificationCount1: number;
  setNotificationCount1: (count : number) => void;
  getRaisedInvoiceCount: () => void
  notificationCount2: number;
  setNotificationCount2: (count : number) => void;
  getRaisedPaymentCount: () => void;
  dueDateCount: number;
  setDuedatecount: (count : number) => void;
  getDueDateCount: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationCount1, setNotificationCount1] = useState(0);
  const [notificationCount2, setNotificationCount2] = useState(0);
  const [dueDateCount, setDuedatecount] = useState(0);
  const {currentBranch , currentEntity} = useAuth()
  

  function getCountOfAssignedtasks()
  {
    requestHandler(
        async () => {
          return await getassignedtasknotification();
        },
        (data) => {
          if(data.data.length > 0)
          {
            setNotificationCount(data.data.length);
          } else {
            setNotificationCount(0);
          }
        },
        (errorMessage)=>{
          toastError.fire({
            title : errorMessage
          })
        }
    );
  }
  
  function getRaisedInvoiceCount() {
    return requestHandler(
      async () => {
        return await GetInvoiceNull()
      },
      (data) => {
        if (data.data.length > 0)
          {
            setNotificationCount1(data.data.length)
        }else {
          setNotificationCount1(0)
        }
      },
      (errorMessage) => {
        toastError.fire ({
          title: errorMessage
        })
      }
    )
  }

  function getRaisedPaymentCount() {
    return requestHandler(
      async () => {
        return await getreceiptnotification()
      },
      (data) => {
        if (data.data.length > 0)
          {
            setNotificationCount2(data.data.length)
        }else {
          setNotificationCount2(0)
        }
      },
      (errorMessage) => {
        toastError.fire ({
          title: errorMessage
        })
      }
    )
  }

  function getDueDateCount() 
  {
    return requestHandler(
      async () => {
        return await getduedatenotification()
      },
      (data) => {
        if (data.data.length > 0)
        {
          setDuedatecount(data.data.length)
        }
        else {
          setDuedatecount(0)
        }
      },
      (errorMessage) => {
        toastError.fire ({
          title: errorMessage
        })
      }
    )
  }

  useEffect(() => {
    getCountOfAssignedtasks();
    getRaisedInvoiceCount();
    getRaisedPaymentCount();
    getDueDateCount();
  
  },[])




  async function subscribeUser() {
    const publicVapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
  
    try {
      if (Notification.permission === "default") {
        const result = await Swal.fire({
          title: "Please Note",
          text: "Please allow notifications to stay updated!",
          imageUrl: "/allow-notification.png",
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: "Custom image",
          confirmButtonText: "OK"
        });
  
        if (result.isConfirmed) {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            console.log("Notification permission denied.");
            return;
          }
        } else {
          console.log("User did not confirm the notification request.");
          return;
        }
      } else if (Notification.permission === "denied") {
        alert("Notifications are blocked. Please enable them in your browser settings.");
        return;
      }
  
      const registration = await navigator.serviceWorker.ready;
      console.log('Service Worker is ready:', registration);
  
      let subscription = await registration.pushManager.getSubscription();
      
      // Always make the API call to subscribe, even if a subscription exists
      if (!subscription) {
        // If no subscription exists, create a new one
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
      }
  
      // Prepare the subscription data
      const subscriptionData = JSON.parse(JSON.stringify(subscription));
  
      // Make the API call to subscribe (even if it's already subscribed)
      await axios.post('/notification/subscribe', {
        endpoint: subscriptionData.endpoint,
        p256dh: subscriptionData.keys.p256dh,
        auth: subscriptionData.keys.auth
      });
  
      console.log("User is subscribed to push notifications");
  
      // Optionally, store subscription status locally
      localStorage.setItem('notification-subscribed', 'true');
  
    } catch (error) {
      // console.error('Subscription failed:', error);
    }
  }
  
  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js?v=44');
      console.log('Service Worker registered with scope:', registration.scope);
  
      await subscribeUser();
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
  
  useEffect(() => {
    // console.log('Effect triggered');
    if (currentBranch && currentEntity && (localStorage.getItem('notification-subscribed') !== 'true')) {
      if ('serviceWorker' in navigator) {
        registerServiceWorker();
      }
    }
  }, []);
  

  return (
    <NotificationContext.Provider value={{ notificationCount, setNotificationCount, getCountOfAssignedtasks,notificationCount1,setNotificationCount1,getRaisedInvoiceCount,notificationCount2,setNotificationCount2,getRaisedPaymentCount, dueDateCount, setDuedatecount, getDueDateCount}}>
      {children}
    </NotificationContext.Provider>
  );
};
