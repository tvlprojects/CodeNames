import React, { Component } from 'react';
import { Container, Grid, Segment, Card, Image, Divider } from 'semantic-ui-react';

class ChooseTeam extends Component {

  render() {
    console.log(this.props);
    return (
      <div>
        <Container>
          <Segment inverted={true} textAlign="center">
            <h1>
              Code Names
            </h1>
          </Segment>
          <Grid textAlign={"center"} padded={"horizontally"}>
            <Grid.Row><h1>Pick Your Team and Role</h1></Grid.Row>
            <Grid.Row columns={5} stretched={true}>
              <Grid.Column>
                <Card onClick={()=>this.props.onClick(true, true, true)} floated={"left"} color="blue">
                  <Image src = 'https://appstickers-cdn.appadvice.com/1153735070/818875334/93fd18f6c12ea6344226f428d49878fe-3.png' size={"massive"}/>
                  <Card.Content>
                    <Card.Header className="cardHeader" textAlign="center">Agent</Card.Header>
                    <Card.Description className="cardDescription">The agent guesses based on the clues given</Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card onClick={()=>this.props.onClick(true, false, true)} floated={"left"} color="blue">
                  <Image src = 'https://appstickers-cdn.appadvice.com/1153735070/818875334/60df243593b6b5e4bf59bf1dce2aa5be-0.png' size={"massive"}/>
                  <Card.Content>
                    <Card.Header className="cardHeader" textAlign="center">Spymaster</Card.Header>
                    <Card.Description  className="cardDescription">The Spymaster gives clues to guess</Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Divider vertical>Or</Divider>
              </Grid.Column>
              <Grid.Column>
                <Card onClick={()=>this.props.onClick(true, true, false)} floated={"right"} color="red">
                  <Image src = 'https://appstickers-cdn.appadvice.com/1153735070/818875334/5acc6c1edb020629f9bb6cea6bdabb0c-7.png' size={"massive"}/>
                  <Card.Content>
                    <Card.Header className="cardHeader" textAlign="center">Agent</Card.Header>
                    <Card.Description className="cardDescription">The agent guesses based on the clues given</Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card onClick={()=>this.props.onClick(true, false, false)} floated={"right"} color="red">
                  <Image src = 'https://appstickers-cdn.appadvice.com/1153735070/818875334/9e9f1a72fced69aa72d6202f06224f0b-4.png' size={"massive"}/>
                  <Card.Content>
                    <Card.Header className="cardHeader" textAlign="center">Spymaster</Card.Header>
                    <Card.Description className="cardDescription">The Spymaster gives clues to guess</Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default ChooseTeam;
