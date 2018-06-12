import React, { Component } from 'react';
import './App.css';
import Game from './components/Game';
import OfflineGame from './components/OfflineGame';
import Home from './components/Home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

class App extends Component {

  render(){
    return (
      <div>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <div>
            <Switch>
              <Route path="/:id/offline/" component= {OfflineGame} />
              <Route path="/:id" component = {Game} />
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
