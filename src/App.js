import React, { Component } from "react"
import moment from "moment"

import "bootstrap/dist/css/bootstrap.css"
import "font-awesome/css/font-awesome.css"

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom"

import DayView from "./components/views/DayView"
import OrderView from "./components/views/OrderView"

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/:year/:month/:day" component={DayView} />
          <Route path="/order" component={OrderView} />
          <Redirect to={moment().format("/YYYY/MM/DD")}/>
        </Switch>
      </Router>
    )
  }
}

/*
var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
const oscillator = audioCtx.createOscillator()
const gainNode = audioCtx.createGain()

oscillator.connect(gainNode)
gainNode.connect(audioCtx.destination)

const scale = [440, 466.16, 493.88, 523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61]
var i = 0

const getFrequency = (i) => (scale[i % scale.length])
oscillator.type = 'sine'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
oscillator.frequency.value = scale[i]; // value in hertz
oscillator.start();

setInterval(() => {
  i += 1
  oscillator.frequency.value = getFrequency(i)
  //gainNode.gain.value += 0.1
}, 100)
*/

export default App