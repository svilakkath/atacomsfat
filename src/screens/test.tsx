import {Selector} from '@/components';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

const GenderSelectorModal = () => {
  const [selectedGender, setSelectedGender] = useState<string>('');
  console.log(selectedGender);

  return (
    <View style={styles.screen}>
      <Selector
        options={['Male', 'Female']}
        selectedValue={selectedGender}
        onValueChange={value => setSelectedGender(value)}
        placeholder="Select Gender"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    padding: 20,
  },
});

export default GenderSelectorModal;
