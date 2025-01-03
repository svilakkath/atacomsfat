import React from 'react';
import {
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type CustomModalProps = {
  isVisible: boolean;
  message: string | undefined;
  onClose: () => void;
  onCancel?: () => void;
  modalStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  buttonText?: string;
  isCancelVisible?: boolean;
};

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  message,
  onClose,
  modalStyle,
  textStyle,
  buttonStyle,
  buttonTextStyle,
  buttonText = 'Close',
  onCancel,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, modalStyle]}>
          {onCancel && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 1,
                padding: 6,
              }}
              onPress={onCancel}>
              <Icon name="close-circle" size={24} color="#555555" />
            </TouchableOpacity>
          )}
          <Text
            style={[
              styles.messageText,
              textStyle,
              {marginTop: 10, marginBottom: 20},
            ]}>
            {message}
          </Text>

          <View style={{flexDirection: 'row', gap: 25}}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, buttonStyle]}>
              <Text style={[styles.closeButtonText, buttonTextStyle]}>
                {buttonText}
              </Text>
            </TouchableOpacity>
            {/* {onCancel ? (
              <TouchableOpacity
                onPress={onCancel}
                style={[
                  styles.closeButton,
                  buttonStyle,
                  {backgroundColor: 'green'},
                ]}>
                <Text style={[styles.closeButtonText, buttonTextStyle]}>
                  {'Cancel'}
                </Text>
              </TouchableOpacity>
            ) : (
              ''
            )} */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
