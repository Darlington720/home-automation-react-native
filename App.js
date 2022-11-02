import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import init from "react_native_mqtt";

import { useEffect, useState } from "react";

const topic = "test/topic/led1";

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

export default function App() {
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [lightOn, setlightOn] = useState(0);
  useEffect(() => {
    console.log("Mounted");
    setIsLED1Disabled(true);
  }, []);

  const onMessageArrived = (message) => {
    console.log("Message arrived", message.payloadString);
    if (message.payloadString == "on") {
      setlightOn(true);
    } else {
      setlightOn(false);
    }
    // onLED1Connect();
  };

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }

  const onLED1Connect = () => {
    console.log("Led connected");
    setConnectSuccess(true);
    setIsLED1Disabled(false);
  };

  const onConnect = () => {
    console.log("Onconnect");

    client.subscribe(topic);
    // client.publish(topic, "ping");
  };

  const onLight = () => {
    client.publish(topic, lightOn ? "on" : "off");
  };

  const [isLED1Disabled, setIsLED1Disabled] = useState(0);
  const client = new Paho.MQTT.Client("192.168.42.28", 9001, "akampa_");
  client.onMessageArrived = onMessageArrived;
  client.onConnectionLost = onConnectionLost;
  client.connect({
    onSuccess: onConnect,
    useSSL: false,
    onFailure: onConnectionLost,
  });

  return (
    <View style={styles.container}>
      <Text>LED 1</Text>
      <TouchableOpacity
        onPress={() => onLight()}
        // disabled={isLED1Disabled}
        style={{
          width: 100,
          // height: 20,
          padding: 10,
          borderRadius: 10,
          justifyContent: "center",
          backgroundColor: connectSuccess ? "green" : "red",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
          }}
        >
          Power On
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
