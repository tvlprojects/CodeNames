import React from 'react';
import  { Button } from 'semantic-ui-react';

function Square (props){
  let clicked = props.selected.includes(props.index);
  let color;
  let style = {color: "black"};

  if (clicked) {
    style={};
    if (props.highlightBlue) {
      color = "blue";
    } else if (props.highlightRed) {
      color = "red";
    } else if (props.deathSquareIndex === props.index){
      color = "black";
      clicked = false;
    }
  } else if (!props.playerView) {
    if (props.highlightBlue){
      style={color: "#0D47A1"};
    } else if (props.highlightRed) {
      style={color: "#E53935"};
    } else if (props.deathSquareIndex === props.index) {
      style={color: "#FBC02D"};
    } else {
      style={color: "gray"}
    }
  }

  return (
    <Button className="btn" color={color} disabled={clicked} style={style} onClick={props.onClick}>
      <div>{props.value}</div>
    </Button>
  );

}

export default Square;
