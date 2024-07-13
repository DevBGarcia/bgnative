import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IconProps } from "react-native-vector-icons/Icon";

export type IconButtonProps = {
  IconButtonTouchableOpacityProps?: TouchableOpacityProps;
  IconButtonIconProps?: IconProps;
  isDisabled?: boolean;
};

const IconButton = ({
  IconButtonTouchableOpacityProps = {},
  IconButtonIconProps = { name: "" },
  isDisabled = false,
}: IconButtonProps) => {
  const iconColor = isDisabled ? "gray" : IconButtonIconProps.color;

  return (
    <TouchableOpacity {...IconButtonTouchableOpacityProps}>
      <Icon size={48} {...IconButtonIconProps} color={iconColor} />
    </TouchableOpacity>
  );
};

export default IconButton;
