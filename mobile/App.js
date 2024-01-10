import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGOUT_MUTATION } from './graphql/mutations/Logout';
import { AuthProvider, useAuth } from './useAuth';
import "core-js/stable/atob";


polyfillReadableStream();
polyfillEncoding();
polyfillFetch();

const httpLink = new HttpLink({
  uri: 'http://10.0.2.2:8000/graphql/',
  credentials: "include",
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

const Stack = createNativeStackNavigator();

const App = () => {
   return (
      <ApolloProvider client={client}>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen 
                name="LoginScreen"
                options={{ title: "Panel logowania", headerShown: true }}
              >
                {({ navigation }) => (
                  <LoginScreen navigation={navigation} client={client} />
                )}
              </Stack.Screen>
              <Stack.Screen 
                name="RoundsListScreen"
                options={{ 
                  title: "Rundy do rozpatrzenia",
                  headerShown: true,
                  headerRight: () => (
                    <View style={{ marginRight: 10 }}>
                      <LogoutButton />
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
                      <LogoutButton />
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
                      <LogoutButton />
                    </View>
                  ),
                }}
                component={ResultsScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
      </AuthProvider>
    </ApolloProvider>
  );
};

AppRegistry.registerComponent('mobile', () => App);

export default App;
