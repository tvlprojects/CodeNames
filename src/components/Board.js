import React, { Component } from 'react';
import '../App.css';
import Square from './Square';

class Board extends Component {

  renderSquare(index, word) {
    let highlightRed = this.props.redSquaresIndices.includes(index);
    let highlightBlue = this.props.blueSquaresIndices.includes(index);
    
    return (
      <Square
        key={index}
        value={word}
        onClick={() => this.props.onClick(index)}
        index={index}
        highlightBlue = {highlightBlue}
        highlightRed = {highlightRed}
        selected = {this.props.selected}
        deathSquareIndex = {this.props.deathSquareIndex}
        playerView = {this.props.playerView}
      />
    );
  }

  render() {
    var rows = [];
    var cells = [];
    var cellNumber = 0;
    const bank = this.props.bank;

    for (let row = 0; row < 5; row++){
      for (let col = 0; col < 5; col++){
        cells.push(this.renderSquare(cellNumber, bank[cellNumber]));
        cellNumber++;
      }
      rows.push(<div key={row} className="board-row">{cells}</div>);
      cells = [];

    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

export default Board;
