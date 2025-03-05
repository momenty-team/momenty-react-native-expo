import { StyleSheet, View, Text } from 'react-native';
import Login from '../login';

function Analysis() {
  return (
    <Login />
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
