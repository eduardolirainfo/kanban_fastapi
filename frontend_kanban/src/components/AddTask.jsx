import React, { useState } from 'react';
import styled from 'styled-components';

const  Button = styled.button`
    background-color: #5aac44;
    border-radius: 3px;
    border: none;
    box-shadow: none;
    color: #fff;
    cursor: pointer;
    display: block;
    font-size: 14px;
    font-weight: 700;
    height: 40px;
    line-height: 40px;
    margin-bottom: 8px;
    text-align: center;
    transition: background-color .3s ease;
    width: 100%;
    &:hover {
        background-color: #519839;
    }
`;


function AddTask(props) {
    const [showNewTaskButton, setShowNewTaskButton] = useState(true);
    const [value, setValue] = useState("");

    function onNewTaskButtonClick() {
        setShowNewTaskButton(false);
    }

    function handleInputChange(event) {
        setValue(event.target.value);
    }

    function onNewTaskInputComplete() {
        setShowNewTaskButton(true);
        addNewTask(props.columnId, value);
        setValue("");
    }

    function addNewTask(columnId, content) {
        console.log(props.board);
        const newTaskId = 'task-'  + Date.now();
    
        const column = props.board.columns[columnId];
        const newTaskIds = Array.from(column.taskIds);
        newTaskIds.push(newTaskId);
 
        const newTask = {
            id: newTaskId,
            content: content,
        }
    
        props.setBoard({
            ...props.board,
            tasks: {
                ...props.board.tasks,
                [newTaskId]: newTask
            },
            columns: {
                ...props.board.columns,
                [columnId]: {
                    ...props.board.columns[columnId],
                    taskIds: newTaskIds
                }
            }
        });
    }

    return (
        <div>
            {
                showNewTaskButton ? (
                    <Button onClick={onNewTaskButtonClick}>+ Adicionar Tarefa</Button>
                ) : (
                    <div>
                        <input type="text" value={value} onChange={handleInputChange}  onBlur={onNewTaskInputComplete} />
                        {/* <Button onClick={onNewTaskInputComplete}>Add</Button> */}
                    </div>
                )
            }
        </div>
    )
}

export default AddTask;