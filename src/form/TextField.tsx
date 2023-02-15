// TODO: generalize this wrapper to work with other material UI components
import { Input } from "@mui/material";
import React from "react";
import { MUIFormControlWrapper } from "./MUIFormControlWrapper";

export const TextField = MUIFormControlWrapper(Input);
