import { User } from "@prisma/client";

type SafeUser = Omit<User, "passwordHash" | "refreshTokenHash">;

export interface AuthResult {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}
