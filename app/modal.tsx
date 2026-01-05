import { Link } from 'expo-router';
import { Image, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <Image source={require('../assets/images/thelogo.png')} style={{ width: 150, height: 150, marginBottom: 20 }} />
      <ThemedText style={styles.title} type="title">The Project Huku</ThemedText>
      
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText>Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
    backgroundColor: '#a4e3bbff',
    fontFamily:'berkshire-swash',
  },
  title: {
   
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#08521eff'
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    color: '#fff',
    fontFamily: 'berkshire-swash',
    backgroundColor: '#2e8e51ff',
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    
    
  },
});
