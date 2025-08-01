import { useState } from 'react';
import { Button, Platform, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { ThemedView } from '@/components/ThemedView';

import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [db, setDb] = useState(null);

  // Initialize database
  useEffect(() => {
    const initDB = async () => {
      const database = await SQLite.openDatabaseAsync('photos.db');
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS photos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          image_data TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      setDb(database);
    };
    initDB();
  }, []);

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7, // Reduce quality to save space
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      
      // Convert to base64 and store in database
      await storeImageInDB(uri);
    }
  };

  const storeImageInDB = async (imageUri) => {
    try {
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Store in database
      await db.runAsync(
        'INSERT INTO photos (image_data) VALUES (?)',
        [`data:image/jpeg;base64,${base64}`]
      );
      
      console.log('Image stored successfully');
    } catch (error) {
      console.error('Error storing image:', error);
    }
  };

  const loadImagesFromDB = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM photos ORDER BY created_at DESC');
      return result;
    } catch (error) {
      console.error('Error loading images:', error);
      return [];
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  capturedImage: {
    width: 280,
    height: 280,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 20,
  },
});