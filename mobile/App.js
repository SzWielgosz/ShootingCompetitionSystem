import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { View, StatusBar, Text, Button } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import RoundsListScreen from './screens/RoundsListScreen';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { polyfill as polyfillEncoding } from "react-native-polyfill-globals/src/encoding";
import { polyfill as polyfillReadableStream } from "react-native-polyfill-globals/src/readable-stream";
import { polyfill as polyfillFetch } from "react-native-polyfill-globals/src/fetch";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoundDetailsScreen from './screens/RoundDetailsScreen';
import ResultsScreen from './screens/ResultsScreen';
import LogoutButton from './components/LogoutButton';


polyfillReadableStream();
polyfillEncoding();
polyfillFetch();

const link = new HttpLink({
  uri: 'http://10.0.2.2:8000/graphql/',
  fetchOptions: {
    reactNative: { textStreaming: true },
  },
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

const Stack = createNativeStackNavigator();

const App = () => {
  const [token, setToken] = useState(null);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="LoginScreen"
            options={{ title: "Panel logowania", headerShown: true }}
          >
            {({ navigation }) => (
              <LoginScreen onLoginSuccess={handleLoginSuccess} navigation={navigation} />
            )}
          </Stack.Screen>
          <Stack.Screen 
            name="RoundsListScreen"
            options={{ 
              title: "Rundy do rozpatrzenia",
              headerShown: true,
              headerRight: () => (
                <View style={{ marginRight: 10 }}>
                  {token && (
                    <LogoutButton onLogout={() => setToken(null)} />
                  )}
                </View>
              ),
            }}
            component={RoundsListScreen}
          />
          <Stack.Screen 
            name="RoundDetailsScreen"
            options={{ 
              title: "Sczegóły rundy",
              headerShown: true,
              headerRight: () => (
                <View style={{ marginRight: 10 }}>
                  {token && (
                    <LogoutButton onLogout={() => setToken(null)} />
                  )}
                </View>
              ),
            }}
            component={RoundDetailsScreen}
          />
          <Stack.Screen 
            name="ResultsScreen"
            options={{ 
              title: "Panel wynikowy",
              headerShown: true,
              headerRight: () => (
                <View style={{ marginRight: 10 }}>
                  {token && (
                    <LogoutButton onLogout={() => setToken(null)} />
                  )}
                </View>
              ),
            }}
            component={ResultsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

AppRegistry.registerComponent('mobile', () => App);

export default App;
