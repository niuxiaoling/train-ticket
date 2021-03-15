import React, { useRef, useState, useEffect, memo } from 'react'
import {createAdd, createRemove,createToggle, createSet} from './actionCreator'
import './index.css'
let idSeq = Date.now()
/**
 * {
 *  addtodo: (...args) => dispatch(createAdd(...args))
 * }
 */
function bindActionCreators (actionCreators, dispatch) {
  const ret = {}
  for (let key in actionCreators){
    ret[key] = function(...args) {
      const actionCreator = actionCreators[key]
      const action = actionCreator(...args)
      dispatch(action)
    }
  }
  return ret
}
// 待办区
const Control = memo(function Control (props) {
  const { addTodo } = props
  const inputRef = useRef()
  const onSubmit = (e) => {
    e.preventDefault()
    const newText = inputRef.current.value.trim()
    if(newText.length === 0){ return }
    addTodo({
      id: ++ idSeq,
      text:newText,
      complete:false
    })
    inputRef.current.value = ''
  }
  return (
    <div className="control">
      <h1>TodoList</h1>
      <form onSubmit={onSubmit}>
        <label></label>
        <input placeholder="What needs to be done?" className="new-todo" ref={inputRef}/>
      </form>
    </div>
  )
})
// 单个列表模块
const TodoItem = memo(function TodoItem (props) {
  const { todo: {id,complete,text}, removeTodo, toggleTodo} = props
  const onChange = ()=> {
    toggleTodo(id)
  }
  const onClick = () => {
    removeTodo(id)
  }
  return (
    <li className="todo-item">
      <input 
        type="checkbox"
        onChange={onChange}
        checked={complete}
      />
      <label className={complete?'complete': ''}>{text}</label>
      <button onClick={onClick}>&#xd7;</button>
    </li>
  )
})
// 列表区
const Todos = memo(function Todos (props) {
  const {todos, toggleTodo, removeTodo} = props
  return (
    <ul>
      { todos.map(todo => {
        return <TodoItem todo={todo} toggleTodo={toggleTodo} removeTodo={removeTodo} key={todo.id}/>
      })}
    </ul>
  )
})
const TO_KEY = '$_todos_'

function Todolist () {
  const [todos, setTodos] = useState([])

  const dispatch = (action) => {
    const { type, payload } = action
    switch(type){
      case 'add':
        setTodos(todos => [...todos, payload])
        break
      case 'remove':
        setTodos(todos => todos.filter(todo => todo.id !== payload))
        break
      case 'toggle':
        setTodos(todos => todos.map(todo => {
          return todo.id ===  payload ? {...todo, complete: !todo.complete}: todo
        }))
        break
      case 'set':
        setTodos(payload)
        break
      default:
    }
  }
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem(TO_KEY))
    dispatch(createSet(todos))
  }, []);

  useEffect(() => {
    localStorage.setItem(TO_KEY, JSON.stringify(todos))
  }, [todos]);
  
  return(
    <div className="todo-list">
      <Control 
      {
        ...bindActionCreators({
          addTodo: createAdd
        }, dispatch)
      }/>
      <Todos 
      {
        ...bindActionCreators({
          removeTodo: createRemove,
          toggleTodo: createToggle
        }, dispatch)
      }
      todos={todos}/>
    </div>
  )
}


export default Todolist