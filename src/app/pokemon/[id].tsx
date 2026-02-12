import { useLocalSearchParams, Stack } from "expo-router";
import { useMemo } from "react";
import { View, Text, ScrollView, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/utils/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  generations,
  Pokemon,
  typeColors,
  getPokemonImageUrl,
} from "@/data/pokemon";

// Find Pokemon by ID across all generations
function findPokemonById(id: number): Pokemon | undefined {
  for (const gen of generations) {
    const pokemon = gen.pokemon.find((p) => p.id === id);
    if (pokemon) return pokemon;
  }
  return undefined;
}

// Get generation info for a Pokemon
function getGenerationForPokemon(id: number) {
  for (const gen of generations) {
    if (id >= gen.range[0] && id <= gen.range[1]) {
      return gen;
    }
  }
  return null;
}

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const pokemonId = parseInt(id || "1", 10);
  const pokemon = useMemo(() => findPokemonById(pokemonId), [pokemonId]);
  const generation = useMemo(
    () => getGenerationForPokemon(pokemonId),
    [pokemonId]
  );


  if (!pokemon) {
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
          Pokemon not found
        </Text>
      </View>
    );
  }

  const primaryType = pokemon.types[0];
  const typeColor = typeColors[primaryType] || "#A8A878";
  const imageSize = Math.min(width * 0.7, 300);

  return (
    <>
      <Stack.Screen
        options={{
          title: pokemon?.name || "Pokemon"
        }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.systemGroupedBackground }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Hero Section with gradient background */}
        <View
          style={{
            alignItems: "center",
            paddingTop: 20,
            paddingBottom: 30,
            experimental_backgroundImage: `linear-gradient(180deg, ${typeColor}40 0%, transparent 100%)`,
          }}
        >
          {/* Pokemon Number */}
          <Text
            selectable
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: Colors.tertiaryLabel,
              fontVariant: ["tabular-nums"],
              marginBottom: 8,
            }}
          >
            #{String(pokemon.id).padStart(4, "0")}
          </Text>

          {/* Pokemon Image */}
          <View
            style={{
              width: imageSize,
              height: imageSize,
              marginBottom: 16,
            }}
          >
            <Image
              source={{ uri: getPokemonImageUrl(pokemon.id) }}
              style={{ width: "100%", height: "100%" }}
              contentFit="contain"
              transition={300}
            />
          </View>

          {/* Pokemon Name */}
          <Text
            selectable
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: Colors.label,
              marginBottom: 12,
            }}
          >
            {pokemon.name}
          </Text>

          {/* Types */}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
            }}
          >
            {pokemon.types.map((type) => (
              <View
                key={type}
                style={{
                  backgroundColor: typeColors[type] || "#A8A878",
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 16,
                  borderCurve: "continuous",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
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

        {/* Info Cards */}
        <View style={{ paddingHorizontal: 16, gap: 16 }}>
          {/* Generation Info */}
          {generation && (
            <View
              style={{
                backgroundColor: Colors.secondarySystemGroupedBackground,
                borderRadius: 16,
                borderCurve: "continuous",
                padding: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: Colors.secondaryLabel,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 8,
                }}
              >
                Origin
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "600",
                  color: Colors.label,
                  marginBottom: 4,
                }}
              >
                {generation.name}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.secondaryLabel,
                }}
              >
                {generation.region} Region
              </Text>
            </View>
          )}

          {/* Type Effectiveness Preview */}
          <View
            style={{
              backgroundColor: Colors.secondarySystemGroupedBackground,
              borderRadius: 16,
              borderCurve: "continuous",
              padding: 16,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: Colors.secondaryLabel,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 12,
              }}
            >
              Type Info
            </Text>
            <View style={{ gap: 8 }}>
              {pokemon.types.map((type) => (
                <View
                  key={type}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: typeColors[type] || "#A8A878",
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: Colors.label,
                      textTransform: "capitalize",
                      flex: 1,
                    }}
                  >
                    {type}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Pokedex Entry Placeholder */}
          <View
            style={{
              backgroundColor: Colors.secondarySystemGroupedBackground,
              borderRadius: 16,
              borderCurve: "continuous",
              padding: 16,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: Colors.secondaryLabel,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 8,
              }}
            >
              National Dex Number
            </Text>
            <Text
              selectable
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: Colors.label,
                fontVariant: ["tabular-nums"],
              }}
            >
              {pokemon.id}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
