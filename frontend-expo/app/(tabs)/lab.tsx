import { useState, useEffect, useRef } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
// import { useAudioRecorder, useAudioPlayer } from 'expo-audio';
import * as FileSystem from 'expo-file-system';
import { Tabs } from 'expo-router';
// import * as Sharing from 'expo-sharing';

const API_URL = 'http://localhost:8000';

export default function LabTab() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
//   const [recording, setRecording] = useState<useAudioRecorder.Recording | null>(null);

  const [transcription, setTranscription] = useState('');
  const [ttsText, setTtsText] = useState('');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setLoading(true);
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) await sendToStt(uri);
    } catch (err) {
      console.error('Stop error:', err);
    } finally {
      setRecording(null);
      setLoading(false);
    }
  };

  const sendToStt = async (uri: string) => {
    const form = new FormData();
    form.append('model_id', 'scribe_v1');
    form.append('file', {
      uri,
      name: 'audio.wav',
      type: 'audio/wav',
    } as any);

    try {
      const res = await fetch(`${API_URL}/stt`, {
        method: 'POST',
        body: form,
        headers: {
          Accept: 'application/json',
        },
      });
      const json = await res.json();
      setTranscription(json.text || 'No text returned');
    } catch (err) {
      console.error('STT error:', err);
    }
  };

  const sendToTts = async () => {
    try {
      const res = await fetch(`${API_URL}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_id: 'eleven_monolingual_v1',
          text: ttsText,
        }),
      });

      if (!res.ok) throw new Error(`TTS failed: ${await res.text()}`);
      const blob = await res.blob();
      const uri = FileSystem.cacheDirectory + 'tts_response.mp3';
      await FileSystem.writeAsStringAsync(uri, await blob.text(), { encoding: FileSystem.EncodingType.Base64 });

      const { sound } = await Audio.Sound.createAsync({ uri });
      setSound(sound);
      await sound.playAsync();
    } catch (err) {
      console.error('TTS error:', err);
      Alert.alert('Error', String(err));
    }
  };

  const speakAndTranscribe = async () => {
    await startRecording();
    setTimeout(stopRecording, 4000);
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ Speak & Transcribe</Text>
      <Button title={recording ? 'Stop Recording' : 'Start Recording'} onPress={recording ? stopRecording : startRecording} disabled={loading} />

      <Text style={styles.subtitle}>📋 Transcription:</Text>
      <Text>{transcription}</Text>

      <Text style={styles.subtitle}>📝 Text to Speech</Text>
      <TextInput
        placeholder="Enter text to speak"
        style={styles.input}
        value={ttsText}
        onChangeText={setTtsText}
      />
      <Button title="Speak it!" onPress={sendToTts} disabled={!ttsText.trim()} />

      <Text style={styles.subtitle}>🌀 Speak & Auto Transcribe</Text>
      <Button title="🎤 Record → 🔊 Play → ✍️ Transcribe" onPress={speakAndTranscribe} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  subtitle: { marginTop: 20, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
  },
});
