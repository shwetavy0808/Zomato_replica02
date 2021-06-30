import React from 'react';
import '../styles/wallpaper.css';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

class Wallpaper extends React.Component{
    constructor(){
        super();
        this.state={
            restaurants : [],
            suggestions : [],
            searchText: undefined,
           
        }
    }


    // as soon as user select location need to call an API => /restaurantsbylocation
    handleLocationChange=(event)=>{

        const locationId = event.target.value;
        sessionStorage.setItem('locationId',locationId);
        
        //RestaurantbyLocatio API
        axios({
            method:'GET',
            url:`http://localhost:8970/app/restaurantsbylocation/${locationId}`,
            headers:{'Content-Type':'application/json'}
        })
        .then(response=>this.setState({ restaurants:response.data.restaurant}))
        .catch(err=>console.log(err))
    }  
    
    handleItemClick=(item)=>{
        this.props.history.push(`/details?restId=${item._id}`)
    }



    handleSearch = (event) => {
         //destructure the restaurant (for RestaurantbyLocatio API to bind restro below search bar)
         const { restaurants } = this.state;
        //capturing search text
        const searchText = event.target.value;//here target is input field
         let filteredRestro;
         if(searchText == ""){
            filteredRestro = [];
         }
         else{
            filteredRestro =  restaurants.filter(item=>item.name.toLowerCase().includes(searchText.toLowerCase()));
         }

        //below name is key in restaurant collection (name:restaurant name)
        this.setState({suggestions : filteredRestro});
    }

    renderSuggestions =() =>{
        let { suggestions, searchText } = this.state;
        
        //If no suggestions then return no match found
        if (suggestions.length === 0 && searchText) {
            return (
                <ul className="suggestions" >
                    <li className="liSuggestions">No Match Found</li>
                </ul>
            )
        }
        return (
            <ul className="suggestions">
                {
                    suggestions.map((item, index) => (<li  className="liSuggestions" key={index}  onClick={() => this.handleItemClick(item)}>{`${item.name}, ${item.city}`}</li>))
                }
            </ul>
        );
    }


  
        
  
    render(){
        const { ddLocation} =this.props;
       
        return(
            <div>
               
        <img src="assets/image1.png" style={{width: "100%", height: "480px"}} />
        <div>
            <b className="wallpaper_Edureka_logo">e!</b>
        </div>
       
        <div className="Edureka_Ttitle_Heading">Find the best restaurants, cafés, and bars</div>
        
    <div className="dd-search">
       <select className="dd" onChange = {this.handleLocationChange}>
            <option value="0">Select</option>
            {ddLocation.map((item)=>{
            return <option value={item.Location_id}>{`${item.name},  ${item.city}`}</option>  })}
            {/*
                <option id={item.Location_id} value={item.city}>{`${item.name},  ${item.city}`}</option>
            */} 
                   
                    
                    
           
          
          </select>
          <div style={{display: "inline-block"}} id="restroSearch">
               <div id="notebooks">
                   <input id="query" type="text" name="restaurant" placeholder="Enter Restaurant Name" onChange={this.handleSearch} />
                   {this.renderSuggestions()}{/* It will render those suggestions(filtered restro)
                                     It will bind the filtered restro on UI*/}
                </div>
                <span  className="glyphicon glyphicon-search search" id="glyphicon"></span>
         </div>
    </div>
</div>
  
        )
    }
}
export default withRouter(Wallpaper);