import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      input: '',
    }

    this.updateInput = this.updateInput.bind(this);
  }

  updateInput(e) {
    const value = e.target.value
    this.setState({
      input: value
    })
  }

  render() {
    return (
      <div>
        Enter Game id here:
        <input
              type='text'
              placeholder='Game ID'
              value={this.state.input}
              onChange={this.updateInput}
            />
        <Link to={`/${this.state.input}`}><button>Submit</button></Link>
      </div>
    );
  }
}

export default Home;
