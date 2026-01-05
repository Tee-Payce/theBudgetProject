import { getBatchProgress } from '@/database/progressUtils';
import { StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

export default function BatchProgressCard({ batch }) {
  const progress = getBatchProgress(batch.startDate);

  const statusColor =
    progress.completed ? '#2563eb' :
    progress.percentage > 80 ? '#16a34a' :
    progress.percentage > 50 ? '#f59e0b' :
    '#dc2626';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{batch.name}</Text>

      <Text>Week {progress.week} / 6</Text>
      <Text>{progress.percentage}% Complete</Text>

      <Progress.Bar
        progress={progress.percentage / 100}
        width={null}
        color={statusColor}
        height={10}
        borderRadius={6}
      />

      <Text style={{ marginTop: 6, color: statusColor }}>
        {progress.completed ? 'Ready for Sale ✅' : 'In Progress'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});
