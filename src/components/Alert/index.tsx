import React from 'react';
import {Image, Text as RnText, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useStyles from './styles';

type MedicineTypes = 'Capsule' | 'Injection' | 'Ointment' | 'Syrup';
type TimeOfDay = ('Morning' | 'Afternoon' | 'Evening' | 'Night')[];

type AlertProps = {
  fullName: string;
  medicineName: string;
  doseDetails: string;
  medicineType?: MedicineTypes;
  timeOfDay?: TimeOfDay;
  time?: string;
  currentTimeOfDay?: string;
};

export default function CustomAlert({
  fullName,
  medicineName,
  doseDetails,
  medicineType = 'Capsule',
  //   timeOfDay,
  time,
  currentTimeOfDay,
}: AlertProps) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imagePlaceholder}>
          <Image
            source={require('@/assets/images/Medicines/injection-hignlight.png')}
            style={{height: 60, width: 60}}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <RnText
              style={{
                fontSize: 22,
                fontWeight: '500',
                color: '#fff',
                flexShrink: 1,
                overflow: 'hidden',
                maxWidth: '100%', // Adjust to limit the width
              }}
              numberOfLines={1}
              ellipsizeMode="tail">
              {medicineName}
            </RnText>
          </View>
          <RnText
            style={{
              fontSize: 18,
              fontWeight: '400',
              color: '#fff',
              width: 'auto',
            }}>{`Wellness Partner : ${fullName}`}</RnText>
          <View style={styles.doseRow}>
            <RnText
              style={{
                fontSize: 15,
                fontWeight: '400',
                color: '#fff',
              }}>
              {doseDetails}
            </RnText>
            <View style={styles.separator} />
            <RnText
              style={{
                fontSize: 16,
                fontWeight: '400',
                color: '#fff',
              }}>
              {medicineType}
            </RnText>
          </View>
          <View
            style={{
              marginTop: 20,
            }}>
            <RnText style={{fontSize: 16, fontWeight: '400', color: '#fff'}}>
              {'After breakfast'}
            </RnText>
            <RnText style={{fontSize: 16, fontWeight: '400', color: '#fff'}}>
              {'10:00 AM'}
            </RnText>
          </View>
        </View>
      </View>

      {/* Separator */}
      <View style={styles.divider} />

      <View style={styles.actionButtons}>
        <View style={styles.actionItem}>
          <View style={styles.smallImagePlaceholder}>
            <Icon name="close" size={28} color="#fff" />
          </View>
          <TouchableOpacity>
            <RnText style={{fontSize: 21, fontWeight: '400', color: '#fff'}}>
              Skip
            </RnText>
          </TouchableOpacity>
        </View>

        <View style={styles.actionItem}>
          <View style={styles.smallImagePlaceholder}>
            <Icon name="check" size={28} color="#fff" />
          </View>
          <TouchableOpacity style={styles.doneButton}>
            <RnText style={{fontSize: 21, fontWeight: '400', color: '#fff'}}>
              Done
            </RnText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
