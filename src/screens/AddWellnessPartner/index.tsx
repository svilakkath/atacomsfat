import {TextInput} from '@/components';
import React, {useCallback, useState} from 'react';
import {Button, ScrollView, Text} from 'react-native';
import useStyles from './styles';

type ValidationRule = {
  required: boolean;
  validate?: (value: string) => boolean;
  message: string;
};
type ValidationRules = Record<string, ValidationRule>;

const validationRules: ValidationRules = {
  fullName: {
    required: true,
    message: 'Full Name is required.',
  },
  phoneNumber: {
    required: true,
    validate: (value: string) => /^\d{10}$/.test(value),
    message: 'Phone Number must be 10 digits.',
  },
  age: {
    required: true,
    validate: (value: string) => /^\d+$/.test(value) && parseInt(value, 10) > 0,
    message: 'Age must be a positive number.',
  },
  gender: {
    required: true,
    validate: (value: string) =>
      ['Male', 'Female', 'Other'].includes(value.trim()),
    message: 'Enter gender details (Male, Female, Other).',
  },
  profileImage: {
    required: false,
    validate: (value: string) =>
      !value || /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/i.test(value),
    message: 'Profile Image must be a valid URL (optional).',
  },
};
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
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        value={form.fullName}
        onChangeText={value => handleInputChange('fullName', value)}
        placeHolder="Enter full name"
      />
      {errors.fullName && <Text style={{color: 'red'}}>{errors.fullName}</Text>}

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
      <Button title="get wellness partner" onPress={() => {}} />
      <Button title="delete" onPress={() => {}} />
    </ScrollView>
  );
}
