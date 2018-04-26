import React from 'react';
import  { Button } from 'semantic-ui-react';

function Square (props){
  let clickedIndex = props.selected.includes(props.index);
  if (clickedIndex) {
    if (props.highlightBlue){
      return (
        <Button className="btn" color={"blue"} disabled={true} onClick={props.onClick}>
          {props.value}
        </Button>
      );
    } else if (props.highlightRed){
        return (
          <Button className="btn" color={"red"} disabled={true} onClick={props.onClick}>
            {props.value}
          </Button>
        );
    } else if (props.deathSquareIndex === props.index){
        return (
          <Button className="btn" color={"black"} onClick={props.onClick}>
            {props.value}
          </Button>
        );
    } else {
      return (
        <Button className="btn" disabled={true} onClick={props.onClick}>
          {props.value}
        </Button>
      );
    }
  } else if (!props.playerView) {
    if (props.highlightBlue){
      return (
        <Button className="btn" style={{color: "#0D47A1"}} onClick={props.onClick}>
          {props.value}
        </Button>
      );
    } else if (props.highlightRed){
        return (
          <Button className="btn" style={{color: "#E53935"}} onClick={props.onClick}>
            {props.value}
          </Button>
        );
    } else if (props.deathSquareIndex === props.index){
        return (
          <Button className="btn" style={{color: "#FBC02D"}} onClick={props.onClick}>
            {props.value}
          </Button>
        );
    } else {
      return (
        <Button className="btn" style={{color: "gray"}} onClick={props.onClick}>
          {props.value}
        </Button>
      );
    }
  } else {
    return (
      <Button className="btn unclicked" style={{color: "black"}} onClick={props.onClick}>
        {props.value}
      </Button>
    );
  }

}

export default Square;
