"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { Box, Heading } from "@chakra-ui/react";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("admin_token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <Box p="6">
      <Heading>Admin Dashboard</Heading>
    </Box>
  );
}
