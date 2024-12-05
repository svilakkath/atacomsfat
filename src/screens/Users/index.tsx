import {database} from '@/database/database';
import User from '@/database/models/User';
import {Model, Q} from '@nozbe/watermelondb';
import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, TextInput} from 'react-native';

type WellnessPartnerProps = {
  fullName: string;
  phoneNumber: string;
  age: number;
  gender: string;
  profileImage?: string;
  user: User;
};

type UserDetailsProps = {
  fullName: string;
  phoneNumber: number;
  emailAddress: string;
  password: string;
  profileImage: string;
  userAuthId: string;
};

export default function AddWellnessPartner() {
  // const { user } = useAuth();
  const userId = '12tsf5saazxcvhbj';
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
      const wellnessPartnerCollection = database.get('wellness_partners');
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
        const foundUser = users[0];

        await wellnessPartnerCollection.create((record: Model) => {
          const wellnessPartner = record as unknown as WellnessPartnerProps;
          wellnessPartner.fullName = fullName;
          wellnessPartner.phoneNumber = phoneNumber;
          wellnessPartner.age = parseInt(age, 10);
          wellnessPartner.gender = gender;
          wellnessPartner.profileImage = profileImage || undefined;

          wellnessPartner.user.set(foundUser);
        });

        console.log('Wellness Partner added successfully');
      });
    } catch (error) {
      console.error('Error adding wellness partner:', error);
    }
  };

  const deleteTableDetails = async () => {
    try {
      const wellnessPartnerCollection = database.get('medicines_details');

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
    const wellnessPartnerCollection = await database.get('wellness_partners');
    const partners = await wellnessPartnerCollection.query().fetch();
    const formattedPartners = partners.map((partner: any) => partner._raw);
    console.log('wellness partners ==>', formattedPartners);
  };

  const getAllUser = async () => {
    const wellnessPartnerCollection = await database.get('users');
    const partners = await wellnessPartnerCollection.query().fetch();
    const formattedPartners = partners.map((partner: any) => partner._raw);
  };

  const addNewUser = async () => {
    try {
      await database.write(async () => {
        await database.get('users').create((record: Model) => {
          const user = record as unknown as UserDetailsProps;
          user.fullName = 'samadu';
          user.phoneNumber = 34567890;
          user.emailAddress = 'samadu@gmail.com';
          user.password = '123456789';
          user.profileImage = '';
          user.userAuthId = '12345';
        });

        console.log('Random user added successfully');
      });
    } catch (error) {
      console.error('Error adding random user:', error);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={form.fullName}
        onChangeText={value => handleInputChange('fullName', value)}
        placeholder="Enter full name"
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={form.phoneNumber}
        onChangeText={value => handleInputChange('phoneNumber', value)}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={form.age}
        onChangeText={value => handleInputChange('age', value)}
        placeholder="Enter age"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Gender</Text>
      <TextInput
        style={styles.input}
        value={form.gender}
        onChangeText={value => handleInputChange('gender', value)}
        placeholder="Enter gender (e.g., Male, Female, Other)"
      />

      <Text style={styles.label}>Profile Image (Optional)</Text>
      <TextInput
        style={styles.input}
        value={form.profileImage}
        onChangeText={value => handleInputChange('profileImage', value)}
        placeholder="Enter image URL"
      />

      <Button title="Add user" onPress={addNewUser} />
      <Button title="add wellness partner" onPress={handleSubmit} />
      <Button
        title="get wellness partner"
        onPress={getWellnessPartnersDetails}
      />
      <Button title="delete" onPress={deleteTableDetails} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
