// app/(tabs)/stt.tsx
// This file handles both recording audio and sending it to the server for transcription.
// It includes two main steps: recording the audio and uploading it to the server for STT (Speech-to-Text) processing.
// The transcription result is displayed on the screen.
// The code uses Expo's Audio API for recording and React Native components for UI.
// The server endpoint for STT is assumed to be at "/stt".
// The code also includes error handling and user feedback for the recording and transcription process.
// This file is part of a React Native application using Expo.
// This file is a continuation of the stt2.tsx file, which only handles the recording part.

import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";

export default function STTScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const startRecording = async () => {
    try {
      console.log("Requesting permissions..");
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Microphone permission required.");
        return;
      }

      console.log("Setting audio mode...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();

      setRecording(newRecording);
      setRecordingUri(null);
      setTranscription(null);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      console.log("Stopping recording..");
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
      console.log("Recording stopped. URI:", uri);

      if (uri) {
        await uploadToSTT(uri);
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const uploadToSTT = async (uri: string) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "audio.m4a",
        type: "audio/x-m4a",
      } as any);
      // formData.append("model_id", "eleven_multilingual_v2");
      formData.append("model_id", "scribe_v1");

      const res = await fetch("http://localhost:8000/stt/", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.error) {
        console.error("STT error:", json.error);
        Alert.alert("Transcription failed", json.error);
      } else {
        console.log("Transcription:", json);
        setTranscription(json.text || JSON.stringify(json));
      }
    } catch (err) {
      console.error("Upload to STT failed", err);
      Alert.alert("Upload failed", String(err));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
        disabled={isUploading}
      />
      {recordingUri && (
        <Text style={styles.uriText}>Recording saved to: {recordingUri}</Text>
      )}
      {transcription && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Transcription:</Text>
          <Text>{transcription}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  uriText: {
    fontSize: 12,
    color: "gray",
  },
  resultBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  resultTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});
