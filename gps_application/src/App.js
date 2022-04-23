import './App.css';
import React from 'react';
import {angleCalc} from 'astronomy-bundle/utils';
import {createMoon} from 'astronomy-bundle/moon';


import ReactDOM from 'react-dom/client';
import { Form, Button, FormGroup, FormControl, ControlLabel, Row } from "react-bootstrap";

class App extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
        longitude: "",
        latitude: "",
        responseFlag : false,
        };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        if(name == "longitude")
            this.setState({longitude: value,responseFlag: false});
        if(name == "latitude")
            this.setState({latitude: value,responseFlag: false});
    }
   
    async handleSubmit(event) {
        const moon = createMoon();
        const distance = await moon.getDistanceToEarth();
        const delta = await moon.getAngularDiameter();

      alert('distance is : ' + distance + "\n"+
      'delta is : ' + delta
      );
      event.preventDefault();
      this.setState({responseFlag: true});
    }
  
    render() {
     
    return (
        <div 
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            <Row>
                <Form onSubmit={this.handleSubmit}>
                    <Row
                    style={{
                        height: '35px',
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        Longitude:
                        <input 
                        type="text" 
                        name = "longitude" 
                        value={this.state.longitude} 
                        onChange={this.handleChange} />
                        </Row>
                    <Row
                        style={{
                            height: '35px',
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        Latitude:
                        <input 
                        type="text" 
                        name = "latitude" 
                        value={this.state.latitude} 
                        onChange={this.handleChange} />
                    </Row>
                    <Row
                        style={{
                            height: '35px',
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <input type="submit" value="Submit" />
                    </Row>
                </Form>
            </Row>
            
            <Row
                style={{
                    height: '35px',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                
                { this.state.responseFlag ? 
        
                    <p>
                        Latitude is : {this.state.latitude}  Longitude is :  {this.state.longitude}  
                    </p> 
                
                : null 
                }
            </Row>
           </div>
           
      );
    }
  }

  export default App;