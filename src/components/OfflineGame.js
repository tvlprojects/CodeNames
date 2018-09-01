import React, { Component } from 'react';
import Board from './Board';
import Header from './Header';
import { Container, Grid, Button, Progress } from 'semantic-ui-react';
import firebase from 'firebase';
import { DB_CONFIG } from '../Config';

class OfflineGame extends Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.id;

    if (!firebase.apps.length) {
      this.app = firebase.initializeApp(DB_CONFIG);
      this.database = this.app
        .database()
        .ref()
        .child(`${this.id}`);
    }

    this.state = {
      squares: [''],
      selected: [25],
      blueCount: 9,
      redCount: 8,
      playerView: true,
      blueTurn: true,
      deathSquareIndex: 999,
      redSquaresIndices: [2],
      blueSquaresIndices: [1]
    };
  }

  /*
  * Pull the state from the database and set the state. Otherwise, create a new game
  */
  componentDidMount() {
    this.database.on('value', snap => {
      if (snap.val() && snap.val().offlineGame) {
        const snapshot = snap.val().offlineGame;
        this.setState({
          squares: snapshot.squares,
          selected: snapshot.selected,
          blueCount: snapshot.blueCount,
          redCount: snapshot.redCount,
          blueTurn: snapshot.blueTurn,
          deathSquareIndex: snapshot.deathSquareIndex,
          redSquaresIndices: snapshot.redSquaresIndices,
          blueSquaresIndices: snapshot.blueSquaresIndices
        });
      } else {
        const wordBank = require('./wordBank.js');
        const squares = shuffle(wordBank).slice(0, 25);
        let availableIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
        const deathSquareIndex = Math.floor(Math.random() * availableIndices.length);
        let blueSquaresIndices = [];
        let redSquaresIndices = [];

        availableIndices = availableIndices
          .slice(0, deathSquareIndex)
          .concat(availableIndices.slice(deathSquareIndex + 1));
        for (let i = 0; i < 9; i++) {
          let blueSquareIndex = Math.floor(Math.random() * availableIndices.length);
          blueSquaresIndices.push(availableIndices[blueSquareIndex]);
          availableIndices = availableIndices
            .slice(0, blueSquareIndex)
            .concat(availableIndices.slice(blueSquareIndex + 1));
        }

        for (let i = 0; i < 8; i++) {
          let redSquareIndex = Math.floor(Math.random() * availableIndices.length);
          redSquaresIndices.push(availableIndices[redSquareIndex]);
          availableIndices = availableIndices
            .slice(0, redSquareIndex)
            .concat(availableIndices.slice(redSquareIndex + 1));
        }

        this.setState(
          {
            squares: squares,
            selected: [25],
            blueCount: 9,
            redCount: 8,
            playerView: true,
            blueTurn: true,
            deathSquareIndex: deathSquareIndex,
            redSquaresIndices: redSquaresIndices,
            blueSquaresIndices: blueSquaresIndices
          },
          () => {
            this.database.update({ offlineGame: this.state });
          }
        );
      }
    });
  }

  /*
  * Closes the Database connection when closed
  */
  componentWillUnmount() {
    this.app.delete();
  }

  /*
  * For each square clicked:
  * 1. Check if we should disable the click and fast fail
  * 2. Check if the turn needs to change if clues run out or wrong square selected
  * 3. Add the clicked square to selected, then update the state and database
  */
  handleClick(i) {
    const playerView = this.state.playerView;
    const blueSquares = this.state.blueSquaresIndices;
    const redSquares = this.state.redSquaresIndices;
    const selected = this.state.selected;
    const blueTurn = this.state.blueTurn;
    const deathSquare = this.state.deathSquareIndex;

    if (!playerView || calculateWinner(blueSquares, redSquares, selected, blueTurn, deathSquare)) {
      return;
    }

    if ((blueTurn && !blueSquares.includes(i)) || (!blueTurn && !redSquares.includes(i))) {
      this.setState({ blueTurn: !blueTurn });
    }

    if (blueSquares.includes(i)) {
      this.setState({ blueCount: this.state.blueCount - 1 });
    }

    if (this.state.redSquaresIndices.includes(i)) {
      this.setState({ redCount: this.state.redCount - 1 });
    }

    this.setState(
      {
        selected: selected.concat(i)
      },
      () => {
        this.database.update({ offlineGame: this.state });
      }
    );
  }

  toggleTurn(i) {
    this.setState({ blueTurn: !this.state.blueTurn }, () => {
      this.database.update({ offlineGame: this.state });
    });
  }

  resetBoard() {
    this.database.child('offlineGame').remove();
  }

  render() {
    const playerView = this.state.playerView;
    const blueSquares = this.state.blueSquaresIndices;
    const redSquares = this.state.redSquaresIndices;
    const selected = this.state.selected;
    const blueTurn = this.state.blueTurn;
    const deathSquare = this.state.deathSquareIndex;
    const squares = this.state.squares;

    let status;
    let resetOrNext;
    let winner = calculateWinner(blueSquares, redSquares, selected, blueTurn, deathSquare);
    if (winner) {
      status = winner + ' wins!';
      resetOrNext = (
        <Button className="gameinfoBtn" floated="right" fluid={true} onClick={() => this.resetBoard()}>
          Reset Board for new game
        </Button>
      );
    } else {
      resetOrNext = (
        <Button className="gameinfoBtn" floated="right" fluid={true} onClick={() => this.toggleTurn()}>
          Next Turn
        </Button>
      );
      status = 'Current Turn: ' + (this.state.blueTurn ? 'Blue' : 'Red');
    }

    let view = this.state.playerView ? 'Spymaster View' : 'Player View';

    let fontColor = blueTurn ? '#0D47A1' : '#E53935';
    let color = blueTurn ? 'blue' : 'red';
    return (
      <div>
        <Container>
          <Header label="Code Names" color={color} />
          <Grid className="gameInfo" verticalAlign={'top'} centered={true}>
            <Grid.Row columns={3} verticalAlign={'top'} style={{ marginBottom: '2px' }}>
              <Grid.Column>
                <h2>Scoreboard</h2>
                <Progress
                  className="progressBar"
                  total={9}
                  value={9 - this.state.blueCount}
                  progress={'ratio'}
                  color={'blue'}
                />
                <Progress
                  className="progressBar"
                  total={8}
                  value={8 - this.state.redCount}
                  progress={'ratio'}
                  color={'red'}
                  style={{ marginTop: '-34px' }}
                />
              </Grid.Column>
              <Grid.Column floated={'right'} textAlign="right">
                <h2>
                  <font color={fontColor}>{status}</font>
                </h2>
                <Button
                  className="gameinfoBtn"
                  floated="right"
                  fluid={true}
                  color={color}
                  onClick={() => this.setState({ playerView: !playerView })}
                >
                  Change to {view}
                </Button>
                {resetOrNext}
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Board
            blueSquaresIndices={blueSquares}
            redSquaresIndices={redSquares}
            deathSquareIndex={deathSquare}
            onClick={i => this.handleClick(i)}
            selected={selected}
            bank={squares}
            playerView={playerView}
          />
        </Container>
      </div>
    );
  }
}

/*
* Determines the winner of the game if all squares for a team are selcted or if death square has been selected. Will lead to buttons being disabled.
*/
function calculateWinner(blueSquares, redSquares, selectedSquares, blueTurn, deathSquareIndex) {
  let winner = false;

  if (selectedSquares.includes(deathSquareIndex) && blueTurn) {
    winner = 'Blue';
  } else if (selectedSquares.includes(deathSquareIndex) && !blueTurn) {
    winner = 'Red';
  }

  if (
    blueSquares.every(currentValue => {
      return selectedSquares.includes(currentValue);
    })
  ) {
    winner = 'Blue';
  } else if (
    redSquares.every(currentValue => {
      return selectedSquares.includes(currentValue);
    })
  ) {
    winner = 'Red';
  }

  return winner;
}

/*
* Shuffles the available words
*/
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default OfflineGame;
