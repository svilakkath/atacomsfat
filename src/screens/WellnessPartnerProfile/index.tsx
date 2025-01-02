import {BottomSheet, Header, PreviewModal, TextInput} from '@/components';
import {RootStackParamList} from '@/types/common';
import {NavigationProp, RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
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
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, SetResponseMsg] = useState<ResponseProp | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [image, setImage] = useState<string | undefined>(
    'https://via.placeholder.com/100',
  );

  const handleEdit = async () => {
    if (isEditing) {
      try {
        setIsLoading(true);

        const updatedData = {
          fullName: wellNessPartnerDetails?.fullName,
          phoneNumber: wellNessPartnerDetails?.phoneNumber,
          age: wellNessPartnerDetails?.age,
          // profileImage: '',
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
    const data = await wellnessPartnerProfileService.getWellnessPartnerDetails(
      wellnessPartnerId,
    );
    setImage(data.wellnessPartnerDetails?.profileImage);

    setWellNessPartnerDetails(data.wellnessPartnerDetails);
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
    }
  };

  const handleBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };
  useEffect(() => {
    getWellnessPartnerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            value={wellNessPartnerDetails?.fullName ?? ''}
            onChangeText={text =>
              setWellNessPartnerDetails(
                prev =>
                  ({...prev, fullName: text} as WellnessPartnerProfileProps),
              )
            }
            placeHolder="Enter full name"
            editable={isEditing}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={wellNessPartnerDetails?.phoneNumber ?? ''}
            onChangeText={text =>
              setWellNessPartnerDetails(
                prev =>
                  ({...prev, phoneNumber: text} as WellnessPartnerProfileProps),
              )
            }
            placeHolder="Enter phone number"
            editable={isEditing}
          />

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
            }}
            placeHolder="Enter age"
            editable={isEditing}
          />

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
