// import {PreviewModal, Selector, TextInput} from '@/components';
// import {useUserStore} from '@/store';
// import React, {useCallback, useState} from 'react';
// import {Text, TouchableOpacity, View} from 'react-native';
// import wellnessPartnerService, {validationRules} from './services';
// import useStyles from './styles';

// type WellnessPartnerResponse = {
//   id?: string;
//   message: string;
//   success: boolean;
// };
// export default function AddWellnessPartner({navigation}) {
//   const styles = useStyles();
//   const {uid} = useUserStore();
//   // const [isVisible, setIsVisible] = useState(false);

//   const [form, setForm] = useState({
//     fullName: '',
//     phoneNumber: '',
//     age: '',
//     gender: '',
//     profileImage: '',
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [selectedGender, setSelectedGender] = useState<string>('');
//   const [isLoading, setIsloading] = useState(false);
//   const [response, setResponse] = useState<WellnessPartnerResponse | null>();
//   const [isVisible, setIsVisible] = useState(false);

//   const validateForm = useCallback(() => {
//     const newErrors: Record<string, string> = {};

//     Object.entries(validationRules).forEach(([field, rule]) => {
//       const value = form[field as keyof typeof form];

//       if (rule.required && !value) {
//         newErrors[field] = rule.message;
//       } else if (rule.validate && !rule.validate(value)) {
//         newErrors[field] = rule.message;
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [form]);

//   const handleInputChange = (field: string, value: string) => {
//     setForm({...form, [field]: value});
//     if (errors[field]) {
//       setErrors({...errors, [field]: ''});
//     }
//   };

//   const handleSubmit = async () => {
//     validateForm();
//     if (!validateForm()) {
//       console.log(
//         'Validation Error',
//         'Please fix the errors before submitting.',
//       );
//       return;
//     }
//     try {
//       setIsloading(true);
//       const response = await wellnessPartnerService.createWellnessPartner(
//         form,
//         uid,
//       );
//       if (response?.success === true) {
//         console.log('response==>', response);
//         setResponse(response);
//         setIsVisible(true);
//       } else {
//         console.log('response==>', response);
//         setResponse(response);
//         setIsVisible(true);
//       }
//     } catch (error) {
//       console.error('Error adding wellness partners:', error);
//     } finally {
//       console.log('finally');
//     }
//   };
//   const handleGender = (type: string, value: string) => {
//     setSelectedGender(value);
//     handleInputChange(type, value);
//   };
//   const handleClose = () => {
//     setIsloading(false);
//     if (response?.success) {
//       navigation.navigate('WellnessPartnerList');
//     }
//   };
//   return (
//     <>
//       {isLoading ? (
//         <PreviewModal
//           isVisible={isVisible}
//           message={response?.message}
//           onClose={handleClose}
//           buttonText={response?.success ? 'Contiue' : 'Close'}
//           buttonStyle={
//             response?.success ? styles.successButton : styles.failButton
//           }
//         />
//       ) : (
//         ''
//       )}
//       <View style={styles.container}>
//         <Text
//           style={{
//             fontFamily: 'san-serif',
//             fontSize: 20,
//             textAlign: 'center',
//             position: 'absolute',
//             marginTop: 30,
//             left: 17,
//           }}>
//           Add Wellness Partner
//         </Text>
//         <Text style={styles.label}>Full Name</Text>
//         <TextInput
//           value={form.fullName}
//           onChangeText={value => handleInputChange('fullName', value)}
//           placeHolder="Enter full name"
//         />
//         {errors.fullName && (
//           <Text
//             style={{
//               color: '#ff6347',
//               left: '81%',
//               top: 168,
//               position: 'absolute',
//             }}>
//             {errors.fullName}
//           </Text>
//         )}

