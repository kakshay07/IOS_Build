import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  FlatList,
  Dimensions,
  Button,
  Modal,
  Alert,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const Home = () => {
  const [dataArr, setdataArr] = useState<any>({});

  const [isPopupVisible, setPopupVisible] = useState(false);

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity style={styles.featuredCard}>
      <View style={styles.featuredImageContainer}>
         <Image source={{ uri: item.image }} style={styles.featuredImage} />
      </View>
      <View style={styles.featuredContent}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <Text style={styles.featuredDescription}>{item.description}</Text>
        <View style={styles.featuredFooter}>
          <Text style={styles.featuredPrice}>{item.price}</Text>
          <TouchableOpacity style={styles.featuredButton}>
            <Text style={styles.featuredButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPopularItem = ({ item }) => (
    <TouchableOpacity style={styles.popularCard}>
      <View style={styles.popularImageContainer}>
         <Image source={{ uri: item.image }} style={styles.featuredImage} />
      </View>
      <Text style={styles.popularTitle}>{item.title}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingText}>{item.rating}</Text>
        <Text style={styles.reviewText}>({item.reviews})</Text>
      </View>
    </TouchableOpacity>
  );

  const getData = async () => {
    console.log("hello")
    try {
     await AsyncStorage.getItem('user').then((storedUser) => {
        if (storedUser !== null) {
          console.log('Retrieved Data:', storedUser ,"Sored data");
          setdataArr(JSON.parse(storedUser));
          // return value; // You can set this in a state if needed
        }else{
          router.push("/login");
        }
      });
      console.log('Retrieved Data:', dataArr ,"ABCd");
    
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  useEffect(() => {
    getData();
  }, [])
  function onLogout(){
    setPopupVisible(false)
    AsyncStorage.removeItem('user');
    setdataArr({})
    router.replace("/login");
    Alert.alert("User logged out")
  }
  const employeeActivities = [
    { id: 1, activity: 'System Login', time: '10:20', date: '2025-03-19', status: 'Success' },
    { id: 2, activity: 'File Access', time: '10:35', date: '2025-03-19', status: 'Success' },
    { id: 3, activity: 'Database Query', time: '11:15', date: '2025-03-19', status: 'Success' },
    { id: 4, activity: 'Report Generation', time: '12:30', date: '2025-03-19', status: 'In Progress' },
    { id: 5, activity: 'System Logout', time: '14:10', date: '2025-03-19', status: 'Pending' },
  ];

  

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome,</Text>
          <Text style={styles.userName}>{dataArr?.USER_NAME}</Text>
        </View>
        <View style={styles.headerRight}>
          {/* <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.profileButton} onPress={() => setPopupVisible(true)}>
            {/* <View style={styles.profileImage} /> */}
         <Image source={{ uri: 'https://tse3.mm.bing.net/th?id=OIP.2pQO0z_YDEHDaQwtLZLTdgHaEo&pid=Api&P=0&h=180'}} style={styles.profileImage} />

          </TouchableOpacity>
        </View>
        {isPopupVisible && (
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Profile Options</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} onTouchStart={() => setPopupVisible(false)} >
        {/* Search Bar */}
        {/* <TouchableOpacity style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#777" />
          <Text style={styles.searchText}>Search for products, services...</Text>
        </TouchableOpacity> */}

        {/* Categories */}
        {/* <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  activeCategory == item && styles.activeCategoryButton,
                ]}
                onPress={() => setActiveCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory == item && styles.activeCategoryText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View> */}

        {/* Featured Section */}
        {/* <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredItems}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderFeaturedItem}
            contentContainerStyle={styles.featuredList}
          />
        </View> */}

        {/* Popular Section */}
        {/* <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Now</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popularItems}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderPopularItem}
            contentContainerStyle={styles.popularList}
          />
        </View> */}

        {/* Quick Actions */}
        {/* <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {[
              { name: 'Favorites', icon: 'heart-outline' },
              { name: 'Orders', icon: 'cart-outline' },
              { name: 'Wallet', icon: 'wallet-outline' },
              { name: 'Support', icon: 'chatbubble-outline' },
            ].map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionItem}>
                <View style={styles.quickActionIconContainer}>
                  <Ionicons name={action.icon} size={22} color="#4285F4" />
                </View>
                <Text style={styles.quickActionText}>{action.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}
<View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <FontAwesome name="id-card" size={18} color="#555" />
          <Text style={styles.detailLabel}>Employee ID</Text>
          <Text style={styles.detailValue}>1001</Text>
        </View>
        
        <View style={styles.detailItem}>
          <FontAwesome name="building" size={18} color="#555" />
          <Text style={styles.detailLabel}>Department</Text>
          <Text style={styles.detailValue}>IT</Text>
        </View>
        
        <View style={styles.detailItem}>
          <FontAwesome name="clock-o" size={18} color="#555" />
          <Text style={styles.detailLabel}>Logged in at</Text>
          <Text style={styles.detailValue}>
            {('10 :20')} • {'2025-03-19'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <FontAwesome name="calendar-check-o" size={18} color="#555" />
          <Text style={styles.detailLabel}>Session duration</Text>
          <Text style={styles.detailValue}>{100}</Text>
        </View>
      </View>
    {/* </View> */}
 
    <View style={styles.container1}>
      {/* Table Header */}
      <View style={styles.row}>
        <Text style={styles.headerCell}>Activity</Text>
        <Text style={styles.headerCell}>Time</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Status</Text>
      </View>

      {/* Table Data */}
      <FlatList
        data={employeeActivities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.activity}</Text>
            <Text style={styles.cell}>{item.time}</Text>
            <Text style={styles.cell}>{item.date}</Text>
            <Text
              style={[
                styles.cell,
                { color: item.status == 'Success' ? '#28a745' : item.status == 'In Progress' ? '#ffc107' : '#dc3545' }
              ]}
            >
              {item.status}
            </Text>
          </View>
        )}
      />
    </View>
     

        {/* <View style={{ height: 20 }} /> */}
      </ScrollView>
      

      {/* Navigation Bar */}
      {/* <View style={styles.navigationBar}>
        {[
          { icon: 'home', label: 'Home', active: true },
          { icon: 'compass-outline', label: 'Explore' },
          { icon: 'bookmark-outline', label: 'Saved' },
          { icon: 'person-outline', label: 'Profile' },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.navItem}>
            <Ionicons
              name={item.icon}
              size={24}
              color={item.active ? '#4285F4' : '#888'}
            />
            <Text
              style={[
                styles.navLabel,
                item.active && { color: '#4285F4' },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View> */}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  profileButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchText: {
    fontSize: 15,
    color: '#999',
    marginLeft: 8,
  },
  categoriesContainer: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginLeft: 16,
  },
  activeCategoryButton: {
    backgroundColor: '#4285F4',
  },
  categoryText: {
    fontSize: 14,
    color: '#555',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: '500',
  },
  sectionContainer: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4285F4',
  },
  featuredList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  featuredCard: {
    width: width * 0.75,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredImageContainer: {
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  featuredButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  featuredButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  popularList: {
    paddingLeft: 16,
  },
  popularCard: {
    width: 140,
    marginRight: 12,
  },
  popularImageContainer: {
    height: 140,
    width: 140,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  popularImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  popularTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
  quickActionsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 12,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  quickActionItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#555',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
  },

  // EXTRA FOR POPUP MODAL



  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // Dim background
  },
  popupContainer: {
    width: 150,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#FF4D4D',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e1e1e1',
  },
  nameContainer: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    width: 110,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },

  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  container1: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
});

export default Home;