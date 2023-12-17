import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';
import { useMutation, useQuery } from '@apollo/client';
import { ASSIGN_ATTEMPTS_SCORE } from '../graphql/mutations/AssignAttemptsScore';
import { GET_PARTICIPANT_ROUND_ATTEMPTS } from '../graphql/queries/GetParticipantRoundAttempts';

const ResultsScreen = ({ route }) => {
  const { userId, roundId, attemptsCount, firstName, lastName } = route.params;
  const [results, setResults] = useState(Array(attemptsCount).fill(false));

  const { loading, error, data } = useQuery(GET_PARTICIPANT_ROUND_ATTEMPTS, {
    variables: {
      roundId: roundId,
      participantUserId: userId,
    },
  });

  const [assignAttemptsScore] = useMutation(ASSIGN_ATTEMPTS_SCORE);

  React.useEffect(() => {
    if (!loading && data && data.participantAttempts && data.participantAttempts.edges) {
      const successValues = data.participantAttempts.edges.map(edge => edge.node.success);
      setResults(successValues || Array(attemptsCount).fill(false));
    }
  }, [loading, data]);

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
    } catch (error) {
      Alert.alert(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wprowadź wyniki dla użytkownika {firstName} {lastName}</Text>
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
      <Button title="Zapisz wyniki" onPress={handleSaveResult} />
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
});

export default ResultsScreen;
