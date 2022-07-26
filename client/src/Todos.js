import loadingicon from "./assets/loading.gif";

function Todos({ todos, todo, setTodo, addTodo, completeTodo, deleteTodo }) {
    return (
        <div id="todos">
            <div>
                <div className="form-group">
                    <label htmlFor="todo"><h4 style={{ opacity: 0.5, margin: "0.5rem 0rem" }}>Enter Todo</h4></label>
                    <textarea className={`form-control ${todo.length === "" ? "is-invalid" : ""}`} name="todo" value={todo} onInput={function (e) {
                        e.target.style.height = "";
                        e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
                        setTodo(e.target.value);
                    }}></textarea>
                </div>
                <button onClick={addTodo} className="btn btn-primary btn-block">Add Todo</button>
            </div>
            <h4 style={{ opacity: 0.5, margin: "1rem 0rem" }}>Todos</h4>
            {
                !todos ?
                    <div className="loader">
                        <img src={loadingicon} alt="loader-icon" />
                    </div> :
                    <table className="table">
                        <tbody>
                            {
                                todos.map(todo =>
                                    <tr key={todo._id}>
                                        <td>
                                            <input type="checkbox" style={{ marginRight: "0.5rem", width: "16px", height: "16px" }} checked={todo.complete} onChange={() => completeTodo(todo)}></input>
                                        </td>
                                        <td style={{ width: "100%", textDecoration: todo.complete ? "line-through" : "" }}><pre>{todo.text}</pre></td>
                                        <td className="delete" onClick={() => deleteTodo(todo)}><img src="https://img.icons8.com/plasticine/100/000000/filled-trash.png" alt="delete-icon" width={"28px"} /></td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
            }
        </div>
    )
}

export default Todos;