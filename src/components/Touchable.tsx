import React, { FunctionComponent } from "react";
import {
  StyleProp,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { IS_ANDROID, IS_LT_LOLLIPOP, noop } from "../utils";

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  buttonColor?: string;
  children: React.ReactNode;
};

const Touchable: FunctionComponent<Props> = ({
  onPress = noop,
  style = {},
  buttonColor = "red",
  children,
}) => {
  if (IS_ANDROID && !IS_LT_LOLLIPOP) {
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        onPress={onPress}
      >
        <View
          style={[
            style,
            {
              backgroundColor: buttonColor,
            },
          ]}
        >
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        style,
        {
          backgroundColor: buttonColor,
        },
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Touchable;
