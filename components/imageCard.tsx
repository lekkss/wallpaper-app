import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getImageSize, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";

const ImageCard = ({
  image,
  index,
  columns,
}: {
  image: any;
  index: number;
  columns: number;
}) => {
  const getDynamicHeight = () => {
    let { imageHeight: height, imageWidth: width } = image;
    return { height: getImageSize({ height, width }) };
  };
  const isLastRow = () => {
    return (index + 1) % columns === 0;
  };
  return (
    <Pressable style={[styles.imageWrapper, !isLastRow() && styles.spacing]}>
      <Image
        style={[styles.image, getDynamicHeight()]}
        source={{ uri: image?.webformatURL }}
        transition={100}
      />
    </Pressable>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  imageWrapper: {
    backgroundColor: theme.colors.grayBg,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
    marginBottom: wp(2),
  },
  image: {
    height: 300,
    width: "100%",
  },
  spacing: {
    marginRight: wp(2),
    marginBottom: wp(2),
  },
});
