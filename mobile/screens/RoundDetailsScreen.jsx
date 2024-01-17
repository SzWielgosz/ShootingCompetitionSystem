import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_ROUND_PARTICIPANTS } from '../graphql/queries/GetRoundParticipants';

const RoundDetailsScreen = ({ route, navigation }) => {
  const { roundId, attemptsCount } = route.params;
  const { loading, error, data } = useQuery(GET_ROUND_PARTICIPANTS, {
    variables: { roundId: roundId },
    fetchPolicy: "network-only"
  });

  const navigateToResultsScreen = (userId, firstName, lastName, attemptsCount) => {
    navigation.navigate('ResultsScreen', {
      userId,
      roundId,
      attemptsCount,
      firstName,
      lastName
    });
  };

  if (loading) {
    return <Text style={styles.loadingText}>Ładowanie...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Błąd: {error.message}</Text>;
  }

  const participants = data?.roundParticipants.edges;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Uczestnicy:</Text>
      <View style={styles.participantsContainer}>
        {participants.map(({ node }) => (
          <View key={node.id} style={styles.participantItem}>
            <Text style={styles.participantInfo}>Nazwa użytkownika: {node.username}</Text>
            <Text style={styles.participantInfo}>Imię: {node.firstName}</Text>
            <Text style={styles.participantInfo}>Nazwisko: {node.lastName}</Text>
            <TouchableOpacity
              onPress={() => navigateToResultsScreen(node.id, node.firstName, node.lastName, attemptsCount)}
              style={styles.resultsButton}
            >
              <Text style={styles.buttonText}>Przypisz wyniki</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingText: {
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
  participantsContainer: {
    marginBottom: 20,
  },
  participantItem: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  participantInfo: {
    marginBottom: 5,
  },
  resultsButton: {
    backgroundColor: '#cb1313',
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#cb1313',
  },
  resultsContainer: {},
  resultItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  resultInfo: {
    marginBottom: 5,
  },
});

export default RoundDetailsScreen;
