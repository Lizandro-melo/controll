import { PrismaClient as AuthClient } from "@prisma/auth";
import { PrismaClient as LogicClient } from "@prisma/logic";

export const Prisma_auth = new AuthClient();
export const Prisma_logic = new LogicClient();
