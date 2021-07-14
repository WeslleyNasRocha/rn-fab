import React, {
  ComponentProps,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Touchable } from "./components";
import { noop } from "./utils";

interface Props {
  visible?: boolean;
  onClickAction: () => void;
  buttonColor?: string;
  iconTextColor?: string;
  iconTextComponent?: JSX.Element;
  snackOffset?: number;
  style?: ComponentProps<typeof TouchableOpacity>["style"];
}

const durationValues = {
  entry: 225,
  exit: 195,
};

const sharpEasingValues = {
  entry: Easing.bezier(0.0, 0.0, 0.2, 1),
  exit: Easing.bezier(0.4, 0.0, 0.6, 1),
};

const moveEasingValues = {
  entry: Easing.bezier(0.0, 0.0, 0.2, 1),
  exit: Easing.bezier(0.4, 0.0, 1, 1),
};

const FAB: FunctionComponent<Props> = ({
  iconTextComponent = <Text>+</Text>,
  iconTextColor = "#ffffff",
  onClickAction = noop,
  visible = true,
  snackOffset = 0,
  buttonColor = "red",
  style,
}) => {
  const [translateValue, setTranslateValue] = useState(new Animated.Value(0));
  const [shiftValue, setShiftValue] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      translateValue.setValue(1);
    } else {
      translateValue.setValue(0);
    }
    if (snackOffset === 0) {
      shiftValue.setValue(20);
    } else {
      shiftValue.setValue(20 + snackOffset);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateValue, {
        useNativeDriver: false,
        duration: durationValues.entry,
        toValue: 1,
        easing: sharpEasingValues.entry,
      }).start();
    } else {
      Animated.timing(translateValue, {
        useNativeDriver: false,
        duration: durationValues.exit,
        toValue: 0,
        easing: sharpEasingValues.exit,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (snackOffset === 0) {
      Animated.timing(shiftValue, {
        useNativeDriver: false,
        duration: durationValues.exit,
        toValue: 20,
        easing: moveEasingValues.exit,
      }).start();
    } else {
      Animated.timing(shiftValue, {
        useNativeDriver: false,
        duration: durationValues.entry,
        toValue: 20 + snackOffset,
        easing: moveEasingValues.entry,
      }).start();
    }
  }, [snackOffset]);

  const dimensionInterpolate = translateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 56],
  });

  const rotateInterpolate = translateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["-90deg", "0deg"],
  });

  return (
    <Animated.View style={[styles.fabContainer, { bottom: shiftValue }]}>
      <Animated.View
        style={[
          styles.addButton,
          {
            height: dimensionInterpolate,
            width: dimensionInterpolate,
          },
        ]}
      >
        <Touchable
          onPress={onClickAction}
          style={[styles.addButtonInnerContainer, style]}
          buttonColor={buttonColor}
        >
          <Animated.View
            style={{
              transform: [
                { scaleX: translateValue },
                { rotate: rotateInterpolate },
              ],
            }}
          >
            {React.cloneElement(iconTextComponent, {
              style: {
                fontSize: 24,
                color: iconTextColor,
              },
            })}
          </Animated.View>
        </Touchable>
      </Animated.View>
    </Animated.View>
  );
};

export default FAB;

const styles = StyleSheet.create({
  addButton: {
    borderRadius: 50,
    alignItems: "stretch",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 2,
  },
  fabContainer: {
    position: "absolute",
    bottom: 17,
    right: 17,
    height: 62,
    width: 62,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  addButtonInnerContainer: {
    flex: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
