import {TextInput} from '@/components';
import {database} from '@/database/database';
import WellnessPartner from '@/database/models/WellnessPartner';
import {Q} from '@nozbe/watermelondb';
import React, {useState} from 'react';
import {Button, ScrollView, Text} from 'react-native';
import useStyles from './styles';

export default function AddWellnessPartner() {
  // const { user } = useAuth();
  // const userId = '12tsf5saazxcvhbj';
  const styles = useStyles();

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    profileImage: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setForm({...form, [field]: value});
  };

  const handleSubmit = async () => {
    const {fullName, phoneNumber, age, gender, profileImage} = form;

    try {
      const wellnessPartnerCollection =
        database.get<WellnessPartner>('wellness_partners');
      const userCollection = database.get('users');

      await database.write(async () => {
        const emailAddress = 'samadu@gmail.com';
        const users = await userCollection
          .query(Q.where('email_address', emailAddress))
          .fetch();

        if (users.length === 0) {
          console.error('No user found with the provided userAuthId');
          return;
        }
        // const foundUser = users[0];

        await wellnessPartnerCollection.create(wellnessPartner => {
          // const wellnessPartner = record as unknown as WellnessPartnerProps;
          wellnessPartner.fullName = fullName;
          wellnessPartner.phoneNumber = phoneNumber;
          wellnessPartner.age = parseInt(age, 10);
          wellnessPartner.gender = gender;
          wellnessPartner.profileImage = profileImage || undefined;

          // wellnessPartner.user.set(foundUser);
        });

        console.log('Wellness Partner added successfully');
      });
    } catch (error) {
      console.error('Error adding wellness partner:', error);
    }
  };

  const deleteTableDetails = async () => {
    try {
      const wellnessPartnerCollection = database.get('medicine_timings');

      const allPartners = await wellnessPartnerCollection.query().fetch();
      await database.write(async () => {
        const deletions = allPartners.map(partner =>
          partner.prepareDestroyPermanently(),
        );

        await database.batch(...deletions);
        console.log('All wellness partners deleted successfully');
      });
    } catch (error) {
      console.error('Error deleting wellness partners:', error);
    }
  };

  const getWellnessPartnersDetails = async () => {
    const wellnessPartnerCollection = await database.get('medicine_timings');
    const partners = await wellnessPartnerCollection.query().fetch();
    const formattedPartners = partners.map((partner: any) => partner._raw);
    console.log('wellness partners ==>', formattedPartners);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        value={form.fullName}
        onChangeText={value => handleInputChange('fullName', value)}
        placeHolder="Enter full name"
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        value={form.phoneNumber}
        onChangeText={value => handleInputChange('phoneNumber', value)}
        placeHolder="Enter phone number"
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        value={form.age}
        onChangeText={value => handleInputChange('age', value)}
        placeHolder="Enter age"
      />

      <Text style={styles.label}>Gender</Text>
      <TextInput
        value={form.gender}
        onChangeText={value => handleInputChange('gender', value)}
        placeHolder="Enter gender (e.g., Male, Female, Other)"
      />
      <Text style={styles.label}>Profile Image (Optional)</Text>
      <TextInput
        value={form.profileImage}
        onChangeText={value => handleInputChange('profileImage', value)}
        placeHolder="Enter image URL"
      />

      <Button title="add wellness partner" onPress={handleSubmit} />
      <Button
        title="get wellness partner"
        onPress={getWellnessPartnersDetails}
      />
      <Button title="delete" onPress={deleteTableDetails} />
    </ScrollView>
  );
}
