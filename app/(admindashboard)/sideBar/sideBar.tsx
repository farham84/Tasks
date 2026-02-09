"use client";

import { VStack, Box, Text, Link as ChakraLink, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, Flex, HStack } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FaTachometerAlt, FaUsers, FaBoxOpen } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  isDrawerOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const navItems = [
  { label: "داشبورد", href: "/dashboard", icon: FaTachometerAlt },
  { label: "کاربران", href: "/dashboard/users", icon: FaUsers },
  { label: "محصولات", href: "/dashboard/products", icon: FaBoxOpen },
];

export default function DashboardSidebar({ isDrawerOpen, onClose, isMobile }: DashboardSidebarProps) {
  const pathname = usePathname();

  const renderNavItems = () =>
    navItems.map((item) => {
      const isActive = pathname === item.href;

      return (
        <ChakraLink
          as={Link}
          key={item.href}
          href={item.href}
          w="full"
          px={3}
          py={3}
          borderRadius="lg"
          bg={isActive ? "purple.600" : "transparent"}
          color={isActive ? "white" : "gray.700"}
          _hover={{
            bg: isActive ? "purple.700" : "purple.100",
            color: isActive ? "white" : "purple.700",
          }}
          transition="all 0.3s ease"
          onClick={onClose} // فقط برای موبایل Drawer
        >
          <HStack spacing={3}>
            <Box as={item.icon} size="20px" />
            <Text fontWeight={isActive ? "bold" : "medium"}>{item.label}</Text>
          </HStack>
        </ChakraLink>
      );
    });

  // موبایل
  if (isMobile) {
    return (
      <Drawer isOpen={isDrawerOpen} placement="left" onClose={onClose!}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton mt={4} />
          <Box p={6} bg="white" h="full">
            <VStack align="start" spacing={4} mt={10}>
              {renderNavItems()}
            </VStack>
          </Box>
        </DrawerContent>
      </Drawer>
    );
  }

  // دسکتاپ
  return (
    <Box
      w={64}
      bg="white"
      borderRightWidth="1px"
      shadow="xl"
      p={6}
      borderRadius="2xl"
      position="sticky"
      top={4}
      h="calc(100vh - 32px)"
    >
      <Text fontSize="3xl" fontWeight="bold" mb={8} bgGradient="linear(to-r, purple.500, pink.500)" bgClip="text">
        داشبورد
      </Text>
      <VStack align="start" spacing={3}>
        {renderNavItems()}
      </VStack>
    </Box>
  );
}
