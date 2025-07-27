import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { PingResponse } from '../../common/types';

export default function RefreshScreen() {
  const [data, setData] = useState<PingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPing = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/ping');
      const json: PingResponse = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching /ping:', err);
      setData({ message: '⚠️ Failed to fetch backend response' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPing();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Refresh Screen</Text>
      
      <Button title="Refresh" onPress={fetchPing} disabled={loading} />

      {loading && <ActivityIndicator style={styles.loading} />}
      {data && <Text style={styles.message}>Response: {data.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: 'green',
    marginTop: 16,
  },
  loading: {
    marginTop: 16,
  },
});
