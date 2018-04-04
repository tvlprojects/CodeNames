import React, { Component } from 'react';
import '../App.css';
import Square from './Square';

function Board (props){

  function renderSquare(index, word) {
      let highlightRed = props.redSquaresIndices.includes(index);
      let highlightBlue = props.blueSquaresIndices.includes(index);

      return (
        <Square
          key={index}
          value={word}
          onClick={() => props.onClick(index)}
          index={index}
          highlightBlue = {highlightBlue}
          highlightRed = {highlightRed}
          selected = {props.selected}
          deathSquareIndex = {props.deathSquareIndex}
          playerView = {props.playerView}
        />
      );
    }

    var rows = [];
    var cells = [];
    var cellNumber = 0;
    const bank = props.bank;

    for (let row = 0; row < 5; row++){
      for (let col = 0; col < 5; col++){
        cells.push(renderSquare(cellNumber, bank[cellNumber]));
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




export default Board;
