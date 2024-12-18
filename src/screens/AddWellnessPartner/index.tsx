import {TextInput} from '@/components';
import React, {useCallback, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {validationRules} from './services';
import useStyles from './styles';

export default function AddWellnessPartner() {
  const styles = useStyles();
  // const {uid} = useUserStore();

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    profileImage: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    Object.entries(validationRules).forEach(([field, rule]) => {
      const value = form[field as keyof typeof form];

      if (rule.required && !value) {
        newErrors[field] = rule.message;
      } else if (rule.validate && !rule.validate(value)) {
        newErrors[field] = rule.message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleInputChange = (field: string, value: string) => {
    setForm({...form, [field]: value});
    if (errors[field]) {
      setErrors({...errors, [field]: ''});
    }
  };

  const handleSubmit = async () => {
    validateForm();
    if (!validateForm()) {
      console.log(
        'Validation Error',
        'Please fix the errors before submitting.',
      );
      return;
    }
    // await wellnessPartnerService.createWellnessPartner(form, uid);
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: 'san-serif',
          fontSize: 20,
          textAlign: 'center',
          position: 'absolute',
          marginTop: 30,
          left: 17,
        }}>
        Sign Up
      </Text>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        value={form.fullName}
        onChangeText={value => handleInputChange('fullName', value)}
        placeHolder="Enter full name"
      />
      {errors.fullName && (
        <Text
          style={{
            color: '#ff6347',
            left: '81%',
            top: 168,
            position: 'absolute',
          }}>
          {errors.fullName}
        </Text>
      )}

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        value={form.phoneNumber}
        onChangeText={value => handleInputChange('phoneNumber', value)}
        placeHolder="Enter phone number"
      />
      {errors.phoneNumber && (
        <Text
          style={{
            color: '#ff6347',
            left: '81%',
            top: 283,
            position: 'absolute',
          }}>
          {errors.phoneNumber}
        </Text>
      )}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{width: '45%'}}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            value={form.age}
            onChangeText={value => handleInputChange('age', value)}
            placeHolder="Enter age"
          />
          {errors.age && (
            <Text
              style={{
                color: '#ff6347',
                left: '52%',
                bottom: '71%',
                position: 'absolute',
              }}>
              {errors.age}
            </Text>
          )}
        </View>
        <View style={{width: '45%'}}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            value={form.gender}
            onChangeText={value => handleInputChange('gender', value)}
            placeHolder="Enter gender"
          />
          {errors.gender && (
            <Text
              style={{
                color: '#ff6347',
                left: '52%',
                bottom: '71%',
                position: 'absolute',
              }}>
              {errors.gender}
            </Text>
          )}
        </View>
      </View>
      {/* <Text style={styles.label}>Profile Image (Optional)</Text>
      <TextInput
        value={form.profileImage}
        onChangeText={value => handleInputChange('profileImage', value)}
        placeHolder="Enter image URL"
      /> */}
      <TouchableOpacity
        style={{
          height: 60,
          width: 110,
          backgroundColor: '#3cb371',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 17,
          position: 'absolute',
          bottom: 50,
          alignSelf: 'center',
        }}>
        <Text
          style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}
          onPress={handleSubmit}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
}
