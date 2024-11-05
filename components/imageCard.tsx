import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";

const ImageCard = ({
  image,
  index,
  columns,
}: {
  image: any;
  index: number;
  columns: number;
}) => {
  return (
    <Pressable>
      <Image
        style={styles.image}
        source={{ uri: image?.webformatURL }}
        contentFit="cover"
        transition={1000}
      />
    </Pressable>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: "100%",
  },
});
