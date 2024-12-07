import CustomBottomSheet from '@/components/CustomBottomSheet'; // Update the import path
import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';

export default function TestScreen() {
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const toggleSheet = () => {
    setIsSheetVisible(prev => !prev);
  };

  return (
    <View style={{flex: 1}}>
      <Button
        title={isSheetVisible ? 'Close Bottom Sheet' : 'Open Bottom Sheet'}
        onPress={toggleSheet}
      />

      <CustomBottomSheet
        isVisible={isSheetVisible}
        initialHeight={300}
        maxHeight={600}
        onClose={() => setIsSheetVisible(false)}>
        <Text>Your content goes here</Text>

        {/* The Close Button will now be inside the Bottom Sheet */}
        {/* <Button title="click here" onPress={() => console.log('')} /> */}
      </CustomBottomSheet>
    </View>
  );
}

// next step: Add validations for input fields in different screens
