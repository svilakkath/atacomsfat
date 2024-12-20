import React, {useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type ModalProps = {
  options: string[];
  selectedValue: string;
  onValueChange: (item: string) => void;
  placeholder: string;
};
const CustomSelector = ({
  options = [],
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
}: ModalProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.selectedText}>{selectedValue || placeholder}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <FlatList
                  data={options}
                  keyExtractor={item => item}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        index === options.length - 1 && styles.lastOption,
                      ]}
                      onPress={() => {
                        onValueChange(item);
                        setModalVisible(false);
                      }}>
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  selector: {
    borderColor: 'gray',
    borderRadius: 15,
    backgroundColor: '#fff',
    width: '100%',
    height: 'auto',
    alignItems: 'center',
  },
  selectedText: {
    color: 'gray',
    fontFamily: 'san-serif',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#c0c0c0',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 15,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
  },
});

export default CustomSelector;
