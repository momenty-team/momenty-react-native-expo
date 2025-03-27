import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

function Analysis() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Analysis</Text>
      <Pressable onPress={() => router.push('/login')}>
        <Text>Go to Login</Text>
      </Pressable>
    </View>
  );
}

export default Analysis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
});
