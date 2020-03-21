import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Main from "Pages/Main";
import Layout from "Components/Layout";

import "./App.css";

function App() {
  // здесь нет прямой необходимости в роутере, только для приличия
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
