import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {
    gameState: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    nonEmptyLocationArrows: []
  };

  getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

  checkForGameOver = arrow => {
    let { nonEmptyLocationArrows } = this.state;
    const oldNonEmptyLocationArrows = nonEmptyLocationArrows;
    nonEmptyLocationArrows = nonEmptyLocationArrows.filter(item => item !== arrow);
    if (this.getEmptyLocations().length === 0) {
      nonEmptyLocationArrows.push(arrow);
    }
    let gameReallyOver = false;
    if (oldNonEmptyLocationArrows.length === 4 && nonEmptyLocationArrows.length === 4) {
      let gameOver = true;
      let i = 0;
      while (i < 4) {
        if (oldNonEmptyLocationArrows[i] === nonEmptyLocationArrows[i]) {
          gameOver = false;
          break;
        }
        i += 1;
      }
      if (gameOver) {
        gameReallyOver = true;
      }
    }
    if (gameReallyOver) {
      console.log('game over');
    } else {
      this.setState({
        nonEmptyLocationArrows
      });
    }
    console.log(nonEmptyLocationArrows);
  };

  handleMotion = (e) => {
    e.preventDefault();
    if (e.key === 'ArrowRight') {
      this.handleRightArrowClick();
      this.checkForGameOver('right');
    }
    if (e.key === 'ArrowLeft') {
      this.handleLeftArrowClick();
      this.checkForGameOver('left');
    }
    if (e.key === 'ArrowUp') {
      this.handleUpArrowClick();
      this.checkForGameOver('up');
    }
    if (e.key === 'ArrowDown') {
      this.handleDownArrowClick();
      this.checkForGameOver('down');
    }
  };

  mutateGameState = (i, j, value) => {
    const currentGameState = this.state.gameState;
    currentGameState[i][j] = value;
    this.setState({
      gameState: currentGameState
    })
  };

  reorderItems = array => {
    let i = array.length;
    while (i > 0) {
      i -= 1;
      if (array[i] > 0) continue;
      let j = i;
      while (j > 0) {
        j -= 1;
        if (array[j] > 0) break;
      }
      array[i] = array[j];
      array[j] = 0;
    }
    return array;
  };

  performAddition = array => {
    const reorderedArray = this.reorderItems(array);
    let i = reorderedArray.length - 1;
    while (i > 0) {
      if (reorderedArray[i] === reorderedArray[i - 1]) {
        reorderedArray[i] = reorderedArray[i] * 2;
        reorderedArray[i - 1] = 0;
        return this.reorderItems(reorderedArray);
      }
      i -= 1;
    }
    return reorderedArray;
  };

  getEmptyLocations = () => {
    const { gameState } = this.state;
    const emptyLocations = [];
    let rowIndex = 0;
    while (rowIndex < 4) {
      let colIndex = 0;
      while (colIndex < 4) {
        if (gameState[rowIndex][colIndex] === 0) {
          emptyLocations.push({
            rowIndex, colIndex
          });
        }
        colIndex += 1;
      }
      rowIndex += 1;
    }
    return emptyLocations;
  };

  putTwoAtARandomEmptyLocation = () => {
    const emptyLocations = this.getEmptyLocations();
    if (emptyLocations.length > 0) {
      const randomIndex = this.getRandomInt(emptyLocations.length);
      const randomLocation = emptyLocations[randomIndex];
      this.mutateGameState(randomLocation.rowIndex, randomLocation.colIndex, 2);
    }
  };

  putTwoAtTwoRandomEmptyLocations = () => {
    this.mutateGameState(this.getRandomInt(4), this.getRandomInt(4), 2);
    const emptyLocations = this.getEmptyLocations();
    const randomIndex = this.getRandomInt(emptyLocations.length);
    const randomLocation = emptyLocations[randomIndex];
    this.mutateGameState(randomLocation.rowIndex, randomLocation.colIndex, 2);
  };

  handleDownArrowClick = () => {
    const { gameState } = this.state;
    let colIndex = 0;
    while (colIndex < 4) {
      let rowIndex = 0;
      const colArray = [];
      while (rowIndex < 4) {
        colArray.push(gameState[rowIndex][colIndex]);
        rowIndex += 1;
      }
      const newColArray = this.performAddition(colArray);
      rowIndex = 0;
      while (rowIndex < 4) {
        gameState[rowIndex][colIndex] = newColArray[rowIndex];
        rowIndex += 1;
      }
      colIndex += 1;
    }
    this.setState({ gameState });
    this.putTwoAtARandomEmptyLocation();
  };

  handleUpArrowClick = () => {
    const { gameState } = this.state;
    let colIndex = 0;
    while (colIndex < 4) {
      let rowIndex = 3;
      const colArray = [];
      while (rowIndex >= 0) {
        colArray.push(gameState[rowIndex][colIndex]);
        rowIndex -= 1;
      }
      const newColArray = this.performAddition(colArray);
      rowIndex = 3;
      while (rowIndex >= 0) {
        gameState[rowIndex][colIndex] = newColArray[3 - rowIndex];
        rowIndex -= 1;
      }
      colIndex += 1;
    }
    this.setState({ gameState });
    this.putTwoAtARandomEmptyLocation();
  };

  handleRightArrowClick = () => {
    const { gameState } = this.state;
    let rowIndex = 0;
    while (rowIndex < 4) {
      let colIndex = 0;
      const rowArray = [];
      while (colIndex < 4) {
        rowArray.push(gameState[rowIndex][colIndex]);
        colIndex += 1;
      }
      const newRowArray = this.performAddition(rowArray);
      colIndex = 0;
      while (colIndex < 4) {
        gameState[rowIndex][colIndex] = newRowArray[colIndex];
        colIndex += 1;
      }
      rowIndex += 1;
    }
    this.setState({ gameState });
    this.putTwoAtARandomEmptyLocation();
  };

  handleLeftArrowClick = () => {
    const { gameState } = this.state;
    let rowIndex = 0;
    while (rowIndex < 4) {
      let colIndex = 3;
      const rowArray = [];
      while (colIndex >= 0) {
        rowArray.push(gameState[rowIndex][colIndex]);
        colIndex -= 1;
      }
      const newRowArray = this.performAddition(rowArray);
      colIndex = 3;
      while (colIndex >= 0) {
        gameState[rowIndex][colIndex] = newRowArray[3 - colIndex];
        colIndex -= 1;
      }
      rowIndex += 1;
    }
    this.setState({ gameState });
    this.putTwoAtARandomEmptyLocation();
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleMotion);
    this.putTwoAtTwoRandomEmptyLocations();
  }

  render() {
    const { gameState } = this.state;
    return (
      <div>
        <div className="header">
          2048 Game
        </div>
        <div className="playground">
          {[0, 1, 2, 3].map(i => {
            return [0, 1, 2, 3].map(j => (
              <span key={j}>
                {gameState[i][j] > 0 ? gameState[i][j] : ''}
              </span>
            ))
          })}
        </div>
      </div>
    );
  }
}

export default App;
