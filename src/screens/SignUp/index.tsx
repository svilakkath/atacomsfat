import Swiper from '@/components/CustomSwiper';
import React, {useRef, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

type FormFields = {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
};

const SignUp = () => {
  const swiperRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [form, setForm] = useState<FormFields>({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    password: '',
  });
  const goToNextPage = () => {
    if (swiperRef.current && currentPage < 1) {
      swiperRef.current.goToPage(currentPage + 1);
      setCurrentPage(currentPage + 1);
    } else {
      handleSubmit();
    }
  };

  const goToPreviousPage = () => {
    if (swiperRef.current && currentPage > 0) {
      swiperRef.current.goToPage(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async () => {
    // Mock submission logic
    console.log('Profile Updated', form);
    // const userAuthId = '12der54ty'; // from clerk
    const {} = form;

    // db updation
    // try {
    //   const userDbinformation = database.get<User>('users');
    //   await database.write(async () => {
    //     await userDbinformation.create(userDetails => {
    //       // const userDetails = record as unknown as UserDetailsProps;
    //       userDetails.fullName = fullName;
    //       userDetails.emailAddress = emailAddress;
    //       userDetails.password = password;
    //       userDetails.phoneNumber = phoneNumber;
    //       userDetails.userAuthId = userAuthId;
    //       userDetails.profileImage = '';
    //     });
    //     console.log('user added successfully');
    //   });
    // } catch (error) {
    //   console.error('Error adding user details:', error);
    // }
  };

  const handleInputChange = (field: keyof FormFields, value: string) => {
    setForm({...form, [field]: value});
  };

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        onPageChanged={(pageIndex: number) => setCurrentPage(pageIndex)}>
        <View>
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
        </View>

        <View>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={form.emailAddress}
            onChangeText={value => handleInputChange('emailAddress', value)}
            placeholder="Enter email address"
            keyboardType="email-address"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={form.password}
            onChangeText={value => handleInputChange('password', value)}
            placeholder="Enter new password"
            secureTextEntry
          />
        </View>
      </Swiper>

      <View style={styles.buttonContainer}>
        {currentPage > 0 && <Button title="Back" onPress={goToPreviousPage} />}
        <Button
          title={currentPage === 1 ? 'Submit' : 'Next'}
          onPress={goToNextPage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});

export default SignUp;
