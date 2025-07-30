// app/(tabs)/models.tsx

import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { tw } from "nativewind";

export default function ModelsScreen() {
  const [data, setData] = useState<null | {
    only_in_models: string[];
    only_in_list_models: string[];
    shared_models: string[];
  }>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/compare_models")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        console.error("Error fetching model comparison:", err);
        setError("Could not load model data.");
      });
  }, []);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">🧪 Model Comparison</Text>

      {error && <Text className="text-red-500">{error}</Text>}

      {data && (
        <>
          <Section title="✅ Shared Models" color="text-green-700" items={data.shared_models} />
          <Section title="❌ Only in /models" color="text-red-700" items={data.only_in_models} />
          <Section title="❌ Only in /list_models" color="text-red-700" items={data.only_in_list_models} />
        </>
      )}
    </ScrollView>
  );
}

function Section({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <View className="mb-6">
      <Text className={`text-xl font-semibold mb-2 ${color}`}>{title}</Text>
      {items.length === 0 ? (
        <Text className="text-gray-500 italic">None</Text>
      ) : (
        items.map((item) => (
          <Text key={item} className="text-gray-800 pl-2">
            • {item}
          </Text>
        ))
      )}
    </View>
  );
}
