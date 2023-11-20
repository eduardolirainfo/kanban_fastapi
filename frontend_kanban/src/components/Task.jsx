import React from "react";
import styled  from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import toast from 'react-hot-toast';

const TaskContainer = styled.div`
    transition: background-color 0.3s ease, transform 0.2s ease;
    word-wrap: break-word;
    transition: background 0.3s ease;
    color:   #172b4d;
    min-height: 36px;
    position: relative;
    scroll-margin: 8px;
  
    background-color: var(--white);
    padding: 1rem;
    border-radius: 8px;

    box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
    margin-bottom: 1rem;
    border: 3px dashed transparent;

   &:hover { 
    cursor:move;
    box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
    border-color: rgba(162, 179, 207, 0.2) !important;

    .close-button {
      opacity: 1;
      pointer-events: auto;
    }
   }
 
  &:active {
     box-shadow: 20px 20px 50px rgba(0,0,0,.5);

  }
`;

const TaskContent = styled.p`
  margin: 0;
  font-size: 15px;
  margin: 1.2rem 0;
`;


const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0; /* Inicialmente, ocultar o ícone */
  pointer-events: none; /* Não permitir interações com o ícone oculto */
  float: right; 
  height: 36px;
  position: absolute;
  right: 5px;
  bottom: calc(50% - 18px);
  svg{
        fill: rgba(255, 0, 0, 0.3);
        padding: 4px 0px
    }

    &:hover {
            background: rgba(255, 0, 0, 0.2);
            border-radius: 18px  ;
            svg{
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
 

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
  </svg>
);


const CloseIcon = () => (
  <TrashIcon />
);

function Task(props){


  function deletarTask(columnId, index, taskId) { 
    toast.dismiss()
    toast(
      (t) => (
 
        <>
        <ToastWrapper>    
          <ToastText>Tem certeza que deseja excluir a tarefa?</ToastText> 
          <ActionsToastWrapper>
          <ActionToastButton onClick={() => confirmaDelecaoTask(columnId, index, taskId)}>Confirmar</ActionToastButton>
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
    
  async function confirmaDelecaoTask(columnId, index, taskId) { 
        toast.dismiss()
        const column = props.board.columns[columnId];
        const newTaskIds = Array.from(column.taskIds);
        newTaskIds.splice(index, 1);
        
        const tasks  = props.board.tasks;
        const { [taskId]: deletedTask, ...newTasks } = tasks;

        props.setBoard({
            ...props.board,
            tasks: {
                ...newTasks
              },
            columns: {
                ...props.board.columns,
                [columnId]: {
                    ...column,
                    taskIds: newTaskIds
                }
            },           
        
        })
 
    }
    
    return (
        <Draggable draggableId={props.task.id} index={props.index}>
            {provided =>(
                <TaskContainer {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <TaskContent>
                    {props.task.content}
                    </TaskContent>
                    {provided.placeholder} 
                    <CloseButton className="close-button" onClick={() => deletarTask(props.columnId, props.index, props.task.id)} >
                        <CloseIcon />
                    </CloseButton> 
                </TaskContainer>
            )}
        </Draggable>
    );
}

export default Task;