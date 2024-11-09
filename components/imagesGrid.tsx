import { StyleSheet, View } from "react-native";
import React from "react";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./imageCard";
import { wp, getColumnCount } from "@/helpers/common";
import { Router } from "expo-router";

const ImagesGrid = ({ images, router }: { images: any; router: Router }) => {
  const columns = getColumnCount();
  return (
    <View style={styles.container}>
      <MasonryFlashList
        contentContainerStyle={styles.listContainerStyle}
        data={images}
        estimatedItemSize={200}
        numColumns={columns}
        renderItem={({ item, index }) => (
          <ImageCard
            image={item}
            index={index}
            columns={columns}
            router={router}
          />
        )}
      />
    </View>
  );
};

export default ImagesGrid;

const styles = StyleSheet.create({
  container: {
    minWidth: 2,
    width: wp(100),
  },
  listContainerStyle: {
    paddingHorizontal: wp(4),
  },
});
