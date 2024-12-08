import {TextInput} from '@/components';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const EditUserProfile = () => {
  return (
    // Header component will implement later
    <View style={styles.container}>
      {/* Profile Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{uri: 'https://via.placeholder.com/100'}}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editImageButton}>
          <Text style={styles.editImageText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* User Information */}
      <Text style={styles.header}>Your Information</Text>
      <View style={styles.form}>
        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={''}
          onChangeText={() => {}}
          placeHolder="Enter full name"
        />

        {/* Phone Number */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          value={''}
          onChangeText={() => {}}
          placeHolder="Enter phone number"
        />

        {/* Email Address */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          value={''}
          onChangeText={() => {}}
          placeHolder="Enter email address"
        />
      </View>
    </View>
  );
};

export default EditUserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  editImageButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  editImageText: {
    color: '#fff',
    fontSize: 14,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
});
