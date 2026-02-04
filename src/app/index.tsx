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
import { Colors } from "@/utils/colors";
import {
  generations,
  Generation,
  Pokemon,
  typeColors,
  getPokemonSpriteUrl,
} from "@/data/pokemon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";

// Pokemon card content component
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

// Memoized Pokemon card for the grid
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

// Section header content component
function SectionHeaderContent({
  generation,
  pressed,
}: {
  generation: Generation;
  pressed: boolean;
}) {
  return (
    <View
      nativeID={`generation-header-${generation.id}`}
      style={{
        backgroundColor: Colors.systemGroupedBackground,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.separator,
        opacity: pressed ? 0.7 : 1,
      }}
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
              color: Colors.label,
              marginBottom: 2,
            }}
          >
            {generation.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: Colors.secondaryLabel,
            }}
          >
            {generation.region} · {generation.pokemon.length} Pokémon
          </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            color: Colors.systemBlue,
            fontWeight: "500",
          }}
        >
          See All
        </Text>
      </View>
    </View>
  );
}

// Section header component
function SectionHeader({ generation }: { generation: Generation }) {
  if (process.env.EXPO_OS === "web") {
    return (
      <Link href={`/generation/${generation.id}`} asChild>
        <Pressable>
          {({ pressed }) => (
            <SectionHeaderContent generation={generation} pressed={pressed} />
          )}
        </Pressable>
      </Link>
    );
  }

  return (
    <Link href={`/generation/${generation.id}`} asChild>
      <Link.Trigger>
        <Pressable>
          {({ pressed }) => (
            <SectionHeaderContent generation={generation} pressed={pressed} />
          )}
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

// Layout constants
const NUM_COLUMNS = 3;
const HORIZONTAL_PADDING = 16;
const ITEM_MARGIN = 8;
const SECTION_HEADER_HEIGHT = 58;

export default function PokedexScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const sectionListRef = useRef<SectionList<Pokemon[], SectionData>>(null);

  // Calculate item width for 3 columns
  const itemWidth =
    (width - HORIZONTAL_PADDING * 2 - ITEM_MARGIN * NUM_COLUMNS) / NUM_COLUMNS;

  // Row height calculation:
  // - Card margin: 4 top + 4 bottom = 8
  // - Card padding: 10 top + 10 bottom = 20
  // - Image: aspectRatio 1, inner width = itemWidth - 20, so height = itemWidth - 20
  // - Image marginBottom: 6
  // - Name text (~16px with fontSize 12): 16
  // - Name marginBottom: 4
  // - Type badges (~17px with fontSize 9 + padding): 17
  // Total: 8 + 20 + (itemWidth - 20) + 6 + 16 + 4 + 17 = itemWidth + 51
  const rowHeight = itemWidth + 51;

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
      for (let i = 0; i < filteredPokemon.length; i += NUM_COLUMNS) {
        rows.push(filteredPokemon.slice(i, i + NUM_COLUMNS));
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

  // Calculate getItemLayout for SectionList to enable scrollToLocation
  const getItemLayout = useCallback(
    (
      data: SectionListData<Pokemon[], SectionData>[] | null,
      index: number
    ) => {
      // For SectionList, we need to calculate cumulative offset
      // Each section has: header + items
      let offset = 0;
      let itemIndex = index;

      if (data) {
        for (const section of data) {
          // Section header
          if (itemIndex === 0) {
            return { length: SECTION_HEADER_HEIGHT, offset, index };
          }
          offset += SECTION_HEADER_HEIGHT;
          itemIndex--;

          // Section items
          const itemCount = section.data.length;
          if (itemIndex < itemCount) {
            offset += itemIndex * rowHeight;
            return { length: rowHeight, offset, index };
          }
          offset += itemCount * rowHeight;
          itemIndex -= itemCount;
        }
      }

      return { length: rowHeight, offset, index };
    },
    [rowHeight]
  );

  // Calculate offset to a specific section
  const getSectionOffset = useCallback(
    (sectionIndex: number) => {
      let offset = 0;
      for (let i = 0; i < sectionIndex && i < sections.length; i++) {
        offset += SECTION_HEADER_HEIGHT;
        offset += sections[i].data.length * rowHeight;
      }
      return offset;
    },
    [sections, rowHeight]
  );

  // Quick jump to generation
  const scrollToGeneration = useCallback(
    (genIndex: number) => {
      if (genIndex < 0 || genIndex >= sections.length) return;

      const generation = sections[genIndex].generation;

      // On web, use native scrollIntoView for precise scrolling
      if (process.env.EXPO_OS === "web") {
        const element = document.getElementById(`generation-header-${generation.id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }

      // On native, use scrollToLocation
      sectionListRef.current?.scrollToLocation({
        sectionIndex: genIndex,
        itemIndex: 0,
        viewOffset: 0,
        animated: true,
      });
    },
    [sections]
  );

  // Handle scroll to index failures (fallback)
  const onScrollToIndexFailed = useCallback(
    (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
      setTimeout(() => {
        sectionListRef.current?.scrollToLocation({
          sectionIndex: 0,
          itemIndex: Math.min(info.index, info.highestMeasuredFrameIndex),
          animated: true,
        });
      }, 100);
    },
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.systemGroupedBackground }}>
      {/* Generation quick jump bar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingVertical: 8,
          paddingHorizontal: 8,
          gap: 4,
          backgroundColor: Colors.systemGroupedBackground,
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
                ? Colors.systemFill
                : Colors.tertiarySystemGroupedBackground,
              borderRadius: 8,
              borderCurve: "continuous",
            })}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: Colors.label,
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
        getItemLayout={getItemLayout}
        stickySectionHeadersEnabled
        onScrollToIndexFailed={onScrollToIndexFailed}
        contentContainerStyle={{
          paddingHorizontal: HORIZONTAL_PADDING - 4,
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
