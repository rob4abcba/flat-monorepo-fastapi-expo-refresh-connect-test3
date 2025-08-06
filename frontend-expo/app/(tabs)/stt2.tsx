// frontend-expo/app/(tabs)/stt2.tsx
// This stt2.tsx file is basically just the beginning portion of the original stt.tsx file, focusing on just step1 record and save to .m4a audio file, without step2 which sends the .m4a audio file to /stt to get its text transcription.


import { Audio } from "expo-av";
import { useState } from "react";
import { Button, View, Text } from "react-native";

export default function RecorderScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      console.log("Requesting permissions..");
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        console.error("Permission to access microphone is required!");
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
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording..");
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
      console.log("Recording stopped and stored at", uri);
    } catch (err) {
      console.error("Error stopping recording", err);
    }
  };

  return (
    <View>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {recordingUri && <Text>Saved to: {recordingUri}</Text>}
    </View>
  );
}
