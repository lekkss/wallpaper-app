import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import FiltersModal from "@/components/filtersModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const Home = () => {
  let page;
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const searchInputRef = useRef<TextInput>(null);

  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<any | null>();
  const [images, setImages] = useState<any>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleChangeCategory = (cat: string | null) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    let params: any = {
      page,
      ...filters,
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
      page = 1;
      setActiveCategory(null);
      setImages([]);
      fetchImages({ page, q: text, ...filters }, false);
    }
    if (text == "") {
      page = 1;
      //reset result
      searchInputRef.current?.clear();
      setActiveCategory(null);
      setImages([]);
      fetchImages({ page, ...filters }, false);
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

  // ----Modal-----

  // ref
  const modalRef = useRef<BottomSheetModal>(null);
  // callbacks
  const openFilterModal = useCallback(() => {
    modalRef.current?.present();
  }, []);
  const closeFilterModal = useCallback(() => {
    modalRef.current?.close();
  }, []);

  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModal();
  };
  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params: any = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModal();
  };

  const clearThisFilter = (filter: any) => {
    let filterz = { ...filters };
    delete filterz[filter];
    setFilters({ ...filterz });
    page = 1;
    let params = {
      page,
      ...filterz,
    };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable onPress={openFilterModal}>
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
        {/* Filters */}
        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {key == "colors" ? (
                      <View
                        style={{
                          width: 30,
                          height: 20,
                          borderRadius: 7,
                          backgroundColor: filters[key],
                        }}
                      />
                    ) : (
                      <Text style={styles.filterItemText}>{filters[key]}</Text>
                    )}
                    <Pressable
                      style={styles.filterCloseIcon}
                      onPress={() => clearThisFilter(key)}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.neutral(0.9)}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
        {/* images mansory */}
        <View>{images.length > 0 && <ImagesGrid images={images} />}</View>
        {/* loaidng */}
        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>
      {/* Filers */}
      <FiltersModal
        filters={filters}
        setFilters={setFilters}
        modalRef={modalRef}
        closeFilterModal={closeFilterModal}
        onApply={applyFilters}
        onReset={resetFilters}
      />
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
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBg,
    padding: 8,
    flexDirection: "row",
    borderRadius: theme.radius.xs,
    gap: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  filterItemText: {
    fontSize: hp(1.9),
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },
});
