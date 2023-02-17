import React from "react";
import { Container, Paper, Typography } from "@mui/material";
import { ProgressionDescriptorForm } from "./ProgressionDescriptorForm";

function App() {
  return (
    <Container className="pt-10">
      <Paper className="p-5">
        <Typography variant="h4" className="pb-4">
          Chord Progression Transcriber for Open-Ear
        </Typography>
        <ProgressionDescriptorForm />
      </Paper>
    </Container>
  );
}

export default App;
