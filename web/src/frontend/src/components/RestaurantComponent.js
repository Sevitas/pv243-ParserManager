import React, {Component} from 'react';
import axios from 'axios'
import {NotificationManager} from "react-notifications"
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table"
import UnconfirmedParsersComponent from './UnconfirmedParsersComponent';

export default class RestaurantComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            restaurant: {googlePlaceID: this.props.match.params['googlePlaceID']},
            parsers: [],
            isLoading: false,
            error: null
        };

        this.fetchRestaurantData();
        this.fetchParserForRestaurant();
    }

    fetchRestaurantData() {
        this.setState({isLoading: true});

        axios.get("http://localhost:8080/ParserManager-rest/rest/restaurants/" + this.state.restaurant.googlePlaceID)
            .then(response => this.setState({restaurant: response.data, isLoading: false}))
            .catch(error => this.setState({error, isLoading: false}));
    }

    fetchParserForRestaurant(){
        this.setState({isLoading: true});

        axios.get("http://localhost:8080/ParserManager-rest/rest/restaurants/" + this.state.restaurant.googlePlaceID + "/parsers")
            .then(response => this.setState({parsers: response.data, isLoading: false}))
            .catch(error => this.setState({error, isLoading: false}));
    }

    insertRestaurant() {
        this.setState({isLoading: true});

        let restaurant = this.state.restaurant;

        const data = {"name": restaurant.name, "description": restaurant.description, "googlePlaceID": restaurant.googlePlaceID};

        axios.put("http://localhost:8080/ParserManager-rest/rest/restaurants", data)
            .then(response => {
                this.setState({restaurant: response.data, isLoading: false});
                NotificationManager.success("INFO", "Restaurant was updated", 3000);
            })
            .catch(error => this.setState({error, isLoading: false}));
    }

    render() {
        if (this.state.isLoading) {

            return <p>Loading ...</p>;
        }
        if (this.state.error) {

            return <p>{this.state.error.message}</p>;
        }
        let restaurant = this.state.restaurant;

        return <div>
            <form>
            <div>{this.googlePlaceID}</div>
            <label htmlFor={"name"}>Name</label>

            <input type={"text"} id={"name"}
                   value={this.state.restaurant.name}
                   onChange={(e) => {
                       restaurant.name = e.target.value;
                       this.setState({restaurant})
                   }}
            />

            <label htmlFor={"description"}>Description</label>

            <input type={"text"} id={"description"}
                   value={this.state.restaurant.description}
                   onChange={(e) => {
                       restaurant.description = e.target.value;
                       this.setState({restaurant});
                   }}/>

            <input type={"submit"}
                   value={"Send"}
                   onClick={(e) => {
                       e.preventDefault();
                       NotificationManager.info("INFO", "Updating restaurant", 3000);
                       this.insertRestaurant();
                   }}
            />
        </form>
            <BootstrapTable data={this.state.parsers}
                            options={{
                                noDataText: 'No unconfirmed parsers',
                                paginationSize: 1
                            }} pagination>
                <TableHeaderColumn width={150} dataField='id' isKey>Parser ID</TableHeaderColumn>
                <TableHeaderColumn width={150} dataField='xpath'
                                   dataFormat={UnconfirmedParsersComponent.xpathFormater}>XPath</TableHeaderColumn>
                <TableHeaderColumn width={150} dataField='day'>Day</TableHeaderColumn>
            </BootstrapTable>
        </div>

    }

}