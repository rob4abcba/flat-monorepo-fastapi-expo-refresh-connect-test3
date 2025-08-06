// app/(tabs)/stt1.tsx
// This file handles both recording audio and sending it to the server for transcription.
// It includes two main steps: recording the audio and uploading it to the server for STT (Speech-to-Text) processing.
// The transcription result is displayed on the screen.
// The code uses Expo's Audio API for recording and React Native components for UI.
// The server endpoint for STT is assumed to be at "/stt".
// The code also includes error handling and user feedback for the recording and transcription process.

import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import * as Audio from 'expo-av';
import * as FileSystem from 'expo-file-system';

export default function STTScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    try {
      console.log('Requesting permissions...');
      const { granted } = await Audio.Audio.requestPermissionsAsync();
      if (!granted) throw new Error('Permission not granted');

      console.log('Starting recording...');
      await Audio.Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Audio.Recording.createAsync(
        Audio.Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording...');
    setIsRecording(false);
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    if (uri) {
      await sendAudioToBackend(uri);
    }
  };

  // const sendAudioToBackend = async (uri: string) => {
  //   try {
  //     setLoading(true);
  //     setTranscription('');

  //     const fileInfo = await FileSystem.getInfoAsync(uri);
  //     const formData = new FormData();
  //     formData.append('file', {
  //       uri,
  //       name: 'audio.wav',
  //       type: 'audio/wav',
  //     } as any);

  //     const response = await fetch('http://localhost:8000/stt/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       body: formData,
  //     });

  //     const data = await response.json();
  //     setTranscription(data.text || 'No transcription returned.');
  //   } catch (err) {
  //     console.error('Error sending audio:', err);
  //     setTranscription('Failed to transcribe.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const sendAudioToBackend = async (uri: string) => {
  try {
    setLoading(true);
    setTranscription('');

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'audio.wav',
      type: 'audio/wav',
    } as any);

    formData.append('model_id', 'scribe_v1'); // ✅ required

    const response = await fetch('http://localhost:8000/stt/', { // ✅ use trailing slash
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();
    setTranscription(data.text || 'No transcription returned.');
  } catch (err) {
    console.error('Error sending audio:', err);
    setTranscription('Failed to transcribe.');
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ Speech-to-Text</Text>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {transcription ? (
        <Text style={styles.transcription}>{transcription}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  transcription: { marginTop: 20, fontSize: 18 },
});
