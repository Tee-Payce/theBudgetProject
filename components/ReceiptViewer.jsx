import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';

export default function ReceiptViewer({ visible, path, onClose }) {
  if (!path) return null;

  return (
    <Modal visible={visible} transparent>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: '#fff', padding: 10 }}>Close ✖</Text>
        </TouchableOpacity>

        <Image
          source={{ uri: path }}
          style={{ flex: 1, resizeMode: 'contain' }}
        />
      </View>
    </Modal>
  );
}
