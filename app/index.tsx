import React, { useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

let charset = "0123456789";

export default function Index() {
  const [number, setNumber] = useState(""); // Store the generated number
  const [correctCount, setCorrectCount] = useState(0); // Store the number of correct digits
  const [inputValues, setInputValues] = useState(["", "", "", ""]); // State to store input values
  const [hasWon, setHasWon] = useState(false); // State to track if the user has won
  const [showNumbers, setShowNumbers] = useState(false); // State to control visibility of the numbers
  const [lastGuess, setLastGuess] = useState(""); // State to store the last submitted guess

  function generateNumber() {
    let numbers = "";

    for (let i = 0, n = charset.length; i < 4; i++) { // Assuming 4 digits
      numbers += charset.charAt(Math.floor(Math.random() * n));
    }

    setNumber(numbers);
    setCorrectCount(0); // Reset correct count on new game
    setInputValues(["", "", "", ""]); // Reset input values
    setHasWon(false); // Reset win state
    setShowNumbers(false); // Hide numbers initially
    setLastGuess(""); // Reset last guess
    inputRefs.current[0]?.focus(); // Reset focus to the first input field
  }

  function checkNumbers() {
    if (inputValues.some((val) => val === "")) {
      Alert.alert("Incomplete Input", "Please fill in all digits.");
      return;
    }

    let correct = 0;

    // Compare each digit of the input with the generated number
    for (let i = 0; i < 4; i++) {
      if (inputValues[i] === number[i]) {
        correct++;
      }
    }

    setCorrectCount(correct);
    setLastGuess(inputValues.join("")); // Update the last guess
    setInputValues(["", "", "", ""]);

    if (correct === 4) {
      setHasWon(true); // Set win state
      Alert.alert("You Won!", "Congratulations, you guessed the number correctly!");
      return; // Return early to avoid unnecessary state updates
    }
  }

  function toggleShowNumbers() {
    setShowNumbers(!showNumbers);
  }

  // Define refs with proper typing
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Handle changes in input fields
  const handleChangeText = (text: string, index: number) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = text;
    setInputValues(newInputValues);

    // Check if input has text and it's not the last input
    if (text.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Guess the number!</Text>
        </View>
        <View style={styles.numberContainer}>
          <View style={styles.numberRow}>
            {showNumbers || hasWon ? number.split("").map((char, index) => (
              <TextInput
                key={index}
                style={styles.inputBox}
                value={char} // Display the number
                editable={false} // Make input non-editable
              />
            )) : [...Array(4)].map((_, index) => (
              <TextInput
                key={index}
                style={styles.inputBox}
                value={"#"} // Display placeholder
                editable={false} // Make input non-editable
              />
            ))}
          </View>
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{correctCount} correct</Text>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.yourGuessContainer}>
              <Text style={styles.yourGuessText}>
                Your Guess: {lastGuess ? lastGuess : "None"}
              </Text>
            </View>
            <View style={styles.inputRow}>
              {[0, 1, 2, 3].map((_, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  keyboardType="numeric"
                  textAlign="center"
                  style={styles.inputBox}
                  returnKeyType="done"
                  maxLength={1}
                  value={inputValues[index]} // Set the value from state
                  onChangeText={(text) => handleChangeText(text, index)}
                />
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={checkNumbers}
              >
                <Text style={styles.buttonText}>Check Numbers</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={generateNumber}
              >
                <Text style={styles.buttonText}>New Game</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleShowNumbers}
              >
                <Text style={styles.buttonText}>
                  {showNumbers ? "Hide Numbers" : "Show Numbers"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#513d80",
  },
  innerContainer: {
    backgroundColor: "#fff",
    height: "94%",
    marginTop: 40,
    width: "97%",
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#513d80",
  },
  numberContainer: {
    flex: 4,
    width: "80%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  numberRow: {
    flexDirection: "row",
    gap: 28,
    width: "80%",
    justifyContent: "space-around",
  },
  numberBox: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "#513d80",
    borderRadius: 8,
    textAlign: "center",
    lineHeight: 60, // Center the text vertically
  },
  resultContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#513d80",
    width: "88%",
    borderRadius: 8,
    margin: 24,
  },
  resultText: {
    textAlign: "center",
    fontSize: 18,
  },
  inputContainer: {
    width: "100%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    gap: 28,
    width: "80%",
    justifyContent: "space-around",
  },
  inputBox: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "#513d80",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
  },
  buttonContainer: {
    width: "80%",
    marginTop: 34,
    gap: 18,
    justifyContent: "space-between",
    height: 100,
  },
  button: {
    backgroundColor: "#513d80",
    width: 250,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  yourGuessContainer: {
    margin: 8,
    borderBottomWidth: 1,
    width: "80%",
    justifyContent: "center",
    padding: 6,
    marginBottom: 12,
  },
  yourGuessText: {
    textAlign: "center",
  },
});
