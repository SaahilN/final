import React from 'react';
import { ListView, StyleSheet, View } from 'react-native';
import { Body, Title, Right, Container, Header, Content, Button, Icon, List, ListItem, Text, Card, CardItem } from 'native-base';

export default class App extends React.Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      ideas: []
    }
  }

  // Retrieve the list of ideas from Airtable
  getIdeas() {
    // Airtable API endpoint, replace with your own
    let airtableUrl = "https://api.airtable.com/v0/appoZj2h1H8vMio4M/ideas";

    // Needed for Airtable authorization, replace with your own API key
    let requestOptions = {
      headers: new Headers({
        'Authorization': 'Bearer keyKE1bAPVzgmNZuA'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.setState({
        ideas: json.records
      });
    });
  }

  // Runs when the application loads (i.e. the "App" component "mounts")
  componentDidMount() {
    this.getIdeas(); // refresh the list when we're done
  }
  async componentWillMount() {
  await Expo.Font.loadAsync({
  Roboto: require("native-base/Fonts/Roboto.ttf"),
  Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
  Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
  });
  this.setState({ isReady: true });
  }

  // Upvote an idea
  upvoteIdea(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appoZj2h1H8vMio4M/ideas/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyKE1bAPVzgmNZuA', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          exercises: data.fields.exercises + 1
        }
      })
    };

    // Form the request
  let request = new Request(airtableUrl, requestOptions);

  // Make the request
  fetch(request).then(response => response.json()).then(json => {
    this.getIdeas(); // refresh the list when we're done
  });
}

  // Downvote an idea
  downvoteIdea(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appoZj2h1H8vMio4M/ideas" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyKE1bAPVzgmNZuA', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          exercises: data.fields.exercises - 1
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getIdeas(); // refresh the list when we're done
    });
  }

  // Ignore an idea
  ignoreIdea(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Create a new array that has the idea removed
    let newIdeasData = this.state.ideas.slice();
    newIdeasData.splice(rowId, 1);

    // Set state
    this.setState({
      ideas: newIdeasData
    });
  }

  // Delete an idea
  deleteIdea(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Create a new array that has the idea removed
    let newIdeasData = this.state.ideas.slice();
    newIdeasData.splice(rowId, 1);

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appoZj2h1H8vMio4M/ideas" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': 'Bearer keyKE1bAPVzgmNZuA', // replace with your own API key
        'Content-type': 'application/json'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getIdeas(); // refresh the list when we're done
    });
  }

  // The UI for each row of data
  renderRow(data) {
    return (
      <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Body>
          <Text>{data.fields.description}</Text>
        </Body>
        <Right>
          <Text note>{data.fields.exercises} </Text>
        </Right>
      </ListItem>
    )
  }
  // The UI for what appears when you swipe right

  renderSwipeRight(data, secId, rowId, rowMap) {
    return (
      <Button full success onPress={() => this.upvoteIdea(data, secId, rowId, rowMap)}>
        <Icon active name="arrow-up" />
      </Button>
    )
  }

  // The UI for what appears when you swipe left
  renderSwipeLeft(data, secId, rowId, rowMap) {
    return (
      <Button full danger onPress={() => this.downvoteIdea(data, secId, rowId, rowMap)}>
        <Icon active name="arrow-down" />
      </Button>
    )
  }

  render() {
    if (this.state.isReady) {
      let rows = this.ds.cloneWithRows(this.state.ideas);
      return (
        <Container>
          <Header>
            <Body>
              <Title>Triathlon Trainer</Title>
            </Body>
          </Header>
          <Content>
            <Card>
              <CardItem>
                <Body>
                  <Text>
                     This Triathlon trainer schedule lays out innovative standard and alternative exercises to enable you to complete a Triathlon with flying results.                                                                                                                                     Simply, click on arrow up and down to track your exercises. We recommend that you do 5 of the workouts a week to complete a triathlon successfully.                                          May the force be with you!
                  </Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
          <Content>
            <List
              dataSource={rows}
              renderRow={(data) => this.renderRow(data)}
              renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeRight(data, secId, rowId, rowMap)}
              renderRightHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeLeft(data, secId, rowId, rowMap)}
              leftOpenValue={75}
              rightOpenValue={-75}
            />
          </Content>
        </Container>
      );
    } else {
      return (
        <Text>Loading...</Text>
      )
    }
  }
}
