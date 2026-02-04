import { useLocalSearchParams, Stack, Link } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  useWindowDimensions,
  ListRenderItemInfo,
} from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/utils/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  generations,
  Pokemon,
  typeColors,
  getPokemonSpriteUrl,
} from "@/data/pokemon";

// Pokemon card content
function PokemonCardContent({
  pokemon,
  itemWidth,
  pressed,
}: {
  pokemon: Pokemon;
  itemWidth: number;
  pressed: boolean;
}) {
  return (
    <View
      style={{
        width: itemWidth,
        backgroundColor: Colors.secondarySystemGroupedBackground,
        borderRadius: 16,
        borderCurve: "continuous",
        padding: 10,
        opacity: pressed ? 0.8 : 1,
        margin: 4,
      }}
    >
      <Text
        style={{
          position: "absolute",
          top: 6,
          right: 8,
          fontSize: 10,
          fontWeight: "600",
          color: Colors.tertiaryLabel,
          fontVariant: ["tabular-nums"],
        }}
      >
        #{String(pokemon.id).padStart(4, "0")}
      </Text>

      <View
        style={{
          alignItems: "center",
          aspectRatio: 1,
          marginBottom: 6,
        }}
      >
        <Image
          source={{ uri: getPokemonSpriteUrl(pokemon.id) }}
          style={{ width: "100%", height: "100%" }}
          contentFit="contain"
          recyclingKey={`pokemon-${pokemon.id}`}
        />
      </View>

      <Text
        numberOfLines={1}
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: Colors.label,
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        {pokemon.name}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        {pokemon.types.map((type) => (
          <View
            key={type}
            style={{
              backgroundColor: typeColors[type] || "#A8A878",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 8,
              borderCurve: "continuous",
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: "600",
                color: "#fff",
                textTransform: "capitalize",
              }}
            >
              {type}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Pokemon card for the grid
function PokemonGridItem({
  pokemon,
  itemWidth,
}: {
  pokemon: Pokemon;
  itemWidth: number;
}) {
  if (process.env.EXPO_OS === "web") {
    return (
      <Link href={`/pokemon/${pokemon.id}`} asChild>
        <Pressable>
          {({ pressed }) => (
            <PokemonCardContent
              pokemon={pokemon}
              itemWidth={itemWidth}
              pressed={pressed}
            />
          )}
        </Pressable>
      </Link>
    );
  }

  return (
    <Link href={`/pokemon/${pokemon.id}`} asChild>
      <Link.Trigger>
        <Pressable>
          {({ pressed }) => (
            <PokemonCardContent
              pokemon={pokemon}
              itemWidth={itemWidth}
              pressed={pressed}
            />
          )}
        </Pressable>
      </Link.Trigger>
      <Link.Preview />
    </Link>
  );
}

// Row component that renders 3 Pokemon cards
function PokemonRow({
  pokemonRow,
  itemWidth,
}: {
  pokemonRow: Pokemon[];
  itemWidth: number;
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
      {pokemonRow.map((pokemon) => (
        <PokemonGridItem
          key={pokemon.id}
          pokemon={pokemon}
          itemWidth={itemWidth}
        />
      ))}
    </View>
  );
}

export default function GenerationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const genId = parseInt(id || "1", 10);
  const generation = useMemo(
    () => generations.find((g) => g.id === genId),
    [genId]
  );

  // Calculate item width for 3 columns
  const numColumns = 3;
  const horizontalPadding = 16;
  const itemMargin = 8;
  const itemWidth =
    (width - horizontalPadding * 2 - itemMargin * numColumns) / numColumns;

  // Group Pokemon into rows of 3
  const rows = useMemo(() => {
    if (!generation) return [];
    const result: Pokemon[][] = [];
    for (let i = 0; i < generation.pokemon.length; i += numColumns) {
      result.push(generation.pokemon.slice(i, i + numColumns));
    }
    return result;
  }, [generation]);

  const renderItem = useCallback(
    ({ item: pokemonRow }: ListRenderItemInfo<Pokemon[]>) => (
      <PokemonRow pokemonRow={pokemonRow} itemWidth={itemWidth} />
    ),
    [itemWidth]
  );

  const keyExtractor = useCallback(
    (item: Pokemon[], index: number) =>
      `row-${item[0]?.id || index}-${item.length}`,
    []
  );

  if (!generation) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.systemGroupedBackground,
        }}
      >
        <Text style={{ color: Colors.secondaryLabel, fontSize: 17 }}>
          Generation not found
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: generation.name,
          headerLargeTitle: true,
        }}
      />
      <FlatList
        data={rows}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding - 4,
          paddingBottom: insets.bottom + 20,
        }}
        ListHeaderComponent={
          <View
            style={{
              paddingHorizontal: 8,
              paddingTop: 8,
              paddingBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: Colors.secondaryLabel,
                marginBottom: 4,
              }}
            >
              {generation.region} Region
            </Text>
            <Text
              selectable
              style={{
                fontSize: 14,
                color: Colors.tertiaryLabel,
              }}
            >
              #{generation.range[0]} - #{generation.range[1]} ·{" "}
              {generation.pokemon.length} Pokémon
            </Text>
          </View>
        }
        initialNumToRender={15}
        maxToRenderPerBatch={20}
        windowSize={7}
        removeClippedSubviews
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: Colors.systemGroupedBackground }}
      />
    </>
  );
}
