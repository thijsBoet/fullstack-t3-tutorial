import { api } from "../utils/api";
import { Todo } from "./Todo";

export default function Todos() {
    const { data: todos, isLoading, isError } = api.todo.all.useQuery();

    if (isLoading) return <div>Loading Todo(s) ↻</div>;
    if (isError) return <div>Error fetching todo(s) ❌</div>;

    return (
        <>
            {todos.length > 0
                ? todos.map((todo) => <Todo key={todo.id} todo={todo} />)
                : "No todos yet 🤷‍♂️, create one!"}
        </>
    );
}
