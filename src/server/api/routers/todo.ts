import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { todoInput } from "../../../types";

export const todoRouter = createTRPCRouter({
    all: protectedProcedure.query(async ({ ctx }) => {
        const todos = await ctx.prisma.todo.findMany({
            where: {
                userId: ctx.session.user.id,
            },
        });

        console.log(
            "Todos from prisma",
            todos.map(({ id, text, done }) => ({ id, text, done }))
        );

        return [
            {
                id: "1",
                text: "dummy text",
                done: false,
            },
            {
                id: "2",
                text: "dummy text2",
                done: true,
            },
        ];
    }),

    create: protectedProcedure
        .input(todoInput)
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.todo.create({
                data: {
                    text: input,
                    done: false,
                    user: {
                        connect: {
                            id: ctx.session.user.id,
                        },
                    },
                }
            });
        }),

    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.todo.delete({
                where: {
                    id: input,
                }
            });
        }),

    toggle: protectedProcedure
        .input(
                z.object({
                id: z.string(),
                done: z.boolean(),
            })
        )
        .mutation(async ({ ctx, input:{id, done} }) => {
            return ctx.prisma.todo.update({
                where: {id},
                data: {done},
            });
        })
});