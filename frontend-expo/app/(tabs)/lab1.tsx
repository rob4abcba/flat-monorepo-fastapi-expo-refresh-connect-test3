import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { AudioRecorder, AudioPlayer } from 'expo-audio';
import * as FileSystem from 'expo-file-system';

export default function LabScreen() {
  const [recording, setRecording] = useState<any>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [ttsText, setTtsText] = useState('');
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const audioPlayer = useRef<AudioPlayer | null>(null);

  const SERVER_URL = 'http://localhost:8000';

  // --- Record audio ---
  const startRecording = async () => {
    const rec = new AudioRecorder();
    await rec.prepareToRecordAsync({
      android: {},
      ios: {
        extension: '.m4a',
        outputFormat: 'mpeg4aac',
      },
    });
    await rec.startAsync();
    setRecording(rec);
  };

  const stopRecording = async () => {
    if (!recording) return;
    const { uri } = await recording.stopAndUnloadAsync();
    setRecording(null);
    setRecordedUri(uri);
  };

  // --- Upload to /stt ---
  const transcribe = async () => {
    if (!recordedUri) return;
    setIsLoading(true);
    const fileInfo = await FileSystem.getInfoAsync(recordedUri);
    const formData = new FormData();
    formData.append('file', {
      uri: fileInfo.uri,
      name: 'recording.wav',
      type: 'audio/wav',
    } as any);
    formData.append('model_id', 'scribe_v1');

    try {
      const res = await fetch(`${SERVER_URL}/stt`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      setTranscription(json.text || JSON.stringify(json));
    } catch (err) {
      setTranscription('Error during STT');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Send TTS request ---
  const synthesizeSpeech = async () => {
    if (!ttsText) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: ttsText,
          voice_id: 'Rachel', // example voice_id
        }),
      });
      const blob = await res.blob();
      const uri = `${FileSystem.cacheDirectory}tts-output.mp3`;
      await FileSystem.writeAsStringAsync(uri, await blob.arrayBuffer(), {
        encoding: FileSystem.EncodingType.Base64,
      });

      const player = new AudioPlayer();
      await player.loadAsync({ uri }, {});
      await player.playAsync();
      audioPlayer.current = player;
    } catch (err) {
      console.error('TTS failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Combo button ---
  const speakAndTranscribe = async () => {
    await startRecording();
    setTimeout(async () => {
      await stopRecording();
      await transcribe();
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎙️ ElevenLabs Lab</Text>

      <Button title={recording ? 'Stop Recording' : 'Start Recording'} onPress={recording ? stopRecording : startRecording} />
      <Button title="Transcribe STT" onPress={transcribe} disabled={!recordedUri || isLoading} />

      <Text style={styles.label}>Transcription:</Text>
      <Text style={styles.result}>{transcription}</Text>

      <Text style={styles.label}>Enter Text for TTS:</Text>
      <TextInput value={ttsText} onChangeText={setTtsText} style={styles.input} placeholder="Say something..." />
      <Button title="Synthesize TTS" onPress={synthesizeSpeech} disabled={!ttsText || isLoading} />

      <Button title="🎤 Speak & Transcribe" onPress={speakAndTranscribe} disabled={isLoading} />

      {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  label: { marginTop: 20, fontWeight: 'bold' },
  input: { borderColor: '#ccc', borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 6 },
  result: { backgroundColor: '#eee', padding: 10, borderRadius: 6 },
});
