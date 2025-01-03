/* eslint-disable react-hooks/exhaustive-deps */
import {BottomSheet, Loader, PreviewModal, TextInput} from '@/components';
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
  const [initialUserDetails, setInitialUserDetails] =
    useState<UserProps | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  console.log('vibing');

  const [loader, setLoader] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [image, setImage] = useState<string | undefined>(
    'https://via.placeholder.com/100',
  );
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [responseMsg, setResponseMsg] = useState<ResponseProp | null>(null);
  const [errors, setErrors] = useState<{
    fullName?: string;
    phoneNumber?: string;
  }>({
    fullName: '',
    phoneNumber: '',
  });
  const validateFields = () => {
    const newErrors: {fullName?: string; phoneNumber?: string} = {};
    if (!userDetails?.fullName) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!userDetails?.phoneNumber) {
      newErrors.phoneNumber = 'Phone Number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getUserDetails = async () => {
    try {
      setLoader(true);
      const response = await userProfileServices.getUserDetails(uid);
      if (response.success) {
        setImage(response.userDetails?.profileImage);
        const {fullName, phoneNumber, emailAddress} =
          response.userDetails || {};
        setUserDetails({
          fullName: fullName ?? '',
          phoneNumber: phoneNumber ?? '',
          emailAddress: emailAddress ?? '',
        });
        setInitialUserDetails({
          fullName: fullName ?? '',
          phoneNumber: phoneNumber ?? '',
          emailAddress: emailAddress ?? '',
        });
      }
    } catch (error) {
      console.error('Error getting user details:', error);
    } finally {
      setLoader(false);
    }
  };

  const handleEdit = async () => {
    if (!validateFields()) {
      return;
    }

    if (isEditing) {
      try {
        setIsLoading(true);
        const updatedData = {
          fullName: userDetails?.fullName,
          phoneNumber: userDetails?.phoneNumber,
        };
        const response = await userProfileServices.updateUserDetails(
          uid,
          updatedData,
        );
        if (response.success) {
          setResponseMsg(response);
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
    setIsEditing(!isEditing);
  };

  const handleBottomSheet = () => setIsBottomSheetVisible(false);

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
        cropping: true,
        compressImageQuality: 0.7,
      });
      setImage(image.path);
      setIsBottomSheetVisible(false);
      if (image.path) {
        await userProfileServices.updateProfileImage(uid, image.path);
      }
    } catch (error) {
      console.error('Error updating user photo:', error);
    } finally {
      setIsBottomSheetVisible(false);
    }
  };

  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
        cropping: true,
        compressImageQuality: 0.7,
      });
      setImage(image.path);
      setIsBottomSheetVisible(false);
      if (image.path) {
        const response = await userProfileServices.updateProfileImage(
          uid,
          image.path,
        );
        setResponseMsg(response);
      }
    } catch (error) {
      console.error('Error updating user photo:', error);
    } finally {
      setIsBottomSheetVisible(false);
    }
  };

  const handlePreviewModal = () => {
    if (deleteModal) {
      deleteImage();
      setDeleteModal(false);
    } else {
      setIsModalVisible(false);
      setResponseMsg(null);
    }
  };

  const handleDelete = () => {
    setIsModalVisible(true);
    setDeleteModal(true);
    setResponseMsg({success: false, message: 'Are you sure want to delete?'});
  };

  const deleteImage = async () => {
    try {
      setIsLoading(true);
      const response = await userProfileServices.deleteUserPhoto(uid);
      if (response.success) {
        setResponseMsg(response);
        setImage('');
      }
    } catch (error) {
      console.error('Error deleting user photo:', error);
    } finally {
      setIsLoading(false);
      setIsBottomSheetVisible(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUserDetails(initialUserDetails);
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <>
      {loader && <Loader gap={15} size={20} />}
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
        <View style={styles.imageContainer}>
          <Image
            source={{uri: image?.trim() || 'https://via.placeholder.com/100'}}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.editImageButton}
            onPress={() => setIsBottomSheetVisible(true)}>
            <Text style={styles.editImageText}>Add photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Your Information</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={handleEdit}
              style={isEditing ? styles.saveButton : styles.editButton}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Loading...' : isEditing ? 'Save' : 'Edit details'}
              </Text>
            </TouchableOpacity>
            {isEditing && (
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={userDetails?.fullName || ''}
            onChangeText={text => {
              setUserDetails(prev => ({...prev, fullName: text} as UserProps));
              if (text.trim() === '') {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  fullName: 'Full name is required.',
                }));
              } else {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  fullName: '',
                }));
              }
            }}
            placeHolder="Enter full name"
            editable={isEditing}
            onIconPress={() => {
              setUserDetails(prev => ({...prev, fullName: ''} as UserProps));
              setErrors(prevErrors => ({
                ...prevErrors,
                fullName: '', // Reset error when clearing the field
              }));
            }}
            iconType={isEditing ? 'close' : undefined}
          />

          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={userDetails?.phoneNumber || ''}
            onChangeText={text => {
              setUserDetails(
                prev => ({...prev, phoneNumber: text} as UserProps),
              );

              // Validation for phone number
              if (text.trim() === '') {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  phoneNumber: 'Phone number is required.',
                }));
              } else if (!/^\d+$/.test(text.trim())) {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  phoneNumber: 'Phone number should only contain digits.',
                }));
              } else {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  phoneNumber: '', // Clear the error if input is valid
                }));
              }
            }}
            placeHolder="Enter phone number"
            editable={isEditing}
            onIconPress={() => {
              setUserDetails(prev => ({...prev, phoneNumber: ''} as UserProps));
              setErrors(prevErrors => ({
                ...prevErrors,
                phoneNumber: '', // Reset error when clearing the field
              }));
            }}
            iconType={isEditing ? 'close' : undefined}
          />

          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            value={userDetails?.emailAddress || ''}
            placeHolder="Enter email address"
            editable={false}
            onChangeText={() => {}}
          />
        </View>
      </View>
      <BottomSheet
        isVisible={isBottomSheetVisible}
        onClose={handleBottomSheet}
        initialHeight={150}>
        <View style={styles.bottomSheetContent}>
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={openCamera}>
            <Text style={styles.bottomSheetButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={openGallery}>
            <Text style={styles.bottomSheetButtonText}>Open Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={handleDelete}>
            <Text style={styles.bottomSheetButtonText}>Remove Photo</Text>
          </TouchableOpacity>
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  editImageText: {
    color: '#fff',
    fontSize: 14,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 13,
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 13,
  },
  cancelButton: {
    backgroundColor: 'tomato',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 13,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  successButton: {
    backgroundColor: 'green',
  },
  failButton: {
    backgroundColor: 'red',
  },
  bottomSheetContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    marginTop: 25,
  },
  bottomSheetButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  bottomSheetButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
