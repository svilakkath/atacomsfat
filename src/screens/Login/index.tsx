import {TextInput} from '@/components';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import useStyles from './styles';

type LoginProps = {
  emailAddress: string;
  password: string;
};

const Login = () => {
  const [form, setForm] = useState<LoginProps>({
    emailAddress: '',
    password: '',
  });
  const styles = useStyles();

  const handleChange = (field: keyof LoginProps, value: string) => {
    setForm({...form, [field]: value});
  };

  const handleLogin = () => {
    console.log('Form Data:', form);
    // Add your login logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
        <TextInput
          value={form.emailAddress}
          onChangeText={value => handleChange('emailAddress', value)}
          placeHolder="Username"
        />
        <TextInput
          value={form.password}
          onChangeText={value => handleChange('password', value)}
          placeHolder="Password"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
