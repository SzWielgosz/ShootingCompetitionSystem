import * as React from 'react';
import { Button } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { LOGOUT_MUTATION } from '../graphql/mutations/Logout';
import { useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../useAuth';


const LogoutButton = () => {
  const { auth, setAuth } = useAuth();
  const navigation = useNavigation();

  const [logoutUser, { error }] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      setAuth(null);
      AsyncStorage.clear();
      navigation.navigate("LoginScreen");
    },
  });

  const handleLogout = () => {
    if (auth) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      );
      try {
        logoutUser();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Button
      title="Wyloguj"
      onPress={handleLogout}
      color="#cb1313"
    />
  )
};

export default LogoutButton;
