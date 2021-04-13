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

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.post('/test', async (req: Request, res: Response) => {
  return res.json({hello: "hi"})
})

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
const generateScript = require('./scriptGenerator')
app.post('/scrapeTink', async (req: Request, res: Response) => {
  console.log('=========RB========\n'+req.body+'\n=========RB========')
  console.log('=========S========\n'+req.body.input.steps+'\n=========S========')
  const steps: Step[] = req.body.input.steps
  const scriptGenerated = generateScript(steps, 'puppeteer')
  console.log('=========GS========\n'+scriptGenerated+'\n=========GS========')
})

app.listen(PORT);

export {}