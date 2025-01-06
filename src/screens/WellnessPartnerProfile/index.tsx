import {
  BottomSheet,
  Header,
  Loader,
  PreviewModal,
  TextInput,
} from '@/components';
import {RootStackParamList} from '@/types/common';
import {NavigationProp, RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WellnessPartnerProfileProps} from '../types';
import wellnessPartnerProfileService from './services';

type WellnessPartnerProfileRouteProp = RouteProp<
  RootStackParamList,
  'WellnessPartnerProfile'
>;
type ResponseProp = {
  success: boolean;
  message: string;
};
type WellnessPartnerProfileNavigationProp = {
  navigation: NavigationProp<RootStackParamList, 'WellnessPartnerProfile'>;
};

const WellnessPartnerProfile = ({
  navigation,
}: WellnessPartnerProfileNavigationProp) => {
  const route = useRoute<WellnessPartnerProfileRouteProp>();
  const {wellnessPartnerId} = route.params;
  const [wellNessPartnerDetails, setWellNessPartnerDetails] =
    useState<WellnessPartnerProfileProps | null>();
  const [initialWellnessPartnerDetails, setInitialWellnessPartnerDetails] =
    useState<WellnessPartnerProfileProps | null>();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const [responseMsg, SetResponseMsg] = useState<ResponseProp | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [image, setImage] = useState<string | undefined>(
    'https://via.placeholder.com/100',
  );

  const [errors, setErrors] = useState<{
    fullName?: string;
    phoneNumber?: string;
    age?: string;
  }>({
    fullName: '',
    phoneNumber: '',
    age: '',
  });

  const validateFields = () => {
    const newErrors: {fullName?: string; phoneNumber?: string; age?: string} =
      {};
    if (!wellNessPartnerDetails?.fullName) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!wellNessPartnerDetails?.phoneNumber) {
      newErrors.phoneNumber = 'Phone Number is required';
    }
    if (!wellNessPartnerDetails?.age) {
      newErrors.age = 'Age is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = async () => {
    if (!validateFields()) {
      return;
    }
    if (isEditing) {
      try {
        setIsLoading(true);

        const updatedData = {
          fullName: wellNessPartnerDetails?.fullName,
          phoneNumber: wellNessPartnerDetails?.phoneNumber,
          age: wellNessPartnerDetails?.age,
        };

        const response =
          await wellnessPartnerProfileService.updateWellnessPartnerDetails(
            wellnessPartnerId,
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

    setIsEditing(!isEditing);
  };

  async function getWellnessPartnerDetails() {
    try {
      setLoader(true);
      const data =
        await wellnessPartnerProfileService.getWellnessPartnerDetails(
          wellnessPartnerId,
        );
      setImage(data.wellnessPartnerDetails?.profileImage);
      setWellNessPartnerDetails(data.wellnessPartnerDetails);
      setInitialWellnessPartnerDetails(data.wellnessPartnerDetails);
    } catch (error) {
      console.error('Error getting wellmness partner details:', error);
    } finally {
      setLoader(false);
    }
  }

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
      const response =
        await wellnessPartnerProfileService.deleteWellnessPartnerPhoto(
          wellnessPartnerId,
        );
      if (response.success) {
        SetResponseMsg(response);
        setIsModalVisible(true);
        setImage('');
      }
    } catch (error) {
      console.error('Error updating user photo:', error);
    } finally {
      setIsLoading(false);
      setIsBottomSheetVisible(false);
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
          const response =
            await wellnessPartnerProfileService.updateProfileImage(
              wellnessPartnerId,
              image.path,
            );
          SetResponseMsg(response);
        }
      });
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
      SetResponseMsg(null);
    }
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
          const response =
            await wellnessPartnerProfileService.updateProfileImage(
              wellnessPartnerId,
              image.path,
            );
          console.log('response', response);

          // SetResponseMsg(response);
        }
      });
    } catch (error) {
      console.error('Error updating Wellness Partner photo:', error);
    } finally {
      setIsBottomSheetVisible(false);
    }
  };

  const handleBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setWellNessPartnerDetails(initialWellnessPartnerDetails);
    setErrors({
      age: '',
      fullName: '',
      phoneNumber: '',
    });
  };

  useEffect(() => {
    getWellnessPartnerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loader && <Loader gap={10} size={20} />}
      {isModalVisible && (
        <PreviewModal
          isVisible={isModalVisible}
          message={responseMsg?.message}
          onClose={handlePreviewModal}
          buttonText={isLoading ? 'Loading..' : deleteModal ? 'Delete' : 'Done'}
          buttonStyle={
            responseMsg?.success ? styles.successButton : styles.failButton
          }
          onCancel={() => setIsModalVisible(false)}
        />
      )}
      <View style={styles.container}>
        <View style={styles.navigator}>
          <Header
            title="Wellness Partner Details"
            onBackPress={() => navigation.goBack()}
          />
        </View>
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
            {/* <Text style={styles.editImageText}>Add photo</Text> */}
            <Icon name="camera" size={28} color="#555555" />
          </TouchableOpacity>
        </View>

        <View style={styles.yourInfo}>
          <Text style={styles.yourInfoText}>Your Information</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={handleEdit}
              style={isEditing ? styles.saveButton : styles.editButton}>
              <Text style={styles.yourInfoButtonText}>
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
            value={wellNessPartnerDetails?.fullName ?? ''}
            onChangeText={text => {
              setWellNessPartnerDetails(
                prev =>
                  ({...prev, fullName: text} as WellnessPartnerProfileProps),
              );
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
            onIconPress={() =>
              setWellNessPartnerDetails(
                prev =>
                  ({...prev, fullName: ''} as WellnessPartnerProfileProps),
              )
            }
            iconType={isEditing ? 'close' : undefined}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={wellNessPartnerDetails?.phoneNumber ?? ''}
            onChangeText={text => {
              setWellNessPartnerDetails(
                prev =>
                  ({
                    ...prev,
                    phoneNumber: text,
                  } as WellnessPartnerProfileProps),
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
              } else if (text.trim().length < 10) {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  phoneNumber: 'Phone number should be at least 10 digits.',
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
            onIconPress={() =>
              setWellNessPartnerDetails(
                prev =>
                  ({
                    ...prev,
                    phoneNumber: '',
                  } as WellnessPartnerProfileProps),
              )
            }
            iconType={isEditing ? 'close' : undefined}
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}
          <Text style={styles.label}>Age</Text>
          <TextInput
            value={wellNessPartnerDetails?.age?.toString() ?? ''}
            onChangeText={text => {
              const age = parseInt(text, 10);
              setWellNessPartnerDetails(
                prev =>
                  ({
                    ...prev,
                    age: isNaN(age) ? null : age,
                  } as WellnessPartnerProfileProps),
              );

              // Validation for age
              if (text.trim() === '') {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  age: 'Age is required.',
                }));
              } else if (isNaN(age) || age <= 0) {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  age: 'Please enter a valid age greater than 0.',
                }));
              } else {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  age: '', // Clear the error if input is valid
                }));
              }
            }}
            placeHolder="Enter age"
            editable={isEditing}
            onIconPress={() => {
              setWellNessPartnerDetails(
                prev =>
                  ({
                    ...prev,
                    age: null,
                  } as unknown as WellnessPartnerProfileProps),
              );
              setErrors(prevErrors => ({
                ...prevErrors,
                age: '', // Reset error when clearing the field
              }));
            }}
            iconType={isEditing ? 'close' : undefined}
          />

          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

          <Text style={styles.label}>gender</Text>
          <TextInput
            value={wellNessPartnerDetails?.gender ?? ''}
            onChangeText={text =>
              setWellNessPartnerDetails(
                prev =>
                  ({...prev, gender: text} as WellnessPartnerProfileProps),
              )
            }
            placeHolder="Enter gender"
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

export default WellnessPartnerProfile;

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
  cancelButton: {
    backgroundColor: 'tomato',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 13,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
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
    // backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  editImageText: {
    color: '#fff',
    fontSize: 14,
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
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
  navigator: {
    marginBottom: 20,
  },
});
