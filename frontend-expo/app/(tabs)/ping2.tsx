import { View, Text, ActivityIndicator, StyleSheet, Button, TextInput } from 'react-native';
import { useState } from 'react';
import { PingResponse } from '../../common/types';

export default function RefreshScreen() {
  const [input, setInput] = useState('');
  const [data, setData] = useState<PingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const sendPing = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/ping2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const json: PingResponse = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching /ping2:', err);
      setData({ message: '⚠️ Failed to fetch backend response' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Roundtrip Ping Test: User types message in frontend-expo TextInput at top, which goes to backend-fastapi, then back to frontend-expo again inside Text box at bottom.</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter message"
        value={input}
        onChangeText={setInput}
      />

      <Button title="Send to Backend" onPress={sendPing} disabled={loading || !input.trim()} />

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
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    marginBottom: 16,
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
