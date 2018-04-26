import React, { Component } from 'react';
import './App.css';
import Game from './components/Game';
import Home from './components/Home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

class App extends Component {
  render(){
    return (
      <div>
        <BrowserRouter>
          <div>
            <Switch>
              <Route path="/:id" component = {Game}/>
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
