import React from "react";
import Grid from "@material-ui/core/Grid";
import Header from "./Header";
import Footer from "./Footer";
import Paper from "@material-ui/core/Paper";
const Main = ({ children }) => (
  <Paper elevation={3} style={{ background: "#d8d8d8" }}>
    <Header />
    <Grid container justify="center">
      <Grid item xs={12} sm={6} style={{ marginTop: 30 }}>
        {children}
      </Grid>
    </Grid>
    <Footer />
  </Paper>
);

export default Main;
