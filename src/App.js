import React, { Component } from 'react';
import './App.css';
import Board from './components/Board';

class App extends Component {
  constructor(props) {
    super(props);

    //Move this to a DB to pull from?
    const wordBank = require("./components/wordBank.js");
    this.squares = shuffle(wordBank).slice(0, 25);
    var availableIndices = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    this.deathSquareIndex = Math.floor(Math.random()*availableIndices.length);
    this.blueSquaresIndices = [];
    this.redSquaresIndices = [];

    availableIndices = availableIndices.slice(0, this.deathSquareIndex).concat(availableIndices.slice(this.deathSquareIndex+1));
    for (let i=0; i<9; i++){
      var blueSquareIndex = Math.floor(Math.random()*availableIndices.length);
      this.blueSquaresIndices.push(availableIndices[blueSquareIndex]);
      availableIndices = availableIndices.slice(0, blueSquareIndex).concat(availableIndices.slice(blueSquareIndex+1));
    }

    for (let i=0; i<8; i++){
      var redSquareIndex = Math.floor(Math.random()*availableIndices.length);
      this.redSquaresIndices.push(availableIndices[redSquareIndex]);
      availableIndices = availableIndices.slice(0, redSquareIndex).concat(availableIndices.slice(redSquareIndex+1));
    }

    //Index does not need to be managed as state, move this later? Should I move all the states to the board level?
    this.state = {
      selected: new Set(),
      blueTurn: true,
      playerView: true,
      redCount: 8,
      blueCount: 9
    };
  }

  handleClick(i) {
    if (!this.state.playerView || calculateWinner(this.blueSquaresIndices, this.redSquaresIndices, this.state.selected, this.state.blueTurn, this.deathSquareIndex)){
      return;
    }

    if ((this.state.blueTurn && !this.blueSquaresIndices.includes(i)) ||
      (!this.state.blueTurn && !this.redSquaresIndices.includes(i))) {
        this.setState({blueTurn: !this.state.blueTurn});
    }

    if (this.blueSquaresIndices.includes(i)){
      this.setState({blueCount: this.state.blueCount - 1});
    }

    if (this.redSquaresIndices.includes(i)){
      this.setState({redCount: this.state.redCount - 1});
    }

    this.setState(
      {
        selected: this.state.selected.add(i),
      }
    );
  }

  render() {
    let status;
    var resetButton;

    let winner = calculateWinner(this.blueSquaresIndices, this.redSquaresIndices, this.state.selected, this.state.blueTurn, this.deathSquareIndex);
    if (winner) {
      status = winner + ' wins!';
      resetButton = <button className='btn-primary' onClick={()=>window.location.reload()}>Reset Board for new game</button>;
    } else {
      status = status = 'Current Turn: ' + (this.state.blueTurn ? 'Blue' : 'Red');
      var fontColor = (this.state.blueTurn) ? '#3366FF' : '#CC3333';
    }



    let view = (this.state.playerView ? "Spymaster View" : "Player View");

    return (
      <div className=".container-fluid">
        <h1>Code Names</h1>
        <div className="game">
          <div className="game-board">
            <Board
              blueSquaresIndices = {this.blueSquaresIndices}
              redSquaresIndices = {this.redSquaresIndices}
              deathSquareIndex = {this.deathSquareIndex}
              onClick = {(i)=>this.handleClick(i)}
              selected = {this.state.selected}
              bank = {this.squares}
              playerView = {this.state.playerView}
            />
          </div>
          <div className="game-info">
            <div><font color={fontColor}>{status}</font></div>
            <div>Current Score: <font color="#3366FF">{this.state.blueCount}</font> - <font color="#CC3333">{this.state.redCount}</font></div>
            <div className="btn-group btn-group-sm">
              <button className = "btn-primary" onClick={()=>this.setState({playerView : !this.state.playerView})}>Change to {view}</button>
            </div>
            <div>
              {resetButton}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function calculateWinner(blueSquares, redSquares, selectedSquares, blueTurn, deathSquareIndex){
  let winner = false;

  if (selectedSquares.has(deathSquareIndex) && blueTurn){
    winner = 'Blue';
  } else if (selectedSquares.has(deathSquareIndex) && !blueTurn){
    winner = 'Red';
  }

  if (blueSquares.every((currentValue)=>{return selectedSquares.has(currentValue);})) {
      winner = 'Blue';
  } else if (redSquares.every((currentValue)=>{return selectedSquares.has(currentValue);})) {
      winner = 'Red';
  };

  return winner;
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default App;
