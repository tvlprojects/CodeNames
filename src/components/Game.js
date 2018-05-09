import React, { Component } from 'react';
import Board from './Board';
import { Container, Grid, Button, Progress, Segment, Card, Image, Divider, Input, Message } from 'semantic-ui-react';
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
      clueNumInput: "",
      clueInput: "",
      clueSubmitted: false,
      blueTeam: true,
      viewSelected: false,
      squares: [""],
      selected : [],
      blueCount: 9,
      redCount: 8,
      playerView: true,
      blueTurn: true,
      deathSquareIndex: 999,
      redSquaresIndices: [],
      blueSquaresIndices: []
    };

    this.updateInputClue = this.updateInputClue.bind(this);
    this.updateInputClueNum = this.updateInputClueNum.bind(this);
  }

  componentDidMount(){
    this.database.on('value', snap => {
      if (snap.val() && snap.val().game){
        const snapshot = snap.val().game;
        this.setState({
          squares: snapshot.squares,
          selected : snapshot.selected,
          blueCount: snapshot.blueCount,
          redCount: snapshot.redCount,
          blueTurn: snapshot.blueTurn,
          deathSquareIndex: snapshot.deathSquareIndex,
          redSquaresIndices: snapshot.redSquaresIndices,
          blueSquaresIndices: snapshot.blueSquaresIndices,
          clueSubmitted: snapshot.clueSubmitted,
          clue: snapshot.clue,
          clueNum: snapshot.clueNum
        });
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
          clueNumInput: "",
          clueInput: "",
          clueSubmitted: false,
          blueTurn: true,
          deathSquareIndex: deathSquareIndex,
          redSquaresIndices: redSquaresIndices,
          blueSquaresIndices: blueSquaresIndices
        }, () => {
          this.database.update({ game : this.state});
        });
      }
    })
  }

  componentWillUnmount(){
    this.app.delete();
  }

  handleClick(i) {
    const playerView = this.state.playerView;
    const clueSubmitted = this.state.clueSubmitted;
    const blueSquares = this.state.blueSquaresIndices;
    const redSquares = this.state.redSquaresIndices;
    const selected = this.state.selected;
    const blueTurn = this.state.blueTurn;
    const deathSquare = this.state.deathSquareIndex;
    const clueNum = this.state.clueNum-1;
    const blueTeam = this.state.blueTeam;

    /*
    * Disabled button when:
    * 1. Not the correct team's turn
    * 2. If the clue hasn't been submitted
    * 3. In spymaster view
    * 4. If a team has won
    */
    if ((blueTurn && !blueTeam) || (!blueTurn && blueTeam) || !clueSubmitted || !playerView || calculateWinner(blueSquares, redSquares, selected, blueTurn, deathSquare)){
      return;
    }

    if (clueNum===0){
        this.setState({blueTurn: !blueTurn, clueSubmitted: false});
    }

    if ((blueTurn && !blueSquares.includes(i)) ||
      (!blueTurn && !redSquares.includes(i))) {
        this.setState({blueTurn: !blueTurn, clueSubmitted: false});
    }

    if (blueSquares.includes(i)){
      this.setState({blueCount: this.state.blueCount - 1});
    }

    if (this.state.redSquaresIndices.includes(i)){
      this.setState({redCount: this.state.redCount - 1});
    }

    this.setState({
      selected: selected.concat(i),
      clueNum: clueNum
      }, () => {
        this.database.update({ game : this.state});
      })
    }

  toggleTurn(i){
    this.setState({blueTurn: !this.state.blueTurn, clueSubmitted: false}, () =>{
      this.database.update({game : this.state });
    });
  }

  resetBoard(){
      this.database.child("game").remove();
  }

  onClueSubmit(e){
    const clueNum = this.state.clueNumInput;
    const clue = this.state.clueInput;

    this.setState({
      clueSubmitted: true,
      clueInput: "",
      clueNumInput: "",
      clueNum: clueNum,
      clue: clue
    }, () => {
      this.database.update({game : this.state });
    });
    e.preventDefault();
  }

  updateInputClue(e) {
    const value = e.target.value
    this.setState({
      clueInput: value
    })
  }

  updateInputClueNum(e) {
    const value = e.target.value
    this.setState({
      clueNumInput: value
    })
  }

  render() {
    if (this.state.viewSelected) {
      const playerView = this.state.playerView;
      const blueSquares = this.state.blueSquaresIndices;
      const redSquares = this.state.redSquaresIndices;
      const selected = this.state.selected;
      const blueTurn = this.state.blueTurn;
      const deathSquare = this.state.deathSquareIndex;
      const squares = this.state.squares;
      const clueSubmitted = this.state.clueSubmitted;
      const blueTeam = this.state.blueTeam;
      const disabled = ((blueTurn && !blueTeam) || (!blueTurn && blueTeam));
      const fontColor = (blueTurn) ? '#0D47A1' : '#E53935';
      const color = (blueTurn) ? 'blue' : 'red';

      let status;
      let resetOrNext;

      let formOrClue = "";
      const winner = calculateWinner(blueSquares, redSquares, selected, blueTurn, deathSquare);
      if (winner) {
        status = winner + ' wins!';
        resetOrNext = <Button className="gameinfoBtn" floated="right" fluid={true} onClick={()=>this.resetBoard()}>Reset Board for new game</Button>;
        formOrClue = <h2>Game Over!</h2>
      } else {
        resetOrNext = <Button className="gameinfoBtn" disabled = {disabled} floated="right" fluid={true} onClick={()=>this.toggleTurn()}>Next Turn</Button>
        status = 'Current Turn: ' + (this.state.blueTurn ? 'Blue' : 'Red');

        if (!clueSubmitted) {
          if ((!playerView && blueTeam && blueTurn) || (!playerView && !blueTeam && !blueTurn)){
            formOrClue = (
              <div>
                <h2>Submit Clue</h2>
                <form onSubmit={(event)=>this.onClueSubmit(event)}>
                  <Input type="text" placeholder="Clue" size="small" fluid={true} value={this.state.clueInput} onChange={this.updateInputClue}/>
                  <Input type="number" min="1" max="9" placeholder="Number of Words"  fluid={true} value={this.state.clueNumInput} onChange={this.updateInputClueNum}/>
                  <Button fluid={true}>Submit</Button>
                </form>
              </div>
              )
            } else{
              formOrClue = <h2>Awaiting Clue...</h2>
            }
        } else {
          let header = `${this.state.clueNum} guess(es) left with ${this.state.clue.toUpperCase()} as the clue`;
          if (this.state.clueNum === "1"){
             header = `${this.state.clueNum} guess left with ${this.state.clue.toUpperCase()} as the clue`;
          }
          formOrClue = (
            <Grid.Column textAlign="center">
              <h2>Clue</h2>
              <Message
                className = "clue"
                color = {color}
                header={header}
              />
            </Grid.Column>
          )
        }
      }

      return (
        <div>
          <Container>
            <Segment inverted={true} color={color} textAlign={"center"}>
              <h1>
                Code Names
              </h1>
            </Segment>
            <Grid className="gameInfo" verticalAlign={"top"} centered={true}>
              <Grid.Row columns={3} verticalAlign={"top"} style={{"marginBottom" : "2px"}}>
                <Grid.Column>
                  <h2>Scoreboard</h2>
                  <Progress className="progressBar" total={9} value={9-this.state.blueCount} progress={"ratio"} color={"blue"}/>
                  <Progress className="progressBar" total={8} value={8-this.state.redCount} progress={"ratio"} color={"red"} style={{"marginTop" : "-34px"}}/>
                </Grid.Column>
                <Grid.Column textAlign="center">
                  {formOrClue}
                </Grid.Column>
                <Grid.Column floated={"right"} textAlign="right">
                  <h2><font color={fontColor}>{status}</font></h2>
                  {resetOrNext}
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Board
              blueSquaresIndices = {blueSquares}
              redSquaresIndices = {redSquares}
              deathSquareIndex = {deathSquare}
              onClick = {(i)=>this.handleClick(i)}
              selected = {selected}
              bank = {squares}
              playerView = {playerView}
            />
          </Container>
        </div>
      );
    } else {
      return (
        <div>
          <Container>
            <Segment inverted={true} textAlign="center">
              <h1>
                Code Names
              </h1>
            </Segment>
            <Grid textAlign={"center"} padded={"horizontally"}>
              <Grid.Row><h1>Pick Your Team and Role</h1></Grid.Row>
              <Grid.Row columns={5} stretched={true}>
                <Grid.Column>
                  <Card onClick={()=>this.setState({viewSelected: true, playerView: true, blueTeam: true})} floated={"left"} color="blue">
                    <Image src = 'https://appstickers-cdn.appadvice.com/1153735070/818875334/93fd18f6c12ea6344226f428d49878fe-3.png' size={"massive"}/>
                    <Card.Content>
                      <Card.Header className="cardHeader" textAlign="center">Agent</Card.Header>
                      <Card.Description className="cardDescription">The agent guesses based on the clues given</Card.Description>
                    </Card.Content>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card onClick={()=>this.setState({viewSelected: true, playerView: false, blueTeam: true})} floated={"left"} color="blue">
                    <Image src = 'https://appstickers-cdn.appadvice.com/1153735070/818875334/60df243593b6b5e4bf59bf1dce2aa5be-0.png' size={"massive"}/>
                    <Card.Content>
                      <Card.Header className="cardHeader" textAlign="center">Spymaster</Card.Header>
                      <Card.Description  className="cardDescription">The Spymaster gives clues to guess</Card.Description>
                    </Card.Content>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Divider vertical>Or</Divider>
                </Grid.Column>
                <Grid.Column>
                  <Card onClick={()=>this.setState({viewSelected: true, playerView: true, blueTeam: false})} floated={"right"} color="red">
                    <Image src = 'https://appstickers-cdn.appadvice.com/1153735070/818875334/5acc6c1edb020629f9bb6cea6bdabb0c-7.png' size={"massive"}/>
                    <Card.Content>
                      <Card.Header className="cardHeader" textAlign="center">Agent</Card.Header>
                      <Card.Description className="cardDescription">The agent guesses based on the clues given</Card.Description>
                    </Card.Content>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card onClick={()=>this.setState({viewSelected: true, playerView: false, blueTeam: false})} floated={"right"} color="red">
                    <Image src = 'https://appstickers-cdn.appadvice.com/1153735070/818875334/9e9f1a72fced69aa72d6202f06224f0b-4.png' size={"massive"}/>
                    <Card.Content>
                      <Card.Header className="cardHeader" textAlign="center">Spymaster</Card.Header>
                      <Card.Description className="cardDescription">The Spymaster gives clues to guess</Card.Description>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      );
    }
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
