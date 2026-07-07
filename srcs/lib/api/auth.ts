import type { LoginFormData, RegisterFormData } from "@/types/auth";

export async function loginUser(formData: LoginFormData) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Login failed.");
  }

  return response.json();
}

export async function registerUser(formData: RegisterFormData) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    }),
  });

  if (!response.ok) {
    throw new Error("Registration failed.");
  }

  return response.json();
}
