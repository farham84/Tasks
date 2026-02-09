"use client";

import { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Avatar,
  HStack,
  VStack,
  Spinner,
  Badge,
  Center,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  username: string;
  image: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("admin_token");
    if (!token) router.push("/login");
  }, [router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://dummyjson.com/users");
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" />
      </Box>
    );

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p="6">
      <Heading mb="6" textAlign="center">
        کاربران
      </Heading>

      {/* سرچ */}
      <Center mb="6">
        <Input
          placeholder="جستجوی کاربران..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW="400px"
        />
      </Center>

      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing={6}>
        {filteredUsers.map((user) => (
          <Box
            key={user.id}
            p="4"
            bg="white"
            borderRadius="md"
            shadow="md"
            _hover={{ shadow: "xl", transform: "scale(1.02)" }}
            transition="all 0.2s"
          >
            <HStack spacing={4} align="start" flexWrap="wrap">
              <Avatar
                name={`${user.firstName} ${user.lastName}`}
                src={user.image || ""}
                size="lg"
                flexShrink={0}
              />
              <VStack
                align="start"
                spacing={1}
                flex="1"
                minW={0}
                overflowWrap="break-word"
                wordBreak="break-word"
              >
                <Text fontWeight="bold" fontSize="lg">
                  {user.firstName} {user.lastName}
                </Text>
                <Text color="gray.600">@{user.username}</Text>
                <Text color="gray.600">{user.email}</Text>
                <Badge colorScheme="purple" whiteSpace="nowrap">
                  سن: {user.age}
                </Badge>
              </VStack>
            </HStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
