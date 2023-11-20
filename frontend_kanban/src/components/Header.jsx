import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
     min-height: 48px;
    max-height: 48px;
    overflow: hidden;
    background-color: #0000003d;
`;

const Nav = styled.nav`
  background-color: var(--dynamic-background, #026AA7);
 

    transition: background-color 300ms;
 
    border-bottom-width: 1px;
    border-bottom-style: solid;
 
    box-sizing: border-box;
    display: e;
    overflow: hidden;
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    max-height: 48px;
    padding: 8px;

`;

const Button = styled.button` 
    border-radius: 3px;
    border: 0;
    text-decoration: none;
    align-items: center;
    background-color: transparent;
    box-shadow: none;
    display: flex;
    font-weight: bold;
    height: 32px;
    line-height: 32px;
    margin: 0 4px 0 0;
    padding: 0;
    white-space: nowrap;
    color: rgba(255, 255, 255, 0.3);
`;

const Anchor = styled.a`
  /* Adicione estilos para os links aqui */
`;

const Icon = styled.span`
  display: flex;
    width: 32px;
    justify-content: center;
    align-items: center;
    margin: 0;
`;

const Svg = styled.svg`
  overflow: hidden;
    pointer-events: none;
    max-width: 100%;
    max-height: 100%;
    color: #091E42;
    fill: inherit;
    vertical-align: bottom;
`;

// Crie o seu componente JSX utilizando os estilos definidos
const Header = () => {
  return (
    <HeaderContainer>
      <Nav>
        <Button>
          <Icon>
            <Svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {/* Adicione o conteúdo do SVG aqui */}
            </Svg>
          </Icon>
        </Button>
        <Anchor href="/">
          {/* Conteúdo do link */}
        </Anchor>
        {/* Adicione outros elementos aqui */}
      </Nav>
      {/* Adicione mais elementos conforme necessário */}
    </HeaderContainer>
  );
};

export default Header;

  