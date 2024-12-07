import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Text from '../Text';
import useStyles from './styles';

type MedicineTypes = 'Capsule' | 'Injection' | 'Ointment' | 'Syrup';
type TimeOfDay = ('Morning' | 'Afternoon' | 'Evening' | 'Night')[];

type AlertProps = {
  fullName: string;
  medicineName: string;
  doseDetails: string;
  medicineType?: MedicineTypes;
  timeOfDay?: TimeOfDay;
  time: string;
  currentTimeOfDay: string;
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
