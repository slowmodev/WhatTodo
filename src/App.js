import React, { useState, useEffect } from 'react'
import {nanoid} from 'nanoid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BsCircle, BsSunFill, BsFillCheckCircleFill} from 'react-icons/bs'
import { IoMoonSharp, IoRemoveOutline } from 'react-icons/io5'


import './App.css'

const App = () => {

    //getting darkmode state from local storage
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem('darkMode') === 'true' ? true : false
    )

    // a state set for what is being inputed in the input box
    const [inputValue, setInputValue] = useState('')

    // Array that holds the data inputed in the input box
    const [dataArray, setDataArray] = useState([])

    // A state set for a temp array that holds values that meet a certain criteria at a time
    const [filteredItems, setFilteredItems] = useState(null)

    // Saving states in local storage 
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode)
    }, [darkMode])



    // Saving and getting the state of dataArray from local storage
    useEffect(() => {
        const storedData = localStorage.getItem('todos')
        if (storedData) {
            setDataArray(JSON.parse(storedData))
        }
    }, [])
        
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(dataArray))
    }, [dataArray])



    function Theme() {
        setDarkMode(prevDarkMode => !prevDarkMode)
    }


    // function to handle the inputs on the press of 'enter'
    // it checks if the key being pressed is enter, if it is, it sets the value (event and value) to the inputValue state
    // create a new variable that is an object, give the values unique ids using nanoid()
    // set the state of dataArray, using an array spread function then add the newData
    // set state of inputValue back to an empty string
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            const newData = { id: nanoid(), value: inputValue }
            setDataArray([...dataArray, newData])
            setInputValue('')
        }
    }


    // function that handles delete of a dataArray item
    // it receives a variable 'id'
    // create a new variable that uses a filter function to return a new list that those not include the item with the id that was deleted
    // set the new state of dataArray to that variable

    // We check if there's something in the filtered array, if there is, we repeat the same process
    const handleDelete = (id) => {
        const newDataArray = dataArray.filter((item) => item.id !== id)
        setDataArray(newDataArray)
    
        if (filteredItems) {
            const newFilteredItems = filteredItems.filter((item) => item.id !== id)
            setFilteredItems(newFilteredItems)
        }
    };


    // function to toggle between completed and not completed
    function handleCompleted(id) {
        const updatedDataArray = dataArray.map(item => {
          if (item.id === id) {
            return {
              ...item,
              completed: !item.completed
            }
          } else {
            return item
          }
        })
      
        setDataArray(updatedDataArray)
      
        if (filteredItems) {
          const updatedFilteredItems = filteredItems.map(item => {
            if (item.id === id) {
              return {
                ...item,
                completed: !item.completed
              }
            } else {
              return item
            }
          });
          
          setFilteredItems(updatedFilteredItems)
        }
    }


    // function to set the state of filtered items based on if completed is true
    function handleFilteredCompleted() {
        const filteredCompleted = dataArray.filter(item => item.completed)
        setFilteredItems(filteredCompleted)
    }

    // function to set state of filtered items based on if completed is false
    function handleFilteredActive() {
        const filteredActive = dataArray.filter(item => !item.completed)
        setFilteredItems(filteredActive)
    }

    // funcion to showall items
    const handleShowAll = () => {
        setFilteredItems(null)
    }

    // function to clear items with completed set to true on click
    function handleClearCompleted() {
        const clearCompleted = dataArray.filter(item => !item.completed)
        setDataArray(clearCompleted)
        setFilteredItems(clearCompleted)
    }

    // beautiful dnd
    function handleOnDragEnd(result){
        if (!result.destination) return;

            const items = Array.from(filteredItems ?? dataArray);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

        if (filteredItems) {
            setFilteredItems(items);
        } else {
            setDataArray(items);
        }
    };

    
    // conditional styling for if completed is set to true
    const style = {
        textDecoration: 'line-through'
    }


    return (
        <div className={darkMode ? "dark": ''}>
            <div className='bg-image'>
                <div className='container'>
                    <div className='header'>
                        <h1>TODO</h1>
                        {darkMode ? <IoMoonSharp onClick={Theme} className="icons"  size={26}/> : <BsSunFill onClick={Theme} className="icons" size={26} />}
                    </div>
                    <div  className='input-container'>
                        <input 
                            type='text'
                            className='new-todo'
                            placeholder='Create a new todo...'
                            value={inputValue}
                            onChange={(event) => setInputValue(event.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <BsCircle className='circle' size={20}/>
                    </div>
                    {dataArray.length > 0 && <div className='todos-container'>
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId='todos'>
                                {(provided) => (
                                    <div className='todos' {...provided.droppableProps} ref={provided.innerRef}>
                                    {filteredItems !== null ? 
                                        filteredItems.map((data, index) => (
                                            <Draggable key={data.id} draggableId={data.id} index={index}>
                                                {(provided) => (
                                                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                        <div className='todos-list' style={data.completed ? style : null} >
                                                            {data.completed ? 
                                                                <BsFillCheckCircleFill size={22} className='icons completed' onClick={()=> handleCompleted(data.id)} /> 
                                                                : <BsCircle size={22} className="icons"onClick={()=> handleCompleted(data.id)} />}
                                                            <p className="content">{data.value}</p>
                                                            <IoRemoveOutline size={26} className="remove" onMouseDown={()=> handleDelete(data.id)} />
                                                        </div>
                                                        <hr />
                                                    </div>
                                                )}
                                            </Draggable>
                                        )) :
                                        dataArray.map((data, index) => (
                                            <Draggable key={data.id} draggableId={data.id} index={index}>
                                                {(provided) => (
                                                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                        <div className='todos-list' style={data.completed ? style : null} >
                                                            {data.completed ? 
                                                                <BsFillCheckCircleFill size={22} className='icons completed' onClick={()=> handleCompleted(data.id)} /> 
                                                                : <BsCircle size={22} className="icons"onClick={()=> handleCompleted(data.id)} />}
                                                            <p className="content">{data.value}</p>
                                                            <IoRemoveOutline size={26} className="remove" onMouseDown={()=> handleDelete(data.id)} />
                                                        </div>
                                                        <hr />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    }
                                    {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <div className='todo-state'>
                            <p className='remaining'>{dataArray.length} {dataArray.length > 1 ? 'items': 'item'} left</p>
                            <div className='states'>
                                <p className="state" onClick={handleShowAll}>All</p>
                                <p className="state" onClick={handleFilteredActive}>Active</p>
                                <p className="state" onClick={handleFilteredCompleted}>Completed</p>
                            </div>
                            <p className="clear" onClick={handleClearCompleted}>Clear completed</p>
                        </div>
                    </div>}
                    {dataArray.length > 0 && <div className='states-mobile'>
                        <p className="state" onClick={handleShowAll}>All</p>
                        <p className="state" onClick={handleFilteredActive}>Active</p>
                        <p className="state" onClick={handleFilteredCompleted}>Completed</p>
                    </div>}
                    {dataArray.length > 0 && <p className="reorder">Drag and drop to reorder list</p>}
                </div>  
            </div>
        </div>
    )
}

export default App