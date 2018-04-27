import React, { Component } from 'react';
import Board from './Board';
import  { Container, Grid, Button, Progress, Segment} from 'semantic-ui-react';
import firebase from 'firebase';
import { DB_CONFIG } from '../Config';

class Game extends Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.id;

    if (!firebase.apps.length){
      this.app = firebase.initializeApp(DB_CONFIG);
      this.database = this.app.database().ref().child(`${this.id}`);
    }

    this.state = {
      squares: [""],
      selected : [25],
      blueCount: 9,
      redCount: 8,
      playerView: true,
      blueTurn: true,
      deathSquareIndex: 999,
      redSquaresIndices: [2],
      blueSquaresIndices: [1]
    };
  }

  componentDidMount(){
    this.database.on('value', snap => {
      if (snap.val()){
        const snapshot = snap.val().game;
        this.setState({
          squares: snapshot.squares,
          selected : snapshot.selected,
          blueCount: snapshot.blueCount,
          redCount: snapshot.redCount,
          playerView: snapshot.playerView,
          blueTurn: snapshot.blueTurn,
          deathSquareIndex: snapshot.deathSquareIndex,
          redSquaresIndices: snapshot.redSquaresIndices,
          blueSquaresIndices: snapshot.blueSquaresIndices
        })
      } else {
        const wordBank = require("./wordBank.js");
        const squares = shuffle(wordBank).slice(0, 25);
        let availableIndices = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
        const deathSquareIndex = Math.floor(Math.random()*availableIndices.length);
        let blueSquaresIndices = [];
        let redSquaresIndices = [];

        availableIndices = availableIndices.slice(0, deathSquareIndex).concat(availableIndices.slice(deathSquareIndex+1));
        for (let i=0; i<9; i++){
          let blueSquareIndex = Math.floor(Math.random()*availableIndices.length);
          blueSquaresIndices.push(availableIndices[blueSquareIndex]);
          availableIndices = availableIndices.slice(0, blueSquareIndex).concat(availableIndices.slice(blueSquareIndex+1));
        }

        for (let i=0; i<8; i++){
          let redSquareIndex = Math.floor(Math.random()*availableIndices.length);
          redSquaresIndices.push(availableIndices[redSquareIndex]);
          availableIndices = availableIndices.slice(0, redSquareIndex).concat(availableIndices.slice(redSquareIndex+1));
        }

        this.setState({
          squares: squares,
          selected : [25],
          blueCount: 9,
          redCount: 8,
          playerView: true,
          blueTurn: true,
          deathSquareIndex: deathSquareIndex,
          redSquaresIndices: redSquaresIndices,
          blueSquaresIndices: blueSquaresIndices
        }, () => {
          this.database.set({ game : this.state});
        });
      }
    })
  }

  componentWillUnmount(){
    this.app.delete();
  }

  handleClick(i) {
    if (!this.state.playerView || calculateWinner(this.state.blueSquaresIndices, this.state.redSquaresIndices, this.state.selected, this.state.blueTurn, this.state.deathSquareIndex)){
      return;
    }

    if ((this.state.blueTurn && !this.state.blueSquaresIndices.includes(i)) ||
      (!this.state.blueTurn && !this.state.redSquaresIndices.includes(i))) {
        this.setState({blueTurn: !this.state.blueTurn});
    }

    if (this.state.blueSquaresIndices.includes(i)){
      this.setState({blueCount: this.state.blueCount - 1});
    }

    if (this.state.redSquaresIndices.includes(i)){
      this.setState({redCount: this.state.redCount - 1});
    }

    this.setState({
      selected: this.state.selected.concat(i)
      }, () => {
        this.database.set({ game : this.state});
      })
    }

  toggleTurn(i){
    this.setState({blueTurn: !this.state.blueTurn}, () =>{
      this.database.set({game : this.state });
    });
  }

  resetBoard(){
      this.database.remove();
  }

  render() {
    let status;
    let resetButton;
    let fontColor = (this.state.blueTurn) ? '#0D47A1' : '#E53935';
    let color = (this.state.blueTurn) ? 'blue' : 'red';
    let winner = calculateWinner(this.state.blueSquaresIndices, this.state.redSquaresIndices, this.state.selected, this.state.blueTurn, this.state.deathSquareIndex);
    if (winner) {
      status = winner + ' wins!';
      resetButton = <Button style={{"width": "80%"}} fluid={true} onClick={()=>this.resetBoard()}>Reset Board for new game</Button>;
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
          <Grid verticalAlign={"top"} columns={16}>
            <Grid.Column width={3}>
              <Segment className="scoreboard" float={"left"} basic={true} compact={true}>
                <h2>Scoreboard</h2>
                <Progress total={9} value={9-this.state.blueCount} progress={"ratio"} color={"blue"}/>
                <Progress total={8} value={8-this.state.redCount} progress={"ratio"} color={"red"} style={{"marginTop" : "-32px"}}/>
                <div>
                  <h2><font color={fontColor}>{status}</font></h2>
                  <Button style={{"width": "80%"}} color={color} onClick={()=>this.setState({playerView : !this.state.playerView})}>Change to {view}</Button>
                </div>
                <div>
                  <Button style={{"width": "80%"}} fluid={true} onClick={()=>this.toggleTurn()}>Next Turn</Button>
                </div>
                <div>
                  {resetButton}
                </div>
              </Segment>
            </Grid.Column>
            <Grid.Column float={"right"} width={12} doubling={true}>
              <Board
                blueSquaresIndices = {this.state.blueSquaresIndices}
                redSquaresIndices = {this.state.redSquaresIndices}
                deathSquareIndex = {this.state.deathSquareIndex}
                onClick = {(i)=>this.handleClick(i)}
                selected = {this.state.selected}
                bank = {this.state.squares}
                playerView = {this.state.playerView}
              />
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }
}

function calculateWinner(blueSquares, redSquares, selectedSquares, blueTurn, deathSquareIndex){
  let winner = false;

  if (selectedSquares.includes(deathSquareIndex) && blueTurn){
    winner = 'Blue';
  } else if (selectedSquares.includes(deathSquareIndex) && !blueTurn){
    winner = 'Red';
  }

  if (blueSquares.every((currentValue)=>{return selectedSquares.includes(currentValue);})) {
      winner = 'Blue';
  } else if (redSquares.every((currentValue)=>{return selectedSquares.includes(currentValue);})) {
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

export default Game;
