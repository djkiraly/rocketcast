import { BRAND } from "@rocketcast/config/brand";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

/**
 * M00 placeholder screen. No navigation, state, or data yet.
 * Everything shown comes from the brand constants file.
 */
export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.center}>
        <Text style={styles.title}>{BRAND.productName}</Text>
        <Text style={styles.publisher}>by {BRAND.publisher}</Text>
        <Text style={styles.tagline}>{BRAND.tagline}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0b1020",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#ffffff",
    fontSize: 40,
    fontWeight: "700",
    letterSpacing: 1,
  },
  publisher: {
    color: "#9aa4c7",
    fontSize: 16,
    marginTop: 8,
  },
  tagline: {
    color: "#d6dcf5",
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
});
