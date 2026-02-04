import { memo, useCallback } from "react";
import { Text, View, FlatList, ListRenderItemInfo } from "react-native";
import AC from "@bacons/apple-colors";
import { Generation, Pokemon } from "@/data/pokemon";
import { PokemonCard } from "./pokemon-card";

interface GenerationSectionProps {
  generation: Generation;
}

const ITEM_HEIGHT = 160;
const NUM_COLUMNS = 3;

function GenerationSectionComponent({ generation }: GenerationSectionProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Pokemon>) => (
      <View style={{ flex: 1, padding: 4 }}>
        <PokemonCard pokemon={item} />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: Pokemon) => `pokemon-${item.id}`,
    []
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * Math.floor(index / NUM_COLUMNS),
      index,
    }),
    []
  );

  return (
    <View style={{ marginBottom: 24 }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: AC.systemGroupedBackground,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: AC.label,
            marginBottom: 4,
          }}
        >
          {generation.name}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: AC.secondaryLabel,
          }}
        >
          {generation.region} Region · #{generation.range[0]}-#
          {generation.range[1]}
        </Text>
      </View>

      <FlatList
        data={generation.pokemon}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        scrollEnabled={false}
        getItemLayout={getItemLayout}
        initialNumToRender={12}
        maxToRenderPerBatch={15}
        windowSize={5}
        removeClippedSubviews
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 8,
        }}
      />
    </View>
  );
}

export const GenerationSection = memo(GenerationSectionComponent);
