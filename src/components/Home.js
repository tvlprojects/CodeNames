import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import  { Container, Segment, Button, Input, Grid  } from 'semantic-ui-react';

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
       <Button.Group>
        <Link to={`/${this.state.input}`}><Button size="massive">Enter Online</Button></Link>
        <Link to={`/offline/${this.state.input}`}><Button size="massive">Enter Offline</Button></Link>
       </Button.Group>
    );

    return (
      <div>
        <Container >
          <Segment inverted={true} textAlign="center">
            <h1>
              Code Names
              </h1>
          </Segment>
          <Grid centered={true} padded={"horizontally"}>
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
                  action={submit}
                  type='text'
                  size="massive"
                  placeholder='Game Id'
                  value={this.state.input}
                  onChange={this.updateInput}
                />
              </Grid.Row>
            </form>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default Home;
