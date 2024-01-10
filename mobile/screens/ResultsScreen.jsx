import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';
import { useMutation, useQuery } from '@apollo/client';
import { ASSIGN_ATTEMPTS_SCORE } from '../graphql/mutations/AssignAttemptsScore';
import { GET_PARTICIPANT_ROUND_ATTEMPTS } from '../graphql/queries/GetParticipantRoundAttempts';
import { useAuth } from '../useAuth';

const ResultsScreen = ({ route, navigation }) => {
  const { userId, roundId, attemptsCount, firstName, lastName } = route.params;
  const [results, setResults] = useState(Array(attemptsCount).fill(false));
  const { auth } = useAuth

  const { loading, error, data } = useQuery(GET_PARTICIPANT_ROUND_ATTEMPTS, {
    variables: {
      roundId: roundId,
      participantUserId: userId,
    },
    fetchPolicy: "network-only"
  });

  const [assignAttemptsScore] = useMutation(ASSIGN_ATTEMPTS_SCORE);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  
    if (!loading && data && data.participantAttempts && data.participantAttempts.edges && data.participantAttempts.edges.length > 0) {
      const successValues = data.participantAttempts.edges.map(edge => {
        return {
          success: edge.node.success,
          number: edge.node.number,
        };
      });
    
      successValues.sort((a, b) => a.number - b.number);
      setResults(successValues.map(item => item.success));
    } else {
      setResults(prevResults => prevResults || Array(attemptsCount).fill(false));
    }
  }, [data, error, loading]);


  const handleSaveResult = async () => {
    try {
      const { data } = await assignAttemptsScore({
        variables: {
          roundId: roundId,
          participantUserId: userId,
          successValues: results,
        },
      });

      Alert.alert("Przypisano wyniki");
      navigation.goBack();
    } catch (error) {
      Alert.alert(error.message || "Wystąpił błąd podczas przypisywania wyników");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wprowadź wyniki dla użytkownika {firstName} {lastName}</Text>
      {data && data.participantAttempts && data.participantAttempts.edges && data.participantAttempts.edges.length === 0 ? (
        <Text style={styles.note}>Status wyników: Nie przypisane</Text>
      ) : (
        <Text style={styles.savedNote}>Status wyników: Przypisane</Text>
      )}
      {results.map((result, index) => (
        <View key={index} style={styles.checkboxContainer}>
          <CheckBox
            style={styles.checkbox}
            value={result}
            onValueChange={(value) =>
              setResults((prevResults) => {
                const newResults = [...prevResults];
                newResults[index] = value;
                return newResults;
              })
            }
          />
          <Text style={styles.checkboxLabel}>Próba {index + 1}: {result ? 'Trafił' : 'Nie trafił'}</Text>
        </View>
      ))}
      <Button title="Zapisz wyniki" onPress={handleSaveResult} color="#cb1313"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  note: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  savedNote: {
    fontSize: 16,
    color: 'green',
    marginBottom: 10,
  }
});

export default ResultsScreen;
