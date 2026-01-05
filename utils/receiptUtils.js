import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

const RECEIPT_DIR = FileSystem.documentDirectory + 'receipts/';

const ensureDirExists = async (path) => {
  const dir = await FileSystem.getInfoAsync(path);
  if (!dir.exists) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  }
};

export const pickReceiptImage = async (batchId, prefix) => {
  // Ask permission
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.6,
    allowsEditing: true
  });

  if (result.canceled) return null;

  const batchDir = `${RECEIPT_DIR}batch_${batchId}/`;
  await ensureDirExists(batchDir);

  const fileName = `${prefix}_${Date.now()}.jpg`;
  const newPath = batchDir + fileName;

  await FileSystem.moveAsync({
    from: result.assets[0].uri,
    to: newPath
  });

  return newPath;
};

export const pickReceiptFromGallery = async (batchId, prefix) => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    quality: 0.6
  });

  if (result.canceled) return null;

  const batchDir = `${RECEIPT_DIR}batch_${batchId}/`;
  await ensureDirExists(batchDir);

  const fileName = `${prefix}_${Date.now()}.jpg`;
  const newPath = batchDir + fileName;

  await FileSystem.copyAsync({
    from: result.assets[0].uri,
    to: newPath
  });

  return newPath;
};
