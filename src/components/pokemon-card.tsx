import { Image } from "expo-image";
import { Link } from "expo-router";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import AC from "@bacons/apple-colors";
import { Pokemon, typeColors, getPokemonSpriteUrl } from "@/data/pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
}

function PokemonCardComponent({ pokemon }: PokemonCardProps) {
  const primaryType = pokemon.types[0];
  const typeColor = typeColors[primaryType] || "#A8A878";

  return (
    <Link href={`/pokemon/${pokemon.id}`} asChild>
      <Link.Trigger>
        <Pressable
          style={({ pressed }) => ({
            flex: 1,
            backgroundColor: AC.secondarySystemGroupedBackground,
            borderRadius: 16,
            borderCurve: "continuous",
            padding: 12,
            opacity: pressed ? 0.8 : 1,
            minWidth: 100,
            maxWidth: "100%",
          })}
        >
          <View
            style={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <Text
              selectable
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: AC.tertiaryLabel,
                fontVariant: ["tabular-nums"],
              }}
            >
              #{String(pokemon.id).padStart(4, "0")}
            </Text>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              aspectRatio: 1,
              marginBottom: 8,
            }}
          >
            <Image
              source={{ uri: getPokemonSpriteUrl(pokemon.id) }}
              style={{ width: "100%", height: "100%" }}
              contentFit="contain"
              recyclingKey={`pokemon-${pokemon.id}`}
              transition={200}
            />
          </View>

          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: AC.label,
              textAlign: "center",
              marginBottom: 6,
            }}
          >
            {pokemon.name}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            {pokemon.types.map((type) => (
              <View
                key={type}
                style={{
                  backgroundColor: typeColors[type] || "#A8A878",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 10,
                  borderCurve: "continuous",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
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

export const PokemonCard = memo(PokemonCardComponent);
