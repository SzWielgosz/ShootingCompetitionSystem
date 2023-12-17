import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useMutation } from '@apollo/client';
import { LOGIN_REFEREE } from '../graphql/mutations/LoginReferee';

const LoginScreen = ({ onLoginSuccess, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginReferee, { error }] = useMutation(LOGIN_REFEREE);

  const handleLogin = async () => {
    try {
      const result = await loginReferee({
        variables: { email, password },
      });

      const token = result.data.loginReferee.token;
      onLoginSuccess(token);
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoundsListScreen' }],
      });
    } catch (error) {
      console.error('Błąd logowania:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logowanie</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      <Button title="Login" onPress={handleLogin} />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default LoginScreen;
