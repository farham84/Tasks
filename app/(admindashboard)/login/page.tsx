"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Heading, Input } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { setCookie } from "cookies-next";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();

      //  ذخیره توکن در کوکی
      setCookie("admin_token", data.token, {
        maxAge: 60 * 60 * 24, // 1 day
      });

      router.push("/dashboard");
    } catch (error) {
      alert("نام کاربری یا رمز عبور اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <h1 style={{ textAlign: "center", marginTop: "2rem", marginBottom: "1rem" }}>
     username: emilys / password: emilyspass
    </h1>

    <Box maxW="sm" mx="auto" mt="20" p="6" borderWidth="1px" borderRadius="md">
      <Heading mb="6" textAlign="center">
        Admin Login
      </Heading>

      <FormControl mb="4">
        <FormLabel>Username</FormLabel>
        <Input
          placeholder="emilys"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          placeholder="emilyspass"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        w="full"
        isLoading={loading}
        onClick={handleLogin}
      >
        Sign In
      </Button>
    </Box>
    </>
  );
  
}
