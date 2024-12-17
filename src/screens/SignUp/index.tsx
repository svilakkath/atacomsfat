/* eslint-disable react-native/no-inline-styles */
import {TextInput} from '@/components';
import Swiper from '@/components/CustomSwiper';
import {RootStackParamList} from '@/types/common';
import auth from '@react-native-firebase/auth';
import {NavigationProp} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {UserSignupProps, ValidationRules} from '../types';
import userService from './services';
import useStyles from './styles';

type ErrorProps = Partial<Record<keyof UserSignupProps, string>>;
const validationRules: Record<keyof UserSignupProps, ValidationRules> = {
  fullName: {
    required: true,
    message: 'Enter full name.',
  },
  phoneNumber: {
    required: true,
    message: 'Phone number is required.',
  },
  emailAddress: {
    required: true,
    message: 'Email is required.',
  },
  password: {
    required: true,
    // validate: value => /^\d+$/.test(value) && parseInt(value, 10) > 0,
    message: 'Duration must be a positive number (in days).',
  },
};
type LoginProps = {
  navigation: NavigationProp<RootStackParamList, 'SignUp'>;
};

const SignUp = ({navigation}: LoginProps) => {
  const swiperRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const styles = useStyles();

  const [form, setForm] = useState<UserSignupProps>({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    password: '',
  });
  const [errors, setErrors] = useState<ErrorProps>({});
  const [submit, setSubmit] = useState(false);
  // const {uid} = useUserStore();

  async function handleSignup() {
    // firebase authentication
    auth()
      .createUserWithEmailAndPassword(form.emailAddress, form.password)
      .then(res => {
        if (res.user.uid) {
          let uid = res.user.uid;
          if (uid) {
            handleUserData(uid);
          }
        } else {
          console.log('Signup failed, try again..');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  const validateCurrentPage = useCallback(() => {
    const newErrors: ErrorProps = {};
    if (currentPage === 0) {
      ['fullName', 'phoneNumber'].forEach(field => {
        if (
          validationRules[field as keyof UserSignupProps].required &&
          !form[field as keyof UserSignupProps]
        ) {
          newErrors[field as keyof UserSignupProps] =
            validationRules[field as keyof UserSignupProps].message ||
            'Required.';
        }
      });
    } else if (currentPage === 1) {
      ['emailAddress', 'password'].forEach(field => {
        if (
          validationRules[field as keyof UserSignupProps].required &&
          !form[field as keyof UserSignupProps]
        ) {
          newErrors[field as keyof UserSignupProps] =
            validationRules[field as keyof UserSignupProps].message ||
            'Required.';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentPage, form]);

  const goToNextPage = () => {
    // deleteTableDetails();
    // getMedicineDetails();
    setSubmit(true);
    const isValid = validateCurrentPage();

    if (!isValid) {
      return;
    }

    if (swiperRef.current && currentPage < 1) {
      swiperRef.current.goToPage(currentPage + 1);
      setCurrentPage(currentPage + 1);
    } else if (currentPage === 1) {
      handleSignup();
    }
  };

  const goToPreviousPage = () => {
    if (swiperRef.current && currentPage > 0) {
      swiperRef.current.goToPage(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleUserData = async (uid: string) => {
    await userService.createUser(form, uid);
  };

  const handleInputChange = (field: keyof UserSignupProps, value: string) => {
    setForm({...form, [field]: value});
    if (validationRules[field]?.required && value) {
      setErrors(prevErrors => ({...prevErrors, [field]: ''}));
    }
  };

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        isScrollable={false}
        onPageChanged={(pageIndex: number) => setCurrentPage(pageIndex)}>
        <View
          style={{
            width: '86%',
            height: '100%',
          }}>
          <View>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={form.fullName}
              onChangeText={value => handleInputChange('fullName', value)}
              placeHolder="Enter full name"
            />
            {submit && errors.fullName && (
              <Text style={{color: 'red'}}>{errors.fullName}</Text>
            )}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              value={form.phoneNumber}
              onChangeText={value => handleInputChange('phoneNumber', value)}
              placeHolder="Enter phone number"
            />
            {submit && errors.phoneNumber && (
              <Text style={{color: 'red'}}>{errors.phoneNumber}</Text>
            )}
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{color: 'blue', fontWeight: 'bold'}}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{width: '86%', height: '100%'}}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            value={form.emailAddress}
            onChangeText={value => handleInputChange('emailAddress', value)}
            placeHolder="Enter email address"
          />
          {submit && errors.emailAddress && (
            <Text style={{color: 'red'}}>{errors.emailAddress}</Text>
          )}
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={form.password}
            onChangeText={value => handleInputChange('password', value)}
            placeHolder="Enter password"
            secureTextEntry
          />

          {submit && errors.password && (
            <Text style={{color: 'red'}}>{errors.password}</Text>
          )}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{color: 'blue', fontWeight: 'bold'}}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Swiper>

      <View style={styles.buttonContainer}>
        {currentPage > 0 && (
          <View style={{position: 'absolute', top: 270, left: 25}}>
            <Button title="Back" onPress={goToPreviousPage} />
          </View>
        )}
        <View style={{top: 270, left: 150}}>
          <Button
            title={currentPage === 1 ? 'Submit' : 'Next'}
            onPress={goToNextPage}
          />
        </View>
      </View>
    </View>
  );
};

export default SignUp;
