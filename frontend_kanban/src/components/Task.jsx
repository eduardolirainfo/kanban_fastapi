import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const TaskContainer = styled.div`
    padding: 10px;
    background-color: #e8e8e8;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 10px 0;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    word-wrap: break-word;
    &:hover {
        background-color: #d1d1d1;
        transform: scale(1.05);
    }
`;

// const Title = styled.h4`
//     font-size: 16px;
//     font-weight: bold;
//     margin: 0;
//     padding: 5px;
//     color: #333;
//     text-align: center;
// `;

function Task(props){
    return (
        <Draggable draggableId={props.task.id} index={props.index}>
            {provided =>(
                <TaskContainer {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    {props.task.content}
                    {provided.placeholder}
                </TaskContainer>
            )}
        </Draggable>
    );
}

export default Task;