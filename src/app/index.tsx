import { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  SectionList,
  Pressable,
  useWindowDimensions,
  SectionListRenderItemInfo,
  SectionListData,
} from "react-native";
import { Link, useNavigation } from "expo-router";
import { Image } from "expo-image";
import AC from "@bacons/apple-colors";
import {
  generations,
  Generation,
  Pokemon,
  typeColors,
  getPokemonSpriteUrl,
} from "@/data/pokemon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";

// Memoized Pokemon card for the grid
function PokemonGridItem({
  pokemon,
  itemWidth,
}: {
  pokemon: Pokemon;
  itemWidth: number;
}) {
  return (
    <Link href={`/pokemon/${pokemon.id}`} asChild>
      <Link.Trigger>
        <Pressable
          style={({ pressed }) => ({
            width: itemWidth,
            backgroundColor: AC.secondarySystemGroupedBackground,
            borderRadius: 16,
            borderCurve: "continuous",
            padding: 10,
            opacity: pressed ? 0.8 : 1,
            margin: 4,
          })}
        >
          <Text
            style={{
              position: "absolute",
              top: 6,
              right: 8,
              fontSize: 10,
              fontWeight: "600",
              color: AC.tertiaryLabel,
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
              color: AC.label,
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

// Section header component
function SectionHeader({ generation }: { generation: Generation }) {
  return (
    <Link href={`/generation/${generation.id}`} asChild>
      <Link.Trigger>
        <Pressable
          style={({ pressed }) => ({
            backgroundColor: AC.systemGroupedBackground,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 0.5,
            borderBottomColor: AC.separator,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: AC.label,
                  marginBottom: 2,
                }}
              >
                {generation.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: AC.secondaryLabel,
                }}
              >
                {generation.region} · {generation.pokemon.length} Pokémon
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                color: AC.systemBlue,
                fontWeight: "500",
              }}
            >
              See All
            </Text>
          </View>
        </Pressable>
      </Link.Trigger>
      <Link.Preview />
    </Link>
  );
}

// Type for section data with rows
interface SectionData {
  generation: Generation;
  data: Pokemon[][];
}

export default function PokedexScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const sectionListRef = useRef<SectionList<Pokemon[], SectionData>>(null);

  // Calculate item width for 3 columns
  const numColumns = 3;
  const horizontalPadding = 16;
  const itemMargin = 8;
  const itemWidth =
    (width - horizontalPadding * 2 - itemMargin * numColumns) / numColumns;

  // Setup search bar
  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Search Pokémon",
        onChangeText: (e: any) => setSearch(e.nativeEvent.text),
        onCancelButtonPress: () => setSearch(""),
      },
    });
  }, [navigation]);

  // Prepare sections with rows (3 Pokemon per row)
  const sections = useMemo(() => {
    const searchLower = search.toLowerCase().trim();

    return generations.map((generation) => {
      // Filter Pokemon based on search
      const filteredPokemon = searchLower
        ? generation.pokemon.filter(
            (p) =>
              p.name.toLowerCase().includes(searchLower) ||
              p.id.toString().includes(searchLower) ||
              p.types.some((t) => t.toLowerCase().includes(searchLower))
          )
        : generation.pokemon;

      // Group Pokemon into rows of 3
      const rows: Pokemon[][] = [];
      for (let i = 0; i < filteredPokemon.length; i += numColumns) {
        rows.push(filteredPokemon.slice(i, i + numColumns));
      }

      return {
        generation,
        data: rows,
      };
    }).filter((section) => section.data.length > 0);
  }, [search]);

  const renderItem = useCallback(
    ({ item: pokemonRow }: SectionListRenderItemInfo<Pokemon[], SectionData>) => (
      <PokemonRow pokemonRow={pokemonRow} itemWidth={itemWidth} />
    ),
    [itemWidth]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionListData<Pokemon[], SectionData> }) => (
      <SectionHeader generation={section.generation} />
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: Pokemon[], index: number) =>
      `row-${item[0]?.id || index}-${item.length}`,
    []
  );

  // Quick jump to generation
  const scrollToGeneration = useCallback((genIndex: number) => {
    sectionListRef.current?.scrollToLocation({
      sectionIndex: genIndex,
      itemIndex: 0,
      viewOffset: 0,
      animated: true,
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: AC.systemGroupedBackground }}>
      {/* Generation quick jump bar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingVertical: 8,
          paddingHorizontal: 8,
          gap: 4,
          backgroundColor: AC.systemGroupedBackground,
        }}
      >
        {generations.map((gen, index) => (
          <Pressable
            key={gen.id}
            onPress={() => scrollToGeneration(index)}
            style={({ pressed }) => ({
              paddingHorizontal: 10,
              paddingVertical: 6,
              backgroundColor: pressed
                ? AC.systemFill
                : AC.tertiarySystemGroupedBackground,
              borderRadius: 8,
              borderCurve: "continuous",
            })}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: AC.label,
              }}
            >
              {gen.id}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionList
        ref={sectionListRef}
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        stickySectionHeadersEnabled
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding - 4,
          paddingBottom: insets.bottom + 20,
        }}
        initialNumToRender={15}
        maxToRenderPerBatch={20}
        windowSize={7}
        removeClippedSubviews
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
      />
    </View>
  );
}
