import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100vw;
 
`;

const Button = styled.button`
  background-color: #bfdbf847;
  border-radius: 12px;
  padding: 12px;
  color: #fff;
  border: none;
  box-shadow: none;
  cursor: pointer;
  &:hover {
    background-color: #0000003d;
  }
`;

const Input = styled.input`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-shadow: none;
  box-sizing: border-box;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  margin-bottom: 8px;
  padding: 0 10px;
  transition: border-color 0.3s ease;
  width: 100%;
  box-shadow: inset 0 0 0 2px  #091e4224;
  &:focus {
    border-color: #0c66e4;
    outline: none;
  }

  &::placeholder {
    color: #bdbdbd;
  }

`;

  

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;

  height: 36px;
  margin-right: calc(45% - 4px);
  &:hover {
    border-radius: 8px;
  }
  svg {
    padding: 5px 0px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
 
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


const Text = styled.span`
  position: absolute;
  display: contents;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;
  color: var(--text); 
 
`;

const ButtonAdd = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding:  0.75rem;
  overflow: hidden;
  font-weight: 600;
  text-decoration: none;  
  transition: all 0.3s ease-out;
  border: 2px solid var(--bg-sky-blue);  
  border-radius: 9999px;  
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: var(--bg-sky-blue);
  color: var(--text);
  &:hover {
    background-color: var(--bg-card);     
    ${Text} {
      color: var(--bg-sky-blue);
    }
  }
`;
 


 function AddColumn(props) {
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
 
 
    const handleAddColumn = useCallback(() => {
    setShowInput(true);
 
    if (value.trim() && showInput) {      
      const newColumnOrder = [...props.board.columnOrder];
      const newColumnId = 'column-' + Math.floor(Math.random() * 100000);
      newColumnOrder.push(newColumnId);

      const newColumn = {
        id: newColumnId,
        title: value,
        taskIds: [],
      };

      props.setBoard((prevBoard) => ({
        ...prevBoard,
        columnOrder: newColumnOrder,
        columns: {
          ...prevBoard.columns,
          [newColumnId]: newColumn,
        },
      })); 
      resetInput(); 
    } else {
      // If input is empty, hide the input field
      setShowInput(false);
    }
  }, [value, showInput,props]);

  const onNewColumnInputComplete = useCallback(() => {
    if (showInput) {
      handleAddColumn();
    }
  }, [showInput, handleAddColumn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showInput &&
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        !event.target.classList.contains('add-button-list')
      ) {
         onNewColumnInputComplete();
      }
    };
  
    window.addEventListener('click', handleClickOutside);
  
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [showInput, onNewColumnInputComplete]);

  useEffect(() => {
    if (showInput) {
      inputRef.current.focus();
    }
  }, [showInput]);
  
 
  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  const resetInput = () => {
    setValue('');
    setShowInput(false);
  };

  const onCancelClick = (event) => {    
    resetInput();
    event.stopPropagation();
  };

  const AddButtonList = ({ onClick, label }) => (
    <Button type="button" onClick={onClick} className="add-button-list">
      {label}
    </Button>
  );

  const AddListButton = () => {
    const handleAddListButtonClick = () => {
      setShowInput(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }; 
 
    return <AddButtonList onClick={handleAddListButtonClick} label="+ Adicionar outra coluna" />;
  };

 
  const AddButton  = ({ onClick, label }) => {
    return (
      <ButtonAdd type="button" onClick={onClick}> 
      <Text className="text"> {label}</Text>
    </ButtonAdd>
    );
  };

  const AddCardButton = () => {
    const handleAddCardButtonClick = () => {
      handleAddColumn();
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    };
  
    return  <AddButton onClick={handleAddCardButtonClick} label="Adicionar Coluna" />
 
    ;
  };

  return (
    <Container>
      {showInput ? (
        <div>
        <Input
          id="new-task-input"
          placeholder="Insira um título para esta coluna..."
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
    </Container>
  );
};

export default AddColumn;
