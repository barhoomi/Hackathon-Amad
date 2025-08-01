import { useState } from 'react';
import { Button, Platform, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState(null);

  const takePicture = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch the camera and get the photo
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    // Check if a picture was taken and not canceled
    if (!result.canceled) {
      // Set the image URI from the captured photo
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Main content area */}
      <ThemedView style={styles.contentArea}>
        {/* Conditional rendering: only show the image if an image exists */}
        {imageUri && (
          <ThemedView style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.capturedImage} />
          </ThemedView>
        )}
      </ThemedView>

      {/* Button positioned at the bottom */}
      <ThemedView style={styles.buttonContainer}>
        <Button title="Take a Picture" onPress={takePicture} />
      </ThemedView>
    </ThemedView>
  );
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