import React from "react";
import styled from "styled-components";
import Task from "./Task";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddTask from "./AddTask";


const Container = styled.div`
    display: flex;
    padding: 20px;
    background-color: #f0f0f0;
    overflow-x: auto; /* Adicione rolagem horizontal se as colunas excederem a largura da tela */
    white-space: nowrap; /* Impede que as colunas quebrem em várias linhas */
    max-width:  100vw; /* Impede que as colunas excedam a largura da tela */
`;

const ColumnWrapper = styled.div`
    flex: 1;
    min-width: 250px;
    margin: 0 10px;
    background-color: #e8e8e8;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    max-width:  300px; /* Impede que as colunas excedam a largura da tela */
`;

const ColumnInner =  styled.div`
    padding: 10px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: ${props => (props.isDraggingOver ? '#bfe9ff' : '#ffffff')};
`;


const Title = styled.h3`
    font-size: 20px;
    font-weight: bold;
    margin: 0;
    padding: 10px;
    background-color: #d1d1d1;
    border-radius: 5px 5px 0 0;
    text-align: center; /* Centraliza o título */
 
`;

const TaskList = styled.div`
    transition: background-color 0.2s ease;
    min-height: 100px;
    padding: 10px;
    background-color: ${props => (props.isDraggingOver ? '#bfe9ff' : '#ffffff')};
    text-wrap: pretty;
`;

 

function Column(props) {
    return (
        <Draggable draggableId={props.column.id} index={props.index}>
            
                {provided =>(
                    <Container {...provided.draggableProps} ref={provided.innerRef}>
                        <ColumnWrapper>
                        <ColumnInner>
                        <Title {...provided.dragHandleProps}>{props.column.title}</Title>
                        <Droppable droppableId={props.column.id} type="task">
                        {provided =>(
                            <TaskList {...provided.droppableProps} ref={provided.innerRef}>
                                {props.tasks.map((task, index) => (
                                    (<Task key={task.id} task={task} index={index}  columnId={props.column.id} />)
                                ))}
                                {provided.placeholder} 
                                <AddTask  columnId={props.column.id} board={props.board} setBoard={props.setBoard} />
                            </TaskList>
                        )}
                        </Droppable>
                        </ColumnInner>
                     </ColumnWrapper>
                    </Container>
                )}
        </Draggable>
    );
}

export default Column;