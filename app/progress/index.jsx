import { getAllBatches } from '@/database/batchQueries';
import { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import BatchProgressCard from '../../components/BatchProgressCard';

export default function Progress() {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    const data = getAllBatches();
    setBatches(data);
  };

  return (
    <ScrollView style={{ padding: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        Batch Progress 🐔
      </Text>

      {batches.map(batch => (
        <BatchProgressCard key={batch.id} batch={batch} />
      ))}
    </ScrollView>
  );
}
