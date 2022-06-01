import React, { Component } from "react";
import PhotoContextProvider from "./context/PhotoContext";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Header from "./components/Header";
import Item from "./components/Item";
import Search from "./components/Search";
import NotFound from "./components/NotFound";

/* Imports PubNub JavaScript and React SDKs to create and access PubNub instance accross your app. */
/* Imports the required PubNub Chat Components to easily create chat apps with PubNub. */
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import {
  Chat,
  MessageList,
  MessageInput,
  TypingIndicator,
} from "@pubnub/react-chat-components";

const pubnub = new PubNub({
  publishKey: "pub-c-8c450fdf-6bc0-48e8-8e62-2f8678606a5d",
  subscribeKey: "sub-c-b607242a-f672-4b42-b31c-f30e2aa416ac",
  uuid:
    "user-" +
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 5),
});

const currentChannel = "chat";
const theme = "light";

class App extends Component {
  // Prevent page reload, clear input, set URL and push history on submit
  handleSubmit = (e, history, searchInput) => {
    e.preventDefault();
    e.currentTarget.reset();
    let url = `/search/${searchInput}`;
    history.push(url);
  };

  render() {
    return (
      <PhotoContextProvider>
        <HashRouter basename="/SnapScout">
          <div className="container">
            <Route
              render={(props) => (
                <Header
                  handleSubmit={this.handleSubmit}
                  history={props.history}
                />
              )}
            />
            <Switch>
              <Route
                exact
                path="/"
                render={() => <Redirect to="/mountain" />}
              />

              <Route
                path="/mountain"
                render={() => <Item searchTerm="mountain" />}
              />
              <Route path="/beach" render={() => <Item searchTerm="beach" />} />
              <Route path="/bird" render={() => <Item searchTerm="bird" />} />
              <Route path="/food" render={() => <Item searchTerm="food" />} />
              <Route
                path="/search/:searchInput"
                render={(props) => (
                  <Search searchTerm={props.match.params.searchInput} />
                )}
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        </HashRouter>
        <PubNubProvider client={pubnub}>
          <Chat {...{ currentChannel, theme }}>
            <div>
              <MessageList fetchMessages={10}>
                <TypingIndicator showAsMessage />
              </MessageList>
              <MessageInput typingIndicator />
            </div>
          </Chat>
        </PubNubProvider>
      </PhotoContextProvider>
    );
  }
}

export default App;
