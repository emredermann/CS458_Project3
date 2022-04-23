import './App.css';
import React from 'react';
import {angleCalc} from 'astronomy-bundle/utils';
import {createMoon} from 'astronomy-bundle/moon';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Geocode from "react-geocode";
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
        countryText : "",
        responseFlag : false,
        input_option : 0,
        distanceNorthPole : 0,
        };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleOptionChange = this.handleOptionChange.bind(this);
      this.gpsDidMount = this.gpsDidMount.bind(this); 
      this.showPosition = this.showPosition.bind(this); 
      this.distance = this.distance.bind(this); 
    
    //   this.latitudeSetter = this.latitudeSetter.bind(this);
    //   this.longitudeSetter = this.longitudeSetter.bind(this);

    }
    handleOptionChange(event){
        this.setState({longitude: "",latitude : ""});
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
    distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var radlon1 = Math.PI * lon1/180
        var radlon2 = Math.PI * lon2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist
    }

    async handleSubmit(event) {
        Geocode.setApiKey("AIzaSyAvs-JNQhhyMi38iNEmRe45ehldcnSNce8");
        Geocode.setLanguage("en");
        Geocode.setLocationType("ROOFTOP");
        const moon = createMoon();
        const distance = await moon.getDistanceToEarth();
        const delta = await moon.getAngularDiameter();
        var _moonInfo = 'distance is : ' + distance + "\n"+ 'delta is : ' + delta;
        var _countryText;
       var _distanceNorthPole = this.distance(this.state.latitude,this.state.longitude,90,0);

        Geocode.fromLatLng(this.state.latitude, this.state.longitude).then(
            (response) => {
              const address = response.results[0].formatted_address;
              console.log(address);
              _countryText = address;
            },
            (error) => {
              console.error(error);
            }
          );

      event.preventDefault();
      this.setState({responseFlag: true,
        distanceNorthPole : _distanceNorthPole,
        moonInfo : _moonInfo,
        countryText : _countryText});
    }
    
    showPosition(position) {
        var _longitude;
        var _latitude;
        _longitude = position.coords.longitude;
        _latitude = position.coords.latitude;
        this.setState({
            longitude : _longitude,
            latitude : _latitude });
      }

    async gpsDidMount() {
        const moon = createMoon();
        const distance = await moon.getDistanceToEarth();
        const delta = await moon.getAngularDiameter();
        var _moonInfo = 'distance is : ' + distance + "\n"+ 'delta is : ' + delta;
        var _longitude;
        var _latitude;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition) ;
        }
       var _distanceNorthPole = this.distance(this.state.latitude,this.state.longitude,90,0);
       this.setState({
                moonInfo : _moonInfo,
                responseFlag : true,
                distanceNorthPole : _distanceNorthPole
            });
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
                            Location is  :  {this.state.countryText}  
                        </p> 
                        <p>
                            Distance to NorthPole is  :  {this.state.distanceNorthPole} km.  
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