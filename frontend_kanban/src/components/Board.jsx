import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import Column from   "./Columns";
import AddColumn from "./AddColumn";
import Logout from "./Logout";
 

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Add gap between columns */
  padding: 20px;

  @media (max-width: 768px) {
    flex-direction: column; /* Change to column layout on mobile */
    margin: 0px 0px 0px 10px;
  }
`;

const ButtonContainer = styled.div`
    box-sizing: border-box;
    border-radius: 4px;
    overflow: hidden;
    width: 343px;
    display: inline-block;
    vertical-align: top;
    margin: 36px 0px 0px 0px;
    border-radius: 12px;
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
    scroll-margin: 8px;
`;

const AddColumnButton = styled.div`
    flex: 1;
    margin: 0 12px;
    background: none;
    border: none;
    box-shadow: none; 
`;

function Board(props) {

    const initialData = {tasks: {}, columns: {}, columnOrder: []};
    const [board, setBoard] = useState([initialData]);

 
    function onDragEnd(result) {
        // alert("dropped");
        const { destination, source, draggableId, type } = result;
        if (!destination) {
            return;
        }
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        if (type === "column") {
            const newColumnOrder = Array.from(board.columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);
            const newState = {
                ...board,
                columnOrder: newColumnOrder
            };
            setBoard(newState);
            return;
        }

        const start = board.columns[source.droppableId];
        const finish = board.columns[destination.droppableId];
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);
            const newColumn = {
                ...start,
                taskIds: newTaskIds
            };
            const newState = {
                ...board,
                columns: {
                    ...board.columns,
                    [newColumn.id]: newColumn
                }
            };
            setBoard(newState);
            return;
        }

        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds
        };

        const newState = {
            ...board,
            columns: {
                ...board.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
            }
        };
        setBoard(newState);
    }

    useEffect(() => {
        async function saveBoard(updatedData) {
            console.log("save board", updatedData);
    
            const hasTasks = updatedData.tasks && Object.keys(updatedData.tasks).length > 0;
            const hasColumns = updatedData.columns && Object.keys(updatedData.columns).length > 0;
    
            // Checar se há pelo menos uma tarefa ou mais de uma coluna antes de salvar
            if (hasTasks || (hasColumns && updatedData.columnOrder.length > 0)) {
                const response = await fetch("/board", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${props.token}`,
                    },
                    body: JSON.stringify(updatedData),
                    
                });
                const data = await response.json();                
                return data;

                
            } else {
                // Se não há tarefas ou colunas, envie um objeto vazio com as chaves necessárias
                const response = await fetch("/board", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${props.token}`,
                    },
                    body: JSON.stringify({
                        tasks: {},
                        columns: {},
                        columnOrder: [],
                    }),
                });
                const data = await response.json();
                return data;
            }
        }

        if (board !== initialData) {
            saveBoard(board) 
        }
 
    }, [board  , props.token ]);
 


      useEffect(() => {
        async function fetchBoard() {
          const response = await fetch("/board", {
                headers: {
                    "Authorization": `Bearer ${props.token}`,
                }
            }
          );
          const data = await response.json();
          return data.board;
        }
 
        fetchBoard().then((data) => {
            setBoard(data);
          })
      }, [props.token]);

    return ( 
        <DragDropContext onDragEnd={onDragEnd}>
            
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
                {provided =>(                    
                <Container {...provided.droppableProps} ref={provided.innerRef}>
                        {
                            board.columnOrder ? (
                                board.columnOrder.map((columnId, index) => {
                                const column = board.columns[columnId];
                                const tasks = column.taskIds.map((taskIds) => (board.tasks && board.tasks[taskIds]) || null);

                                return <Column key={column.id} column={column} tasks={tasks} index={index} board={board} setBoard={setBoard}/>;
                                })
                            ) : (
                                <p>Carregando...</p>
                            )
                        }
                        {provided.placeholder}
 
                        <ButtonContainer>
                            <AddColumnButton>
                                <AddColumn board={board} setBoard={setBoard} />
                            </AddColumnButton>
                            <Logout/>
                        </ButtonContainer>
                    </Container>

                    
                )}
            </Droppable>   

        </DragDropContext>       

 
        
    );
    }

export default Board;