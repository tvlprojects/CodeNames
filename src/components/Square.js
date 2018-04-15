import React from 'react';

function Square (props){
  let clickedIndex = props.selected.has(props.index);
  if (clickedIndex) {
    if (props.highlightBlue){
      return (
        <button className="btn" style={{background: "#3366FF", color: "white"}} onClick={props.onClick}>
          {props.value}
        </button>
      );
    } else if (props.highlightRed){
        return (
          <button className="btn" style={{background: "#CC3333", color: "white"}} onClick={props.onClick}>
            {props.value}
          </button>
        );
    } else if (props.deathSquareIndex === props.index){
        return (
          <button className="btn" style={{background: "black", color: "white"}} onClick={props.onClick}>
            GAME OVER
          </button>
        );
    } else {
      return (
        <button className="btn" style={{background:"gray", color: "white"}} onClick={props.onClick}>
          {props.value}
        </button>
      );
    }
  } else if (!props.playerView) {
    if (props.highlightBlue){
      return (
        <button className="btn" style={{color: "#3366FF"}} onClick={props.onClick}>
          {props.value}
        </button>
      );
    } else if (props.highlightRed){
        return (
          <button className="btn" style={{color: "#ff6666"}} onClick={props.onClick}>
            {props.value}
          </button>
        );
    } else if (props.deathSquareIndex === props.index){
        return (
          <button className="btn" style={{color: "orange"}} onClick={props.onClick}>
            {props.value}
          </button>
        );
    } else {
      return (
        <button className="btn" style={{color: "gray"}} onClick={props.onClick}>
          {props.value}
        </button>
      );
    }
  } else {
    return (
      <button className="btn" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

}

export default Square;
