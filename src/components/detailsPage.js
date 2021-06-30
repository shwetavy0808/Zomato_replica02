import React from 'react';
import rectDom from "react-dom";
import '../styles/Details.css';
import queryString from 'query-string';//for capturing value from query string
import axios from 'axios';

class Details extends React.Component{

    //constructor
    constructor(){
        super();
        this.state={
           restaurant:{} //which is coming from backend ,findById() method check controller method of /restaurantbyid/:restaurantId
        }
    }

    componentDidMount(){
        //whenever user clicks on item It will navigate to details page and it passes _id to query string to
        //capturing value from query string
        const qs = queryString.parse(this.props.location.search);
        const restaurantId = qs.restId[0];//LHS should be same as whatever input coming in  handleNavigateToDetailsPage
                                       //RHS is same id which we are passing in url

        //call the /restaurantbyid/:restaurantId API 
        axios({
            method:'GET',
            url:`http://localhost:8970/app/restaurantbyid/${restaurantId}`,//${restaurantId},this will return me an obj .
                                                                          //So need to store obj {} in state by any name
            header : {'Content-Type' : 'application/json'}
        }) 
        .then(response=>this.setState({restaurant:response.data.restaurant}))
        .catch(err=>console.log(err))

    }
   
    render(){
        const { restaurant } = this.state;
        return(
            <div>
                {/*<div>{restaurant.name}</div>*/}
                 <nav className="nav navbar  navbar-dark bg-dark">
                       {/*Edureka Logo*/}
                       <div>
                           <b className="Edureka_logo">e!</b>
                       </div>
            
                         {/*Login and Creat Account Button*/}
                   <div className="Login-Act">
                        {/*Login Button*/}
                       <input className="login" type="button" value="Login" />
                        {/*Creat Account Button*/}
                       <input className="create-act" type="button" value="Create an account" />
                   </div>
                </nav>

            <div className="container">
             {/*row1*/}
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                      {/*Placing Background Image in Details Page*/}
                        <img src="assets/breakfast.png" style={{ width: "100%" , height: "480px" }} className="detailsPageBackgroundImage" />
                      {/*width: 1130px*/}

                </div>
            </div>

             {/*Click to see Image Gallery Button*/}
                    <button className="clickToSeeImageGalleryButton"  style={{borderColor: "#ffffff" }}>Click to see Image Gallery </button>

             {/*row2*/}
            <div className="row">
               
                <div className="col-lg-12 col-md-12 col-sm-12">
                     {/*The Big Chill Cakery Heading*/}
                    <div className="bigChillCakery">
                             <div>{/*The Big Chill Cakery */}{restaurant.name}</div>
                    </div>
                </div>
            </div>
            
             {/*row3*/}
                <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-4">
                    
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-4">
                        
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-4">
                     {/*Place Online Order*/}
                    <button className="placeOnlineOrderButton" style={{borderColor: "#ce0505"}}>Place Online Order</button>
                    </div>
                </div>

              {/*row4*/}
             <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                     {/*Overview and Contact*/}
                    <div>
        
                       <div style={{ display: "inline-block" }} className="overviewContact" >Overview</div>
                       <div style={{ display: "inline-block" }} className="overviewContact" >Contact</div>
         
                    </div>
                </div>
            </div>

             {/*row5*/}
             <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                        {/*hr*/}
                       <hr className="hr" /> 
                </div>
            </div>
            
             {/*row6*/}
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                     {/*About this place*/}
                    <div className="aboutThisPlace">About this place</div>
                </div>
            </div>

             {/*row7*/}
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                    <div>
                         {/*Cuisine*/}
                        <div className="cuisine">Cuisine</div>
             
                          {/*Bakery, Fast-food*/}
                          
                        <div className="bakeryFastFood"> {restaurant && restaurant.Cuisine ? restaurant.Cuisine.map((item)=>`${item.name}, `):null}</div>
                    </div>
                </div>
            </div>

             {/*row8*/}
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                    <div>
                         {/*Average Cost*/}
                        <div className="averageCost">Average Cost</div>
                
                         {/*₹700 for two people (approx.*/}
                        <div className="bakeryFastFood"> ₹700 for two people (approx.)</div>
                
                   </div>
                </div>
            </div>
        </div>
            </div>
            
          )
    }
}
export default Details;

//onClick of button url should change