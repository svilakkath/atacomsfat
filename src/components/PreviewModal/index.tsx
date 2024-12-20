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
          <Text style={[styles.messageText, textStyle]}>{message}</Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, buttonStyle]}>
            <Text style={[styles.closeButtonText, buttonTextStyle]}>
              {buttonText}
            </Text>
          </TouchableOpacity>
          {onCancel ? (
            <TouchableOpacity
              onPress={onCancel}
              style={{backgroundColor: 'green', width: 40, height: 50}}>
              <Text style={[styles.closeButtonText, buttonTextStyle]}>
                {'Cancel'}
              </Text>
            </TouchableOpacity>
          ) : (
            ''
          )}
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
