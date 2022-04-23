import './App.css';
import React from 'react';
import {angleCalc} from 'astronomy-bundle/utils';
import {createMoon} from 'astronomy-bundle/moon';
import { Wrapper, Status } from "@googlemaps/react-wrapper";

import Select from 'react-select';
import ReactDOM from 'react-dom/client';
import { Form, Button, FormGroup, FormControl, ControlLabel, Row, Col } from "react-bootstrap";

class App extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
        longitude: "",
        latitude: "",
        moonInfo : "",
        responseFlag : false,
        input_option : 0
        };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleOptionChange = this.handleOptionChange.bind(this);
      this.gpsDidMount = this.gpsDidMount.bind(this);
    }
    handleOptionChange(event){
        this.setState({option: event.value,responseFlag : false });
        
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
        var _moonInfo = 'distance is : ' + distance + "\n"+ 'delta is : ' + delta;

      event.preventDefault();
      this.setState({responseFlag: true,
        moonInfo : _moonInfo});
    }
 
    async gpsDidMount() {
        const moon = createMoon();
        const distance = await moon.getDistanceToEarth();
        const delta = await moon.getAngularDiameter();
        var _moonInfo = 'distance is : ' + distance + "\n"+ 'delta is : ' + delta;

        var _longitude;
        var _latitude;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            _longitude =position.coords.longitude;
            _latitude = position.coords.latitude;
            console.log(_longitude,_latitude)
 
          });
        }
       this.setState({
                longitude : _longitude,
                latitude : _latitude,
                moonInfo : _moonInfo,
                responseFlag : true });
      }
    render() {
        let inputOptions = [
            {value:1 , label: "GPS"},
            {value:2 , label: "Manual"}
        ];
    return (
        <div 
        style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            <Row>
                <Row>
                    <p> Please enter your input choice .... </p>
                <Select
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={this.handleOptionChange}
                        options={inputOptions}
                        />
                </Row>
                
                 { this.state.option == 2 ? 
                <Col md = {12} 
                    style={{
                            display: "flex",
                            justifyContent: "space-around",
                        }}>
                    <Form onSubmit={this.handleSubmit}>
                        <Row
                        >
                            Longitude:
                            <input 
                            type="text" 
                            name = "longitude" 
                            value={this.state.longitude} 
                            onChange={this.handleChange} />
                            </Row>
                        <Row
                             >
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
                </Col>
                : null }
                { this.state.option == 1 ? 
                    <Col md = {12}
                             style={{
                                height: '35px',
                                display: "flex",
                                justifyContent: "center",}}
                                >
                     <div >
                        <button onClick={this.gpsDidMount}>Get Location</button>
                    </div>
                </Col>
                         : null}
            </Row>
            <Row
                style={{
                    height: '35px',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                
                { this.state.responseFlag == true ? 
                    <div style={{
                        height: '35px', 
                        justifyContent: "center", 
                    }}>
                        <p>
                            Latitude is : {this.state.latitude} 
                        </p>
                        <p>
                            Longitude is :  {this.state.longitude}  
                        </p> 
                        <p>
                            Moon position is :  {this.state.moonInfo}  
                        </p> 
                    </div>
                : null 
                }
            </Row>
           </div>
           
      );
    }
  }

  export default App;