import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import  { Container, Button, Input, Grid  } from 'semantic-ui-react';
import Header from './Header';

class Home extends Component {
  constructor(props) {
    super(props);

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
    const submit = (
      <Container text>
        <Link to={`/${this.state.input}`}><Button size="massive" fluid={true} primary={true}>Enter Online</Button></Link>
        <Link to={`/offline/${this.state.input}`}><Button size="massive" fluid= {true}>Enter Offline</Button></Link>
      </Container>
    );

    return (
      <div>
        <Container >
          <Header label = "Code Names" color = "black"/>
          <Grid centered={true} padded={"horizontally"} stackable={true}>
            <form>
              <Grid.Row>
                <Container text textAlign={"justified"}>
                  <h2>
                    Welcome to Code Names!
                    This app allows you to play Code Names with your friends online across multiple devices while sharing one board!
                    Please enter a unique game id below to begin.
                  </h2>
                </Container>
              </Grid.Row>
              <Grid.Row>
                <Input
                  fluid={true}
                  type='text'
                  size="massive"
                  placeholder='Game Id'
                  value={this.state.input}
                  onChange={this.updateInput}
                />

              </Grid.Row>
              {submit}
            </form>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default Home;
