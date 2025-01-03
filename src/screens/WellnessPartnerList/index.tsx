import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {CustomCard, Header, Loader, PreviewModal} from '@/components';
import {useUserStore} from '@/store';
import {RootStackParamList} from '@/types/common';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AllWellnessPartnersDetailsProps} from '../types';
import wellnessPartnerList from './services';

type WellnessListProps = {
  navigation: NavigationProp<RootStackParamList, 'WellnessPartnerHome'>;
};

const WellnessPartnerList = ({navigation}: WellnessListProps) => {
  const {uid} = useUserStore();
  const [partners, setPartners] = useState<AllWellnessPartnersDetailsProps[]>(
    [],
  );
  console.log('rendering');

  const [loading, setLoading] = useState<boolean>(true);
  const [deleteoading, setDeleteLoading] = useState<boolean>(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectePartner, setSelectePartner] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    getWellnessPartnersDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getWellnessPartnersDetails = async () => {
    setLoading(true);
    try {
      const responseData = await wellnessPartnerList.getWellnessPartnersList(
        uid,
      );
      if (responseData) {
        setPartners(responseData);
      }
    } catch (error) {
      console.error('Error fetching wellness partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationToDetails = (
    wellnessPartner: AllWellnessPartnersDetailsProps,
  ) => {
    navigation.navigate('WellnessPartnerHome', {wellnessPartner});
  };

  async function handleDelete() {
    setDeleteLoading(true);
    if (selectePartner && selectePartner.id) {
      try {
        const result = await wellnessPartnerList.deleteWellnessPartnerById(
          selectePartner.id,
        );
        if (result.success) {
          setPartners(prevPartners =>
            prevPartners.filter(partner => partner.id !== selectePartner.id),
          );
        }
      } catch (error) {
        console.error('Error fetching wellness partners:', error);
      } finally {
        setTimeout(() => {
          setDeleteLoading(false);
          setIsModalVisible(false);
          setSelectePartner(null);
        }, 1500);
      }
    }
  }

  const handleSelect = (item: AllWellnessPartnersDetailsProps) => {
    setIsModalVisible(true);
    setSelectePartner({id: item.id, name: item.fullName});
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('useFocusEffect');

      getWellnessPartnersDetails();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid]),
  );

  const renderPartner = ({item}: {item: AllWellnessPartnersDetailsProps}) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleNavigationToDetails(item)}>
      <CustomCard
        subText={item.gender}
        mainText={item.fullName}
        imageUrl={item.profileImage}
        rightComponent={
          <TouchableOpacity onPress={() => handleSelect(item)}>
            <Icon name="trash-can-outline" size={24} color="#cd5c5c" />
          </TouchableOpacity>
        }
      />
    </TouchableOpacity>
  );

  return (
    <>
      <PreviewModal
        isVisible={isModalVisible}
        message={`Are you sure you want to delete "${selectePartner?.name}"?`}
        onClose={handleDelete}
        buttonText={deleteoading ? 'Loading..' : 'Delete'}
        buttonStyle={styles.deleteButton}
        buttonTextStyle={styles.buttonText}
        onCancel={() => setIsModalVisible(false)}
      />
      <View style={styles.container}>
        <Header
          title="Wellness Partners List"
          onBackPress={() => navigation.goBack()}
          rightComponent={
            <TouchableOpacity
              onPress={() => navigation.navigate('AddWellnessPartner')}
              style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          }
          showBackArrow={false}
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            {/* <Text>Loading...</Text> */}
            <Loader gap={10} size={15} />
          </View>
        ) : (
          <FlatList
            data={partners}
            keyExtractor={item => item.id}
            renderItem={renderPartner}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </>
  );
};

export default WellnessPartnerList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  addButton: {
    height: 35,
    width: 60,
    backgroundColor: '#3cb371',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
