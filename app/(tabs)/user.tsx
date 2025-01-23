import { StyleSheet, View, Text } from 'react-native';

function User() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>user</Text>
    </View>
  );
}

export default User;

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
