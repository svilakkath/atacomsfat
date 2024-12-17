import {TextInput} from '@/components';
import {RootStackParamList} from '@/types/common';
import auth from '@react-native-firebase/auth';
import {NavigationProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import useStyles from './styles';

type LoginProps = {
  emailAddress: string;
  password: string;
};

type LoginNavigationProps = {
  navigation: NavigationProp<RootStackParamList, 'Login'>;
};

const Login = ({navigation}: LoginNavigationProps) => {
  const [form, setForm] = useState<LoginProps>({
    emailAddress: '',
    password: '',
  });
  const styles = useStyles();

  const handleChange = (field: keyof LoginProps, value: string) => {
    setForm({...form, [field]: value});
  };

  const handleLogin = async () => {
    const {emailAddress, password} = form;
    if (!emailAddress || !password) {
      console.log('Error', 'Please fill in both fields');
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(emailAddress, password);
      console.log('Success', 'You are logged in');

      navigation.navigate('Home');
    } catch (error) {
      console.error('Login Error:', error);
      console.log('Error', 'Invalid credentials or problem logging in');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View>
        <TextInput
          value={form.emailAddress}
          onChangeText={value => handleChange('emailAddress', value)}
          placeHolder="Email Address"
        />
      </View>
      <View>
        <TextInput
          value={form.password}
          onChangeText={value => handleChange('password', value)}
          placeHolder="Password"
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View>
        <View style={styles.buttonView}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
