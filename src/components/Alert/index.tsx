import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from '../Text';

type MedicineTypes = 'Capsule' | 'Injection' | 'Ointment' | 'Syrup';
type TimeOfDay = ('Morning' | 'Afternoon' | 'Evening' | 'Night')[];

type AlertProps = {
  fullName: string;
  medicineName: string;
  doseDetails: string;
  medicineType?: MedicineTypes;
  timeOfDay?: TimeOfDay; // Normally a medicine is used multiple times in a day
  time: string;
  currentTimeOfDay: string; // Specific time (e.g., 'Morning') when alert triggers
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
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        {/* Placeholder for Image */}
        <View style={styles.imagePlaceholder}>
          <Text title="Img" />
        </View>

        {/* Medicine Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text title={`Medicine for: ${fullName}`} />
          </View>
          <Text title={`Medicine Name: ${medicineName}`} />
          <View style={styles.doseRow}>
            <Text title={`Dose: ${doseDetails}`} />
            <View style={styles.separator} />
            <Text title={medicineType} />
          </View>
        </View>
      </View>

      {/* Time Section */}
      <View style={styles.timeSection}>
        <Text title="Timing" />
        <View style={styles.timeRow}>
          <Text title={currentTimeOfDay} />
          <View style={styles.spacer} />
          <Text title={time} />
        </View>
      </View>

      {/* Separator */}
      <View style={styles.divider} />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {/* Skip Button */}
        <View style={styles.actionItem}>
          <View style={styles.smallImagePlaceholder}>
            <Text title="Img" />
          </View>
          <TouchableOpacity>
            <Text title="Skip" />
          </TouchableOpacity>
        </View>

        {/* Done Button */}
        <View style={styles.actionItem}>
          <View style={styles.smallImagePlaceholder}>
            <Text title="Img" />
          </View>
          <TouchableOpacity style={styles.doneButton}>
            <Text title="Done" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 15,
    width: 4,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  timeSection: {
    marginBottom: 15,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    width: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  smallImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  doneButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D4EDDA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