//         <Text style={styles.label}>Phone Number</Text>
//         <TextInput
//           value={form.phoneNumber}
//           onChangeText={value => handleInputChange('phoneNumber', value)}
//           placeHolder="Enter phone number"
//         />
//         {errors.phoneNumber && (
//           <Text
//             style={{
//               color: '#ff6347',
//               left: '81%',
//               top: 283,
//               position: 'absolute',
//             }}>
//             {errors.phoneNumber}
//           </Text>
//         )}
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}>
//           <View style={{width: '45%'}}>
//             <Text style={styles.label}>Age</Text>
//             <TextInput
//               value={form.age}
//               onChangeText={value => handleInputChange('age', value)}
//               placeHolder="Enter age"
//             />
//             {errors.age && (
//               <Text
//                 style={{
//                   color: '#ff6347',
//                   left: '52%',
//                   bottom: '71%',
//                   position: 'absolute',
//                 }}>
//                 {errors.age}
//               </Text>
//             )}
//           </View>
//           <View style={{width: '45%', marginTop: 15}}>
//             <Text
//               style={{
//                 color: '#333',
//                 fontFamily: 'san-serif',
//                 fontSize: 16,
//               }}>
//               Gender
//             </Text>
//             <Selector
//               options={['Male', 'Female']}
//               selectedValue={selectedGender}
//               onValueChange={value => handleGender('gender', value)}
//               placeholder="Select Gender"
//             />
//             {errors.gender && (
//               <Text
//                 style={{
//                   color: '#ff6347',
//                   left: '52%',
//                   bottom: '71%',
//                   position: 'absolute',
//                 }}>
//                 {errors.gender}
//               </Text>
//             )}
//           </View>
//         </View>
//         <TouchableOpacity
//           style={{
//             height: 60,
//             width: 110,
//             backgroundColor: '#3cb371',
//             justifyContent: 'center',
//             alignItems: 'center',
//             borderRadius: 17,
//             position: 'absolute',
//             bottom: 50,
//             alignSelf: 'center',
//           }}>
//           <Text
//             style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}
//             onPress={handleSubmit}>
//             Submit
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </>
//   );
// }

///////////////////////////////////////////////////////////////////////////////

import {PreviewModal, Selector, TextInput} from '@/components';
import {useUserStore} from '@/store';
import {RootStackParamList} from '@/types/common';
import {NavigationProp} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import wellnessPartnerService, {validationRules} from './services';

type WellnessPartnerResponse = {
  id?: string;
  message: string;
  success: boolean;
};

type AddWellnessPartnerNavigationProps = {
  navigation: NavigationProp<RootStackParamList, 'AddWellnessPartner'>;
};
export default function AddWellnessPartner({
  navigation,
}: AddWellnessPartnerNavigationProps) {
  const {uid} = useUserStore();

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    profileImage: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedGender, setSelectedGender] = useState<string>('');
  // const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<WellnessPartnerResponse | null>(
    null,
  );
  const [isVisible, setIsVisible] = useState(false);

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
    setForm(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // setIsLoading(true);
      const response = await wellnessPartnerService.createWellnessPartner(
        form,
        uid,
      );
      setResponse(response);
      setIsVisible(true);
    } catch (error) {
      console.error('Error adding wellness partner:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    handleInputChange('gender', value);
  };

  const handleClose = () => {
    setIsVisible(false);
    if (response?.success) {
      navigation.navigate('WellnessPartnerList');
    }
  };

  return (
    <>
      {isVisible && (
        <PreviewModal
          isVisible={isVisible}
          message={response?.message}
          onClose={handleClose}
          buttonText={response?.success ? 'Continue' : 'Close'}
          buttonStyle={
            response?.success ? styles.successButton : styles.failButton
          }
        />
      )}
      <View style={styles.container}>
        <Text style={styles.title}>Add Wellness Partner</Text>

        <TextInputField
          label="Full Name"
          value={form.fullName}
          placeholder="Enter full name"
          onChangeText={value => handleInputChange('fullName', value)}
          error={errors.fullName}
        />

        <TextInputField
          label="Phone Number"
          value={form.phoneNumber}
          placeholder="Enter phone number"
          onChangeText={value => handleInputChange('phoneNumber', value)}
          error={errors.phoneNumber}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <TextInputField
              label="Age"
              value={form.age}
              placeholder="Enter age"
              onChangeText={value => handleInputChange('age', value)}
              error={errors.age}
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Gender</Text>
            <Selector
              options={['Male', 'Female']}
              selectedValue={selectedGender}
              onValueChange={handleGenderChange}
              placeholder="Select Gender"
            />
            {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const TextInputField = ({
  label,
  value,
  placeholder,
  onChangeText,
  error,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  error?: string;
}) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeHolder={placeholder}
    />
    {error && <Text style={styles.error}>{error}</Text>}
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  error: {
    color: '#ff6347',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfWidth: {
    width: '45%',
  },
  submitButton: {
    height: 50,
    backgroundColor: '#3cb371',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successButton: {
    backgroundColor: '#28a745',
  },
  failButton: {
    backgroundColor: '#dc3545',
  },
});
