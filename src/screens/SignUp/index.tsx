import {TextInput} from '@/components';
import Swiper from '@/components/CustomSwiper';
import React, {useRef, useState} from 'react';
import {Button, Text, View} from 'react-native';
import useStyles from './styles';

type FormFields = {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
};

const SignUp = () => {
  const swiperRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const styles = useStyles();

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
        <View
          style={{
            width: '100%',
            height: '100%',
          }}>
          <View>
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
          </View>
        </View>

        <View style={{width: '100%', height: '100%'}}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            value={form.emailAddress}
            onChangeText={value => handleInputChange('emailAddress', value)}
            placeHolder="Enter email address"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={form.password}
            onChangeText={value => handleInputChange('password', value)}
            placeHolder="Enter password"
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

export default SignUp;
