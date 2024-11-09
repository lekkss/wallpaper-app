import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { capitalze, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import SectionView, { ColorFilter, CommonFilterRow } from "./filterViews";
import { data } from "@/constants/data";

type PropType = {
  modalRef: React.RefObject<BottomSheetModalMethods>;
  closeFilterModal: () => void;
  onApply: () => void;
  onReset: () => void;
  filters: any;
  setFilters: Dispatch<SetStateAction<any>>;
};

const FiltersModal = ({
  modalRef,
  closeFilterModal,
  onApply,
  onReset,
  filters,
  setFilters,
}: PropType) => {
  const snapPoints = useMemo(() => ["75%"], []);
  return (
    <BottomSheetModal
      ref={modalRef}
      //   onChange={closeFilterModal}
      snapPoints={snapPoints}
      backdropComponent={CustonBackDrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {Object.keys(sections).map((sectionName: string, index) => {
            const sectionView = sections[sectionName];
            let sectionData = data.filters[sectionName];
            let title = capitalze(sectionName);
            return (
              <Animated.View
                key={sectionName}
                entering={FadeInDown.delay(index * 100 + 100)
                  .springify()
                  .damping(11)}
              >
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}
                />
              </Animated.View>
            );
          })}

          {/* Actions */}
          <Animated.View
            style={styles.buttons}
            entering={FadeInDown.delay(500).springify().damping(11)}
          >
            <Pressable style={styles.resetButton} onPress={onReset}>
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.colors.neutral(0.9) },
                ]}
              >
                Reset
              </Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onApply}>
              <Text style={[styles.buttonText, { color: theme.colors.white }]}>
                Apply
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections: { [key: string]: (props: any) => JSX.Element } = {
  order: (props: any) => <CommonFilterRow {...props} />,
  orientation: (props: any) => <CommonFilterRow {...props} />,
  type: (props: any) => <CommonFilterRow {...props} />,
  colors: (props: any) => <ColorFilter {...props} />,
};

const CustonBackDrop = ({ animatedIndex, style }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [-0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });
  const containerAnimatedStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    animatedStyle,
  ];
  return (
    <Animated.View style={containerAnimatedStyle}>
      <BlurView
        style={StyleSheet.absoluteFill}
        tint="dark"
        intensity={25}
      ></BlurView>
    </Animated.View>
  );
};
export default FiltersModal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    flex: 1,
    // width: "100%",
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: "600",
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.03),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: theme.colors.grayBg,
  },
  buttonText: {
    fontSize: hp(2.2),
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
  },
});
