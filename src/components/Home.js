import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import  { Container, Segment, Button } from 'semantic-ui-react';

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
      <Container>
        <Segment inverted={true} textAlign="center">
          <h1>
            Code Names
          </h1>
        </Segment>
        <div>
          Enter Game id here:
          <input
                type='text'
                placeholder='Game ID'
                value={this.state.input}
                onChange={this.updateInput}
              />
            <Link to={`/${this.state.input}`}><Button>Submit</Button></Link>
          </div>
        </Container>
      </div>
    );
  }
}

export default Home;
