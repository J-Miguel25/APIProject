import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, ActivityIndicator } from 'react-native';

export default function App() {
  const [dogImage, setDogImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDogImage = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const json = await response.json();
      setDogImage(json.message);
    } catch (error) {
      console.error('Error fetching dog image:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDogImage();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Random Dog Image</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        dogImage && <Image source={{ uri: dogImage }} style={styles.image} />
      )}
      <Button title="Fetch New Dog" onPress={fetchDogImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
});
