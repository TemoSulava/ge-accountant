import { User } from "@prisma/client";

export type RequestUser = Omit<User, "passwordHash" | "refreshTokenHash">;
