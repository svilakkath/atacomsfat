/* eslint-disable react-hooks/exhaustive-deps */
import {BottomSheet, PreviewModal, TextInput} from '@/components';
import {useUserStore} from '@/store';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import userProfileServices from './services';

type UserProps = {
  fullName: string | undefined;
  phoneNumber: string | undefined;
  emailAddress: string | undefined;
  profileImage?: string;
};
type ResponseProp = {
  success: boolean;
  message: string;
};
const EditUserProfile = () => {
  const {uid} = useUserStore();
  const [userDetails, setUserDetails] = useState<UserProps | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [image, setImage] = useState<string | undefined>(
    'https://via.placeholder.com/100',
  );
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [responseMsg, SetResponseMsg] = useState<ResponseProp | null>(null);

  const getUserDetails = async () => {
    const response = await userProfileServices.getUserDetails(uid);
    if (response.success) {
      setImage(response.userDetails?.profileImage);
      setUserDetails({
        fullName: response.userDetails?.fullName ?? '',
        phoneNumber: response.userDetails?.phoneNumber ?? '',
        emailAddress: response.userDetails?.emailAddress ?? '',
      });
    } else {
      console.error(response.message);
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      try {
        setIsLoading(true);

        const updatedData = {
          fullName: userDetails?.fullName,
          phoneNumber: userDetails?.phoneNumber,
          // profileImage: '',
        };

        const response = await userProfileServices.updateUserDetails(
          uid,
          updatedData,
        );

        if (response.success) {
          SetResponseMsg(response);
          console.log('User details updated successfully.');
          setIsModalVisible(true);
        } else {
          console.error('Failed to update user details:', response.message);
        }
      } catch (error) {
        console.error('Error updating user details:', error);
      } finally {
        setIsLoading(false);
      }
    }

    // Toggle edit mode
    setIsEditing(!isEditing);
  };
  const handleBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  const openCamera = async () => {
    try {
      ImagePicker.openCamera({
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
        cropping: true,
        compressImageQuality: 0.7,
      }).then(async image => {
        setImage(image.path);
        setIsBottomSheetVisible(false);
        if (image.path) {
          const response = await userProfileServices.updateProfileImage(
            uid,
            image.path,
          );
          console.log('response', response);
        }
      });
    } catch (error) {
      console.error('Error updating user photo:', error);
    } finally {
    }
  };

  const openGallery = async () => {
    try {
      ImagePicker.openPicker({
        // width: 300,
        // height: 400,
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
        cropping: true,
        compressImageQuality: 0.7,
      }).then(async image => {
        setImage(image.path);
        setIsBottomSheetVisible(false);
        if (image.path) {
          const response = await userProfileServices.updateProfileImage(
            uid,
            image.path,
          );
          SetResponseMsg(response);
        }
      });
    } catch (error) {
      console.error('Error updating user photo:', error);
    } finally {
    }
  };

  const handlePreviewModal = () => {
    if (deleteModal) {
      deleteImage();
      setDeleteModal(false);
    } else {
      setIsModalVisible(false);
      SetResponseMsg(null);
    }
  };

  const handleDelete = () => {
    setIsModalVisible(true);
    setDeleteModal(true);
    SetResponseMsg({
      success: false,
      message: 'Are you sure want to delete ?',
    });
  };

  const deleteImage = async () => {
    try {
      setIsLoading(true);
      const response = await userProfileServices.deleteUserPhoto(uid);
      if (response.success) {
        SetResponseMsg(response);
        // setIsModalVisible(true);
        setImage('');
      }
    } catch (error) {
      console.error('Error updating user photo:', error);
    } finally {
      setIsLoading(false);
      // setTimeout(() => {
      // setIsModalVisible(false);
      // }, 2000);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <>
      {isModalVisible && (
        <PreviewModal
          isVisible={isModalVisible}
          message={responseMsg?.message}
          onClose={handlePreviewModal}
          buttonText={
            isLoading ? 'Loading..' : deleteModal ? 'Delete' : 'Close'
          }
          buttonStyle={
            responseMsg?.success ? styles.successButton : styles.failButton
          }
        />
      )}
      <View style={styles.container}>
        {/* Profile Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                image && image.trim() !== ''
                  ? image
                  : 'https://via.placeholder.com/100',
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.editImageButton}
            onPress={() => setIsBottomSheetVisible(true)}>
            <Text style={styles.editImageText}>Add photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.yourInfo}>
          <Text style={styles.yourInfoText}>Your Information</Text>
          <TouchableOpacity onPress={handleEdit} style={styles.yourInfoButton}>
            <Text style={styles.yourInfoButtonText}>
              {isLoading ? 'Loading...' : isEditing ? 'Save' : 'Edit details'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={userDetails?.fullName ?? ''}
            onChangeText={text =>
              setUserDetails(prev => ({...prev, fullName: text} as UserProps))
            }
            placeHolder="Enter full name"
            editable={isEditing}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={userDetails?.phoneNumber ?? ''}
            onChangeText={text =>
              setUserDetails(
                prev => ({...prev, phoneNumber: text} as UserProps),
              )
            }
            placeHolder="Enter phone number"
            editable={isEditing}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            value={userDetails?.emailAddress ?? ''}
            onChangeText={text =>
              setUserDetails(
                prev => ({...prev, emailAddress: text} as UserProps),
              )
            }
            placeHolder="Enter email address"
            editable={false}
          />
        </View>
      </View>
      <BottomSheet
        isVisible={isBottomSheetVisible}
        onClose={handleBottomSheet}
        initialHeight={150}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: 10,
            marginTop: 25,
          }}>
          <View style={{marginHorizontal: 0}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#007BFF',
                padding: 10,
                borderRadius: 5,
              }}
              onPress={openCamera}>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Take Photo
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginHorizontal: 0}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#28A745',
                padding: 10,
                borderRadius: 5,
              }}
              onPress={openGallery}>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Open Gallery
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginHorizontal: 0}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#007BFF',
                padding: 10,
                borderRadius: 5,
              }}
              onPress={handleDelete}>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Remove Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </>
  );
};

export default EditUserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  yourInfoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  yourInfoButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  yourInfoText: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 50,
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
  yourInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  successButton: {
    backgroundColor: 'green',
  },
  failButton: {
    backgroundColor: 'red',
  },
});
