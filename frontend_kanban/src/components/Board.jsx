import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Column from   "./Columns";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Add gap between columns */
  padding: 20px;

  @media (max-width: 768px) {
    flex-direction: column; /* Change to column layout on mobile */
  }
`;

function Board(props) {

    const initialData = {tasks: {}, columns: {}, columnOrder: []};
    const [board, setBoard] = useState([initialData]);

    useEffect(() => {
        fetchBoard ().then((data) => setBoard(data));
    }, []);

    async function fetchBoard() {
        const response = await fetch("/board");
        const data = await response.json();
        return data.board;
    }
    
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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
                {provided =>(                    
                <Container {...provided.droppableProps} ref={provided.innerRef}>
                        {
                            board.columnOrder ? (
                                board.columnOrder.map((columnId, index) => {
                                const column = board.columns[columnId];
                                const tasks = column.taskIds.map(taskIds => board.tasks[taskIds]);
                                return <Column key={column.id} column={column} tasks={tasks} index={index} board={board} setBoard={setBoard}/>;
                                })
                            ) : (
                                <p>Carregando...</p>
                            )
                        }
                        {provided.placeholder}
                    </Container>
                )}
            </Droppable>
        </DragDropContext>
    );
    }

export default Board;