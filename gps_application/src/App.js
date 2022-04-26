import './App.css';
import React from 'react';
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
        countryText : "Not in a country",
        responseFlag : false,
        gpsFlag : false,
        input_option : 0,
        distanceNorthPole : 0,
        totalReactPackages : "",
        message_area : ""
        };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleOptionChange = this.handleOptionChange.bind(this);
      this.gpsDidMount = this.gpsDidMount.bind(this); 
      this.showPosition = this.showPosition.bind(this); 
      this.showError = this.showError.bind(this); 
      this.distance = this.distance.bind(this); 
    }

    handleOptionChange(event){
        this.setState({longitude: "",latitude : "",message_area : ""});
        this.setState({option: event.value,responseFlag : false });
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        if(name === "longitude"){
            if( value >= -180 && value <= 180 || value === '-'){
            this.setState({longitude: value,responseFlag: false,message_area:""});
          }else{
            this.setState({message_area: "Longitude must be between 180 and -180"});
          }
        }
        if(name === "latitude"){
          if( value >= -90 && value <= 90 || value === '-'){
            this.setState({latitude: value, responseFlag: false,message_area:""});
          }else{
            this.setState({message_area: "Latitude must be between 90 and -90"});
          }
          console.log(value)
        }
    }

    country(lat, lon){
        fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&result_type=country&key=AIzaSyDK_V9tKd2J66z2-T-AJzy6OLh0X8AM8Oc") .then((response) => {
            response.json().then((data) => {
                if(data.status === "ZERO_RESULTS"){
                    this.setState({
                        countryText : "in the Sea probably."
                    });
                    return data;
                }
                console.log(data);
                let country = data.results[0].formatted_address;
                this.setState({
                    countryText : country,
                })
                return data;
            }).catch((err) => {
                console.log(err);
            })
        });
    }

    distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist.toFixed(2)
    }

    async handleSubmit(event) {
    if(this.state.latitude === "" || this.state.longitude === ""){
        this.setState({latitude : "", longitude : "", message_area: "Input can't be empty"})
        event.preventDefault()
    }else{
            const moon = createMoon();
            const distance = await moon.getDistanceToEarth();
            const delta = await moon.getAngularDiameter();
            var _moonInfo = 'distance is : ' + distance + "\n" + 'delta is : ' + delta;
            var _distanceNorthPole = this.distance(this.state.latitude, this.state.longitude, 90, 0);
            this.country(this.state.latitude, this.state.longitude);
            event.preventDefault();
            this.setState({
                responseFlag: true,
                distanceNorthPole: _distanceNorthPole,
                moonInfo: _moonInfo
            });
        }
    }
    
    showPosition(position) {
        var _longitude;
        var _latitude;
        _longitude = position.coords.longitude;
        _latitude = position.coords.latitude;
        this.country(_latitude, _longitude)
        console.log(_latitude,_longitude);
        this.setState({
            message_area: "",gpsFlag : false,
            longitude : _longitude,
            latitude : _latitude });
      }
      showError(error) {
        this.setState({message_area: "GPS is not active !!",gpsFlag : true});
      }

      
    async gpsDidMount() {
        const moon = createMoon();
        const distance = await moon.getDistanceToEarth();
        // const delta = await moon.getAngularDiameter();
        var _moonInfo = 'distance is : ' + distance + "\n";
        console.log(navigator.geolocation == "object")
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
            navigator.geolocation.watchPosition(this.showPosition,this.showError);
            this.setState({message_area: "", gpsFlag : false});
        }else{
            this.setState({message_area: "GPS is not active !!", gpsFlag : true});
        }
       var _distanceNorthPole = this.distance(parseFloat(this.state.latitude), parseFloat(this.state.longitude),90,0);

        this.setState({
                moonInfo : _moonInfo,
                responseFlag : true,
                distanceNorthPole : _distanceNorthPole,
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
                <Select id="input_choice_select"
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
                        <Row>
                            Latitude:
                            <input id="latitude_input"
                            type="text" 
                            name = "latitude" 
                            value={this.state.latitude} 
                            onChange={this.handleChange} />
                        </Row>
                        <Row>
                            Longitude:
                            <input id="longitude_input"
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
                            <input id="manual_submit" type="submit" value="Submit" />
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
                        <button id="auto_submit" onClick={this.gpsDidMount}>Get Location</button>
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
                    { this.state.gpsFlag === true ?
                        <div>
                        <p>
                        </p>
                        </div>
                        :
                        <div>
                        <p id="lat_text">
                            Latitude is : {this.state.latitude} 
                        </p>
                        <p id="lng_text">
                            Longitude is :  {this.state.longitude}  
                        </p> 
                        <p id="loc_text">
                            Location is  :  {this.state.countryText}
                        </p>
                        <p id="moon_text">
                            From our point to the Moon the {this.state.moonInfo} km.
                        </p>
                        <p id="pole_text">
                            Distance to NorthPole is  :  {this.state.distanceNorthPole} km.
                        </p> 
                        </div>
                }
                    </div>
                : null 
                }
                    <p id="error_msg">
                           {this.state.message_area}
                    </p>
            </Row>
           </div>
           
      );
    }
  }

  export default App;