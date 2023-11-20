import React, { useEffect, useState, useRef, useCallback} from 'react';

import styled from 'styled-components';

const Button = styled.button`
  background-color: transparent;
  border-radius: 8px;
  color: #44546f;
  padding: 6px 12px 6px 8px;
  text-decoration: none;
  -webkit-user-select: none;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 1;
  margin: 0;
  width: 100%;
  border: none;

  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  font-display: swap;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  white-space: normal;
  background-color: transparent;
  box-shadow: none;
  border: none;
  color: #172b4d;
  font-weight: 500;
  transition-property: background-color, border-color, box-shadow;
  transition-duration: 85ms;
  transition-timing-function: ease;
  &:hover {
    background-color: #091e4224;
    box-shadow: none;
    border: none;
    color: #172b4d;
    text-decoration: none;
  }
`;

const Input = styled.input`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-shadow: inset 0 0 0 2px  #091e4224;
  box-sizing: border-box;
  color: #333;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  margin-bottom: 8px;
  padding: 0 10px;
  transition: border-color 0.3s ease;
  width: 100%;
  &:focus {
    border-color:  #0c66e4;
    outline: none;
  }
`;

const ButtonAdd = styled.button`
  padding: 12px;
  background-color: #0c66e4;
  box-shadow: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  &:hover {
    background-color: #0000003d;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  /* Mostrar os botões na horizontal */
  align-items: center;
  /* Alinhar os botões verticalmente no centro */
  justify-content: space-between;
  /* Espaçamento entre os botões */
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;

  height: 36px;
  margin-right: calc(45% - 4px);
  &:hover {
    color: #172b4d;
    background-color: #bfdbf847;
    border-radius: 8px;
  }
  svg {
    padding: 5px 0px;
  }
`;

const CloseIcon = () => (
  // Substitua com o seu SVG (ícone de fechar) ou use um ícone real
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
function AddTask(props) {
  const [value, setValue] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);
  const inputRef = useRef(null);
  const [shouldAddNewTask, setShouldAddNewTask] = useState(false);

  const addNewTask = useCallback(() => {
    if (value.trim() && isInputActive && shouldAddNewTask) {
      const newTaskId = 'task-' + Math.floor(Math.random() * 100000);
      const column = props.board.columns[props.columnId];
      const newTaskIds = [...column.taskIds, newTaskId];

      props.setBoard((prevBoard) => ({
        ...prevBoard,
        tasks: {
          ...prevBoard.tasks,
          [newTaskId]: {
            id: newTaskId,
            content: value,
          },
        },
        columns: {
          ...prevBoard.columns,
          [props.columnId]: {
            ...column,
            taskIds: newTaskIds,
          },
        },
      }));
      resetInput();
    }else{
      resetInput();
    }
  }, [value, isInputActive, shouldAddNewTask, props]);

  const handleInputChange = (event) => { 
    setValue(event.target.value);
  };

  const resetInput = () => {
    setValue('');
    setIsInputActive(false);
    setShouldAddNewTask(false);
  };

  
  const AddButtonList = ({ onClick, label }) => (
    <Button type="button" onClick={onClick} className="add-button-list">
      {label}
    </Button>
  );


  const AddButton = ({ onClick, label }) => (
    <ButtonAdd type="button" onClick={onClick}>
      {label}
    </ButtonAdd>
  );

  const AddCardButton = () => {
    const handleAddCardButtonClick = () => {
      setIsInputActive(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    };
  
    return <AddButton onClick={handleAddCardButtonClick} label="Adicionar Cartão" />;
  };
  
  const AddListButton = () => {
    const handleAddListButtonClick = () => {
      setShouldAddNewTask(true);
      setIsInputActive(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    };
  
    return <AddButtonList onClick={handleAddListButtonClick} label="+ Adicionar um cartão" />;
  };
  
  const onCancelClick = (event) => {    
    resetInput();
    event.stopPropagation();
  };
  
  const onNewTaskInputComplete = useCallback(() => {
    if (shouldAddNewTask) {
      addNewTask();
    }
  }, [shouldAddNewTask, addNewTask]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isInputActive &&
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        !event.target.classList.contains('add-button-list')
      ) {
        onNewTaskInputComplete();
      }
    };
  
    window.addEventListener('click', handleClickOutside);
  
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isInputActive, onNewTaskInputComplete]);

  useEffect(() => {
    if (isInputActive) {
      inputRef.current.focus();
    }
  }, [isInputActive]);
  

  return (
    <div>
      {isInputActive ? (
        <div>
          <Input
            id="new-task-input"
            placeholder="Insira um título para este cartão..."
            value={value}
            onChange={handleInputChange}
            ref={inputRef}
          />
          <ButtonContainer>
            <AddCardButton />
            <CloseButton onClick={(event) => onCancelClick(event)}>
              <CloseIcon />
            </CloseButton>
          </ButtonContainer>
        </div>
      ) : (
        <AddListButton />
      )}
    </div>
  );
}

export default AddTask;