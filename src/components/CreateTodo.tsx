import { useState } from "react";
import { api } from "../utils/api";
import { todoInput } from "../types";
import { toast } from "react-hot-toast";

export default function CreateTodo() {
    const [newTodo, setNewTodo] = useState("");

    const trcp = api.useContext();

    const { mutate } = api.todo.create.useMutation({
        onMutate: async (newTodo) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await trcp.todo.all.cancel();

            // Snapshot the previous value
            const previousTodos = trcp.todo.all.getData();

            // Optimistically update to the new value
            trcp.todo.all.setData(undefined, (prev) => {
                const optimisticTodos = {
                    id: "optimistic-todo-id",
                    text: newTodo,
                    done: false,
                };
                if (!prev) return [optimisticTodos];
                return [...prev, optimisticTodos];
            });

            setNewTodo("");

            return { previousTodos };
        },
        onError: (err, newTodo, context) => {
            toast.error("An error occures when creating a todo");
            setNewTodo(newTodo)
            trcp.todo.all.setData(undefined, () => context?.previousTodos);
        },
        onSettled: async () => {
            await trcp.todo.all.invalidate();
        },
    });

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    const result = todoInput.safeParse(newTodo);

                    if (!result.success) {
                        toast.error(result.error.format()._errors.join("\n"));
                        return;
                    }

                    mutate(newTodo);
                }}
                className="flex gap-2"
            >
                <input
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="New Todo..."
                    type="text"
                    name="new-todo"
                    id="new-todo"
                    value={newTodo}
                    onChange={(e) => {
                        setNewTodo(e.target.value);
                    }}
                />
                <button className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
                    Create
                </button>
            </form>
        </div>
    );
}
