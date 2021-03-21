require('dotenv').config()
import {Request, Response} from "express"
import {Step} from './clientTypes'

const express = require("express");
const bodyParser = require("body-parser");
const {
  makeTinkProcess,
  getFeedback,
  fetchGraphQL,
} = require('./utils')


const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/submitFeedback', async (req: Request, res: Response) => {  
  const feedbackInput = req.body.input.feedback
  let tinkID;
  const description: String = feedbackInput.description
  if (feedbackInput.steps) {
    const steps: Step[] = feedbackInput.steps
  
    tinkID = await makeTinkProcess(steps)
  }
  const feedbackID = await getFeedback(description, tinkID)

  return res.json({
    id: feedbackID
  })
})

app.post('/makeTink', async (req: Request, res: Response) => {  
  const steps: Step[] = req.body.input.steps

  const tinkID = await makeTinkProcess(steps);

  return res.json({
    id: tinkID
  })
})

app.listen(PORT);

export {}