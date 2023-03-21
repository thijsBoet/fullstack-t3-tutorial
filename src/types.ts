import { z } from "zod";

export const todoInput = z
    .string({
        required_error: "Todo text is required",
    })
    .min(1)
    .max(50);
