import * as React from 'react';
import { Button } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';

const LogoutButton = ({ onLogout }) => {
  const navigation = useNavigation();

  const resetNavigation = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      })
    );

    onLogout();
  };

  return (
    <Button
      title="Wyloguj"
      onPress={resetNavigation}
    />
  );
}

export default LogoutButton;
