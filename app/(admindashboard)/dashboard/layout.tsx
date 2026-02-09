"use client";

import { ReactNode } from "react";
import { Box, Flex, IconButton, useDisclosure } from "@chakra-ui/react";

import { HamburgerIcon } from "@chakra-ui/icons";
import DashboardSidebar from "../sideBar/sideBar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar Desktop */}
      <Box display={{ base: "none", md: "block" }}>
        <DashboardSidebar />
      </Box>

      {/* Main content */}
      <Box flex="1" minH="100vh" p={{ base: 4, md: 6 }}>
        {/* Mobile Hamburger */}
        <Flex
          display={{ base: "flex", md: "none" }}
          justify="flex-start"
          align="center"
          mb={4}
        >
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            onClick={onOpen}
          />
        </Flex>

        {/* Content */}
        {children}

        {/* Mobile Sidebar Drawer */}
        <DashboardSidebar isDrawerOpen={isOpen} onClose={onClose} isMobile />
      </Box>
    </Flex>
  );
}
