import React, { Component } from 'react';
import './App.css';
import Game from './components/Game';
import OfflineGame from './components/OfflineGame';
import Home from './components/Home';
import { HashRouter, Route, Switch } from 'react-router-dom';

class App extends Component {

  render(){
    return (
      <div>
        <HashRouter>
          <div>
            <Switch>
              <Route path="/:id/offline/" component= {OfflineGame} />
              <Route path="/:id" component = {Game} />
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </HashRouter>
      </div>
    )
  }
}

export default App;
