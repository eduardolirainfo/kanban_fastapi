import React, {useEffect, useState, useRef} from "react";
import styled from "styled-components";
import Task from "./Task";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddTask from "./AddTask";
import toast from 'react-hot-toast';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Container = styled.div`
    display: flex;
    overflow-x: auto;  
    white-space: nowrap;  
    max-width:  100vw; 
    min-width:  343px;
  
`;

const ColumnWrapper = styled.div`
    box-sizing: border-box;
    box-shadow: 0 2px 5px rgba(0,0,0,.3);
    border-radius: 4px;
    overflow: hidden; 
    display: inline-block;
    vertical-align: top;
    margin: 36px 0 0 36px;
    &:first-child {
        margin-left: 0;
    }
    &:hover {
        box-shadow: 0 2px 5px rgba(0,0,0,.5);
    }

 
    background-color: var(--bg-card);
    border-radius: 12px;
    box-shadow:  0px 1px 1px #091e4240; 
    display: flex;
    justify-content: space-between;
    max-height: 100%;
    flex-direction: column;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 343px;
    align-self: start;
    padding-bottom: 8px;
    position: relative;
    white-space: normal;
    width: 343px;
    box-sizing: border-box;
    vertical-align: top;
    scroll-margin: 8px;
 

`;

const ColumnInner =  styled.div`
    padding: 10px;   
    border-radius: 5px; 
`;

const ColumnHeader = styled.div`
     margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor:move !important;
`;

const ColmunTitle = styled.h2`   
    padding: 0 12px;
    overflow: hidden;
    overflow-wrap: anywhere;
    white-space: normal;
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    color: var(--dark-blue);
`;

const ColmunOptions  = styled.span`
  background: transparent;
  color: var(--light-grey);
  font-size: 18px;
  border: 0;
  cursor: pointer;
  position: relative; 
  svg {
    fill:  rgba(0, 0, 0, 0.3);
    padding: 4px 0px;
    &:hover{
        fill: rgba(111, 111, 111, 0.3)
    }
  }
`;


const TaskList = styled.div`
    transition: background-color 0.2s ease;
    min-height: 100px;
    padding: 10px; 

`;

 

const DeleteButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  float: right;
  svg {
    fill: red;
    padding: 4px 0px;
    display: flex;
  }
  &:hover {
    background: rgba(255, 0, 0, 0.2);
    border-radius: 23px;
    svg {
      fill: red;
    }
  }
`;

const CloseToastButton = styled.button`
  background-color: white;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  padding: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  color: rgb(107 114 128);
  &:hover {
    background-color: #f9fafb;
  }
`;
const ActionToastButton = styled.button`
  background-color: white;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  color: rgb(107 114 128);

  &:hover {
    background-color: #f9fafb;
  }
`;

const ToastText = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(17 24 39 );
`;

const ActionsToastWrapper = styled.div`
  margin-top: 0.25rem;
  display: flex;
  justify-content: space-between;
`;
 
const ToastWrapper = styled.div`
  padding: 0.5rem;
`;
 

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
  </svg>
  );

  const OptionsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
  );
 
 

function Column(props) {
  const [isOptionButtonVisible, setOptionButtonVisibility] = useState(true);
  const [isDeleteButtonVisible, setDeleteButtonVisibility] = useState(false);
  const [isDeleteToastVisible, setDeleteToastVisibility] = useState(false);
  const [isOverlayVisible, setOverlayVisibility] = useState(false);
  const columnOptionsRef = useRef(null);
 
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (columnOptionsRef.current && !columnOptionsRef.current.contains(event.target)) {
        // Verifica se o clique foi no botão de deletar
        const isDeleteButtonClicked = event.target.closest("[data-delete-button]") !== null;
  
        if (!isDeleteButtonClicked) {
          setOptionButtonVisibility(true);
          setDeleteButtonVisibility(false);
          setOverlayVisibility(false);
          
        }
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [columnOptionsRef]);

  function toggleButtons() {
    setOptionButtonVisibility(!isOptionButtonVisible);
    setDeleteButtonVisibility(!isDeleteButtonVisible);
  }
  
  function deleteColumn(columnId, index) {
    toast.dismiss()
    if (!isDeleteToastVisible) {
      setOverlayVisibility(true);
 

        toast(
          (t) => (
     
            <>
            <ToastWrapper>    
              <ToastText>Tem certeza que deseja excluir a coluna?</ToastText> 
              <ActionsToastWrapper>
              <ActionToastButton onClick={() =>  confirmColumnDeletion(columnId, index)}>Confirmar</ActionToastButton>
              <CloseToastButton onClick={() => toast.dismiss(t.id)} >Cancelar</CloseToastButton>
            </ActionsToastWrapper>
            </ToastWrapper> 
           </>
     
          ),
          {
            icon:  '🔥',
          },
           {
            style: {
              minWidth: '250px',
            },
            success: {
              duration: 5000,
              icon: '🔥',
            },
          },
        );
    
   
    }
 
  }
  // Função para confirmar a exclusão após a notificação
async function confirmColumnDeletion(columnId, index) {
  toast.dismiss()
  setOverlayVisibility(false);
  // Lógica para excluir a coluna e suas tarefas
  const columnsTasks = props.board.columns[columnId].taskIds;

  const finalTasks = columnsTasks.reduce((previusValue, currentvalue) => {
    const { [currentvalue]: deletedTask, ...newTasks } = previusValue;
    return newTasks;
  }, props.board.tasks);

  const columns = props.board.columns;
  const { [columnId]: deletedColumn, ...newColumns } = columns;

  const newColumnOrder = Array.from(props.board.columnOrder);
  newColumnOrder.splice(index, 1);

  const newBoard = {
    tasks: finalTasks,
    columns: newColumns,
    columnOrder: newColumnOrder,
  };
 
  props.setBoard(newBoard) 
 
  setDeleteButtonVisibility(false);
  setOptionButtonVisibility(true);

 
  setDeleteToastVisibility(true);
 
}
 
 
      
    return (
        <Draggable draggableId={props.column.id} index={props.index}>
            
                {provided =>(
                    <Container {...provided.draggableProps} ref={provided.innerRef}>
                        <ColumnWrapper>
                        <ColumnInner>
                        <ColumnHeader {...provided.dragHandleProps}>
                            <ColmunTitle>
                                {props.column.title}                                            
                            </ColmunTitle>

                            <ColmunOptions ref={columnOptionsRef} onClick={toggleButtons}>
                            {isOptionButtonVisible && <OptionsIcon />}
                            </ColmunOptions>

                            {isDeleteButtonVisible && (
                                <DeleteButton data-delete-button onClick={() => deleteColumn(props.column.id, props.index)}                                   
                                >
                                    <DeleteIcon />
                                </DeleteButton>
                            )}
                        </ColumnHeader>
                        <Droppable droppableId={props.column.id} type="task">
                        {provided =>(
                            <TaskList {...provided.droppableProps} ref={provided.innerRef}>
                                {props.tasks.map((task, index) => (
                                    (<Task key={task.id} task={task} index={index}  columnId={props.column.id} 
                                     board={props.board} setBoard={props.setBoard}
                                    />)
                                ))}
                                {provided.placeholder} 
                                <AddTask  columnId={props.column.id} board={props.board} setBoard={props.setBoard} />
                            </TaskList>
                        )}
                        </Droppable>
                        </ColumnInner>
                     </ColumnWrapper>
                     {isOverlayVisible && <Overlay />}
                    </Container>
                )}
        </Draggable>
    );
}

export default Column;