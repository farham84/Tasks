'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Input,
  Select,
  Spinner,
  Badge,
  Center,
  Tag,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  genres: { id: number; name: string }[];
  platforms: { platform: { id: number; name: string } }[];
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');

  // API key خودت رو اینجا بزار
  const API_KEY = 'YOUR_RAWG_API_KEY';

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&page_size=50`
        );
        const data = await res.json();
        setGames(data.results);
        setFilteredGames(data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    let filtered = games;

    if (search) {
      filtered = filtered.filter((game) =>
        game.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedGenre) {
      filtered = filtered.filter((game) =>
        game.genres.some((g) => g.name === selectedGenre)
      );
    }
    if (selectedPlatform) {
      filtered = filtered.filter((game) =>
        game.platforms.some((p) => p.platform.name === selectedPlatform)
      );
    }

    setFilteredGames(filtered);
  }, [search, selectedGenre, selectedPlatform, games]);

  const allGenres = Array.from(
    new Set(games.flatMap((game) => game.genres.map((g) => g.name)))
  );
  const allPlatforms = Array.from(
    new Set(
      games.flatMap((game) => game.platforms.map((p) => p.platform.name))
    )
  );

  if (loading)
    return (
      <Center h="70vh">
        <Spinner size="xl" />
      </Center>
    );

  return (
    <Box p="6" bg="gray.900" minH="100vh" color="white">
      <Heading mb="6" textAlign="center">
        بازی‌ها
      </Heading>

      {/* فیلتر و جستجو */}
      <HStack spacing={4} flexWrap="wrap" justify="center" mb="6">
        <Input
          placeholder="جستجوی بازی..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW="300px"
          bg="gray.800"
          border="none"
          _focus={{ bg: 'gray.700' }}
        />

        <Select
          placeholder="ژانر"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          maxW="200px"
          bg="gray.800"
          border="none"
          _focus={{ bg: 'gray.700' }}
        >
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </Select>

        <Select
          placeholder="پلتفرم"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          maxW="200px"
          bg="gray.800"
          border="none"
          _focus={{ bg: 'gray.700' }}
        >
          {allPlatforms.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </Select>
      </HStack>

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing={6}
        mb="6"
      >
        {filteredGames.map((game) => (
          <Box
            key={game.id}
            bg="gray.800"
            borderRadius="lg"
            overflow="hidden"
            shadow="lg"
            _hover={{ transform: 'scale(1.03)', shadow: '2xl' }}
            transition="all 0.3s"
          >
            <Box h="200px" overflow="hidden">
              <Image
                src={game.background_image || '/placeholder.png'}
                alt={game.name}
                objectFit="cover"
                width="100%"
                height="100%"
                transition="all 0.3s"
                _hover={{ transform: 'scale(1.05)' }}
              />
            </Box>
            <VStack align="start" p="4" spacing={2}>
              <Heading size="md" noOfLines={1}>
                {game.name}
              </Heading>
              <Wrap>
                {game.genres.map((genre) => (
                  <WrapItem key={genre.id}>
                    <Badge colorScheme="purple">{genre.name}</Badge>
                  </WrapItem>
                ))}
              </Wrap>
              <HStack mt="2">
                <FaStar color="yellow" />
                <Text>{game.rating}</Text>
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {filteredGames.length === 0 && (
        <Center mt="10">
          <Text>هیچ بازی‌ای یافت نشد.</Text>
        </Center>
      )}
    </Box>
  );
}
