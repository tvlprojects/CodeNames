import React from 'react';
import '../App.css';
import Square from './Square';
import  { Grid } from 'semantic-ui-react';

function Board (props){

  function renderSquare(index, word) {
      let highlightRed = props.redSquaresIndices.includes(index);
      let highlightBlue = props.blueSquaresIndices.includes(index);

      return (
        <Grid.Column className="padded" key={index}>
          <Square
            value={word}
            onClick={() => props.onClick(index)}
            index={index}
            highlightBlue = {highlightBlue}
            highlightRed = {highlightRed}
            selected = {props.selected}
            deathSquareIndex = {props.deathSquareIndex}
            playerView = {props.playerView}
          />
        </Grid.Column>
      );
    }

    let rows = [];
    let cells = [];
    let cellNumber = 0;
    const bank = props.bank;

    for (let row = 0; row < 5; row++){
      for (let col = 0; col < 5; col++){
        cells.push(renderSquare(cellNumber, bank[cellNumber]));
        cellNumber++;
      }
      rows.push(<Grid.Row className="padded" key={row}>{cells}</Grid.Row>);
      cells = [];
    }

    return (
      <div>
        <Grid className="board" columns={5} centered={true} verticalAlign="bottom">
          {rows}
        </Grid>
      </div>
    );
}

export default Board;
