import { z } from "zod";
import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./server/api/root";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type allTodosOutput = RouterOutputs["todo"]["all"];

export type Todo = allTodosOutput[number];

export const todoInput = z
    .string({
        required_error: "Todo text is required",
    })
    .min(1)
    .max(50);
