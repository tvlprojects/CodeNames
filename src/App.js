import React, { Component } from 'react';
import './App.css';
import Board from './components/Board';
import  { Container, Grid, Button, Progress, Segment} from 'semantic-ui-react';

class App extends Component {
  constructor(props) {
    super(props);

    const wordBank = require("./components/wordBank.js");
    this.squares = shuffle(wordBank).slice(0, 25);
    let availableIndices = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    this.deathSquareIndex = Math.floor(Math.random()*availableIndices.length);
    this.blueSquaresIndices = [];
    this.redSquaresIndices = [];

    availableIndices = availableIndices.slice(0, this.deathSquareIndex).concat(availableIndices.slice(this.deathSquareIndex+1));
    for (let i=0; i<9; i++){
      let blueSquareIndex = Math.floor(Math.random()*availableIndices.length);
      this.blueSquaresIndices.push(availableIndices[blueSquareIndex]);
      availableIndices = availableIndices.slice(0, blueSquareIndex).concat(availableIndices.slice(blueSquareIndex+1));
    }

    for (let i=0; i<8; i++){
      let redSquareIndex = Math.floor(Math.random()*availableIndices.length);
      this.redSquaresIndices.push(availableIndices[redSquareIndex]);
      availableIndices = availableIndices.slice(0, redSquareIndex).concat(availableIndices.slice(redSquareIndex+1));
    }

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

  toggleTurn(i){
    this.setState({blueTurn: !this.state.blueTurn});
  }

  render() {
    let status;
    let resetButton;
    let fontColor = (this.state.blueTurn) ? '#0D47A1' : '#E53935';
    let color = (this.state.blueTurn) ? 'blue' : 'red';

    let winner = calculateWinner(this.blueSquaresIndices, this.redSquaresIndices, this.state.selected, this.state.blueTurn, this.deathSquareIndex);
    if (winner) {
      status = winner + ' wins!';
      resetButton = <Button style={{"width": "250px"}} fluid={true} onClick={()=>window.location.reload()}>Reset Board for new game</Button>;
    } else {
      status = status = 'Current Turn: ' + (this.state.blueTurn ? 'Blue' : 'Red');
    }

    let view = (this.state.playerView ? "Spymaster View" : "Player View");

    return (
      <div>
        <Segment inverted={true} color={color}>
          <h1>
            Code Names
          </h1>
        </Segment>
        <Container fluid={true}>
          <Grid verticalAlign={"top"} centered={true} columns={16} stackable={true}>
            <Grid.Column width={3}>
              <Segment basic={true} compact={true}>
                <h2>Scoreboard</h2>
                <Progress total={9} value={9-this.state.blueCount} progress={"ratio"} color={"blue"}/>
                <Progress total={8} value={8-this.state.redCount} progress={"ratio"} color={"red"} style={{"marginTop" : "-32px"}}/>
                <div>
                  <h2><font color={fontColor}>{status}</font></h2>
                  <Button style={{"width": "250px"}} color={color} onClick={()=>this.setState({playerView : !this.state.playerView})}>Change to {view}</Button>
                </div>
                <div>
                  <Button style={{"width": "250px"}} fluid={true} onClick={()=>this.toggleTurn()}>Next Turn</Button>
                </div>
                <div>
                  {resetButton}
                </div>
              </Segment>
            </Grid.Column>
            <Grid.Column width={13} stretched={true}>
            <Segment basic={true}>
              <Board
                blueSquaresIndices = {this.blueSquaresIndices}
                redSquaresIndices = {this.redSquaresIndices}
                deathSquareIndex = {this.deathSquareIndex}
                onClick = {(i)=>this.handleClick(i)}
                selected = {this.state.selected}
                bank = {this.squares}
                playerView = {this.state.playerView}
              />
            </Segment>
            </Grid.Column>
          </Grid>
        </Container>
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
  let currentIndex = array.length, temporaryValue, randomIndex;

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
