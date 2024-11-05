import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { data } from "@/constants/data";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Animated, { FadeInRight } from "react-native-reanimated";

type CategoryPropType = {
  handleChangeCategory: (cat: string | null) => void;
  activeCategory: string | null;
};

const Categories = ({
  activeCategory,
  handleChangeCategory,
}: CategoryPropType) => {
  return (
    <FlatList
      data={data.categories}
      renderItem={({ item, index }) => (
        <CategoryItem
          title={item}
          index={index}
          isActive={activeCategory == item}
          handleChangeCategory={handleChangeCategory}
        />
      )}
      showsHorizontalScrollIndicator={false}
      horizontal
      contentContainerStyle={styles.flatListContainer}
    />
  );
};

export default Categories;

type CategoryItemPropType = {
  title: string;
  index: number;
  handleChangeCategory: (cat: string | null) => void;
  isActive: boolean;
};
const CategoryItem = ({
  index,
  title,
  handleChangeCategory,
  isActive,
}: CategoryItemPropType) => {
  let color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
  let backgroundColor = isActive
    ? theme.colors.neutral(0.8)
    : theme.colors.white;
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200)
        .duration(100)
        .springify()
        .damping(14)}
    >
      <Pressable
        style={[styles.category, { backgroundColor }]}
        onPress={() => handleChangeCategory(isActive ? null : title)}
      >
        <Text style={[styles.title, { color }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },
  category: {
    padding: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.colors.grayBg,
    backgroundColor: "white",
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: "600",
  },
});
