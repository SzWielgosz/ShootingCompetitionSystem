import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_REFEREE_ROUNDS } from '../graphql/queries/GetRefereeRounds';
import { useNavigation } from '@react-navigation/native';

const RoundsListScreen = () => {
  const { loading, error, data, refetch } = useQuery(GET_REFEREE_ROUNDS,
    { fetchPolicy: "network-only" },);
  const navigation = useNavigation();

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  const rounds = data.refereeRounds.edges;

  const formatDateTime = (dateTime) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
    return new Date(dateTime).toLocaleString(undefined, options);
  };

  const navigateToDetails = (roundId, attemptsCount) => {
    navigation.navigate('RoundDetailsScreen', { roundId, attemptsCount });
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista rund</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Text style={styles.buttonText}>Odśwież</Text>
        </TouchableOpacity>
      {rounds.map(({ node }) => (
        <View key={node.id} style={styles.roundItem}>
          <Text style={styles.roundInfo}>Runda: {node.number + 1}</Text>
          <Text style={styles.roundInfo}>Zawody: {node.competition.name}</Text>
          <Text style={styles.roundInfo}>Data i czas: {formatDateTime(node.competition.dateTime)}</Text>
          <TouchableOpacity onPress={() => navigateToDetails(node.id, node.competition.attemptsCount)} style={styles.detailsButton}>
            <Text style={styles.buttonText}>Szczegóły</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
  roundItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  roundInfo: {
    marginBottom: 5,
  },
  detailsButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
    backgroundColor: '#3498db',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default RoundsListScreen;
