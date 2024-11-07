import {
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { setStatusBarStyle } from "expo-status-bar";
import Categories from "@/components/categories";
import { apiCall } from "@/api";
import ImagesGrid from "@/components/imagesGrid";
import { debounce } from "lodash";

const Home = () => {
  let page;
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const searchInputRef = useRef<TextInput>(null);

  const [search, setSearch] = useState<string>("");
  const [images, setImages] = useState<any>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleChangeCategory = (cat: string | null) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    let params: any = {
      page,
    };
    if (cat) params.category = cat;
    fetchImages(params, false);
  };

  useEffect(() => {
    fetchImages();
  }, []);
  const fetchImages = async (params = {}, append = false) => {
    // Merge provided params with default params
    const finalParams = { page: 1, ...params };

    console.log("Final params: ", finalParams, "Append:", append);

    let res = await apiCall(finalParams);
    if (res.success && res.data.hits) {
      if (append) {
        setImages([...images, ...res.data?.hits]);
      } else {
        setImages([...res.data?.hits]);
      }
    }
  };
  const handleSearch = (text: string) => {
    console.log("Seraching for: ", text);
    setSearch(text);
    if (text.length > 2) {
      //search
      setActiveCategory(null);
      page = 1;
      setImages([]);
      fetchImages({ page, q: text }, false);
    }
    if (text == "") {
      //reset result
      searchInputRef.current?.clear();
      setActiveCategory(null);
      setImages([]);
      fetchImages({ page: 1 });
    }
  };
  const handleDebounce = useCallback(
    debounce((text: string) => handleSearch(text), 400),
    []
  );

  const clearSearch = () => {
    setSearch("");
    // searchInputRef.current?.clear();
  };
  useEffect(() => {
    setTimeout(() => {
      setStatusBarStyle("dark");
    }, 0);
  }, []);
  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            colos={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>
      {/*  */}
      <ScrollView contentContainerStyle={{ gap: 15 }}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            ref={searchInputRef}
            // value={search}
            onChangeText={handleDebounce}
            style={styles.searchInput}
            placeholder="Search for photos.."
          />
          {search && (
            <Pressable
              style={styles.closeIcon}
              onPress={() => handleSearch("")}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>
        {/* categories */}
        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>
        {/* images mansory */}
        <View>{images.length > 0 && <ImagesGrid images={images} />}</View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: "600",
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayBg,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
  categories: {},
});
