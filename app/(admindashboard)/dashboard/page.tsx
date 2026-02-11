"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Heading,
  Badge,
  Flex,
  Text,
} from "@chakra-ui/react";
import { FaUsers, FaBoxOpen, FaTags, FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage?: number;
}

const visitData = [
  { day: "شنبه", visits: 120 },
  { day: "یک‌شنبه", visits: 200 },
  { day: "دوشنبه", visits: 150 },
  { day: "سه‌شنبه", visits: 300 },
  { day: "چهارشنبه", visits: 250 },
  { day: "پنج‌شنبه", visits: 400 },
  { day: "جمعه", visits: 350 },
];

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("admin_token");
    if (!token) router.replace("/login");
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          fetch("https://dummyjson.com/users"),
          fetch("https://dummyjson.com/products"),
        ]);

        const usersData = await usersRes.json();
        const productsData = await productsRes.json();

        setUsers(usersData.users || []);
        setProducts(productsData.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <Flex justify="center" align="center" minH="70vh">
        <Spinner size="xl" />
      </Flex>
    );

  const discountedProducts = products.filter((p) => p.discountPercentage);
  const latestProducts = products.slice(-5).reverse();

  return (
    <Box p={{ base: 4, md: 6 }}>
      {/* عنوان داشبورد */}
      <Heading
        mb={8}
        textAlign="center"
        bgGradient="linear(to-r, purple.500, pink.500)"
        bgClip="text"
      >
        داشبورد ادمین
      </Heading>

      {/* کارت‌های وضعیت */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
        {[
          {
            label: "کاربران",
            value: users.length,
            icon: FaUsers,
            color: "purple.50",
          },
          {
            label: "محصولات",
            value: products.length,
            icon: FaBoxOpen,
            color: "blue.50",
          },
          {
            label: "محصولات تخفیف‌دار",
            value: discountedProducts.length,
            icon: FaTags,
            color: "green.50",
          },
          {
            label: "محصولات جدید",
            value: latestProducts.length,
            icon: FaRocket,
            color: "pink.50",
          },
        ].map((stat, idx) => (
          /* @ts-ignore */
          <motion.div
            key={idx}
            {...({
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: idx * 0.2 }
            } as any)}
          >
            <Stat
              px={4}
              py={5}
              borderRadius="2xl"
              shadow="lg"
              bg={stat.color}
              _hover={{ shadow: "2xl", transform: "scale(1.03)" }}
              transition="all 0.3s"
            >
              <StatLabel display="flex" alignItems="center" fontWeight="bold">
                <Icon as={stat.icon} mr={2} color="gray.600" />
                {stat.label}
              </StatLabel>
              <StatNumber fontSize={{ base: "2xl", md: "3xl" }}>
                {stat.value}
              </StatNumber>
              <StatHelpText color="gray.500">
                تعداد کل {stat.label.toLowerCase()} ثبت شده
              </StatHelpText>
            </Stat>
          </motion.div>
        ))}
      </SimpleGrid>

      {/* نمودار بازدید سایت */}
      <Box
        mb={8}
        p={4}
        shadow="lg"
        borderRadius="2xl"
        bg="white"
        overflow="hidden"
      >
        <Heading size="md" mb={4} fontWeight="bold">
          نمودار بازدید سایت (هفتگی)
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={visitData}
            margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="#718096" />
            <YAxis stroke="#718096" />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "none" }}
              labelStyle={{ color: "#4A5568" }}
            />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#805AD5"
              strokeWidth={4}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* آخرین محصولات */}
      <Box mb={8}>
        <Heading
          size="md"
          mb={4}
          fontWeight="bold"
          bgGradient="linear(to-r, pink.500, purple.500)"
          bgClip="text"
        >
          آخرین محصولات اضافه شده
        </Heading>
        <Table
          variant="simple"
          shadow="lg"
          borderRadius="2xl"
          overflow="hidden"
          size={{ base: "sm", md: "md" }}
        >
          <Thead bg="gray.100">
            <Tr>
              <Th>عنوان</Th>
              <Th>قیمت</Th>
              <Th>تخفیف</Th>
            </Tr>
          </Thead>
          <Tbody>
            {latestProducts.map((product) => {
              const discountedPrice = product.discountPercentage
                ? (product.price * (100 - product.discountPercentage)) / 100
                : product.price;
              return (
                <Tr
                  key={product.id}
                  _hover={{ bg: "gray.50", cursor: "pointer" }}
                  transition="all 0.2s"
                >
                  <Td fontWeight="bold">{product.title}</Td>
                  <Td>
                    {product.discountPercentage ? (
                      <>
                        <Text as="span" color="gray.400" textDecoration="line-through">
                          ${product.price.toFixed(2)}
                        </Text>{" "}
                        <Text as="span" color="purple.600" fontWeight="bold">
                          ${discountedPrice.toFixed(2)}
                        </Text>
                      </>
                    ) : (
                      <Text color="purple.600" fontWeight="bold">
                        ${product.price.toFixed(2)}
                      </Text>
                    )}
                  </Td>
                  <Td>
                    {product.discountPercentage ? (
                      <Badge colorScheme="green" borderRadius="full">
                        {product.discountPercentage}% OFF
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>

      {/* کارت محصولات تخفیف‌دار */}
      {discountedProducts.length > 0 && (
        <Box>
          <Heading
            size="md"
            mb={4}
            fontWeight="bold"
            bgGradient="linear(to-r, green.500, teal.500)"
            bgClip="text"
          >
            محصولات تخفیف‌دار
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {discountedProducts.map((product) => (
              <Box
                key={product.id}
                bg="white"
                borderRadius="2xl"
                shadow="lg"
                p={4}
                _hover={{ shadow: "2xl", transform: "scale(1.03)" }}
                transition="all 0.3s"
              >
                <Heading size="sm" mb={2} noOfLines={1}>
                  {product.title}
                </Heading>
                <Text color="gray.600" fontSize="sm" noOfLines={2}>
                  قیمت:{" "}
                  <Text as="span" fontWeight="bold" color="purple.600">
                    ${(
                      product.price *
                      (1 - (product.discountPercentage || 0) / 100)
                    ).toFixed(2)}
                  </Text>
                </Text>
                <Badge colorScheme="green" mt={2} borderRadius="full">
                  {product.discountPercentage}% تخفیف
                </Badge>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
}