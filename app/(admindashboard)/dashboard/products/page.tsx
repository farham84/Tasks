"use client";

import { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Image,
  Heading,
  Text,
  Spinner,
  Badge,
  VStack,
  AspectRatio,
  HStack,
  Input,
  Button,
  Wrap,
  WrapItem,
  Center,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  thumbnail: string;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("admin_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products");
        const data = await res.json();
        
        const productsList: Product[] = data.products || [];
        setProducts(productsList);

        // اصلاح اصلی در این قسمت انجام شده است:
        // با استفاده از <string> به تایپ‌اسکریپت می‌گوییم خروجی حتما آرایه‌ای از رشته‌هاست
        const uniqueCategories = Array.from(
          new Set(productsList.map((p: Product) => p.category))
        ) as string[];
        
        setCategories(uniqueCategories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" />
      </Box>
    );

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box p={{ base: 4, md: 6 }} textAlign="right">
      <Heading mb={6} textAlign="center" bgGradient="linear(to-r, purple.500, pink.500)" bgClip="text">
        محصولات
      </Heading>

      {/* سرچ وسط */}
      <Center mb={6}>
        <Input
          placeholder="جستجوی محصولات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW={{ base: "100%", md: "400px" }}
          size="md"
          variant="filled"
          bg="gray.100"
          _hover={{ bg: "gray.200" }}
        />
      </Center>

      {/* دسته‌بندی‌ها */}
      <Center mb={6}>
        <Wrap spacing={3} justify="center">
          <WrapItem>
            <Button
              size="sm"
              variant={selectedCategory === "" ? "solid" : "outline"}
              onClick={() => setSelectedCategory("")}
              rightIcon={<ChevronRightIcon />}
              bgGradient={selectedCategory === "" ? "linear(to-r, purple.500, pink.500)" : undefined}
              color={selectedCategory === "" ? "white" : "gray.700"}
              _hover={{ bgGradient: "linear(to-r, purple.600, pink.600)", color: "white" }}
            >
              همه
            </Button>
          </WrapItem>
          {categories.map((cat) => (
            <WrapItem key={cat}>
              <Button
                size="sm"
                variant={selectedCategory === cat ? "solid" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                rightIcon={<ChevronRightIcon />}
                bgGradient={selectedCategory === cat ? "linear(to-r, purple.500, pink.500)" : undefined}
                color={selectedCategory === cat ? "white" : "gray.700"}
                _hover={{ bgGradient: "linear(to-r, purple.600, pink.600)", color: "white" }}
              >
                {cat}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      </Center>

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing={{ base: 4, md: 6 }}
      >
        {filteredProducts.map((product) => {
          const discountedPrice = product.discountPercentage
            ? (product.price * (100 - product.discountPercentage)) / 100
            : product.price;

          return (
            <Box
              key={product.id}
              bg="white"
              borderRadius="2xl"
              overflow="hidden"
              shadow="lg"
              _hover={{ shadow: "2xl", transform: "scale(1.03)" }}
              transition="all 0.3s"
            >
              <AspectRatio ratio={1}>
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  objectFit="cover"
                  width="100%"
                  height="100%"
                  transition="transform 0.3s"
                  _hover={{ transform: "scale(1.05)" }}
                />
              </AspectRatio>

              <VStack align="start" spacing={2} p={4}>
                <Heading size="sm" noOfLines={1} fontWeight="bold">
                  {product.title}
                </Heading>
                <Text color="gray.600" fontSize="sm" noOfLines={2}>
                  {product.description}
                </Text>

                <HStack spacing={2}>
                  {product.discountPercentage ? (
                    <>
                      <Text
                        color="gray.400"
                        textDecoration="line-through"
                        fontSize="sm"
                      >
                        ${product.price.toFixed(2)}
                      </Text>
                      <Text fontWeight="bold" color="purple.600" fontSize="md">
                        ${discountedPrice.toFixed(2)}
                      </Text>
                    </>
                  ) : (
                    <Text fontWeight="bold" color="purple.600" fontSize="md">
                      ${product.price.toFixed(2)}
                    </Text>
                  )}
                </HStack>

                {product.discountPercentage && (
                  <Badge
                    colorScheme="green"
                    fontSize="0.8em"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    {product.discountPercentage}% تخفیف
                  </Badge>
                )}
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}