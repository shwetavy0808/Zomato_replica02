import React from 'react';
import rectDom from "react-dom";
import Wallpaper from './Wallpaper';
import QuickSearch from './QuickSearch';
import axios from 'axios';



class Home extends React.Component{
    constructor(){
        super();
        this.state={
            location:[],
            mealtypes:[]
        }
    }

    componentDidMount(){
        sessionStorage.clear();

        //location API call
        axios({
            //details to call an API
            method:'GET',
            url:'http://localhost:8970/app/location',
            headers:{'Content-Type':'application/json'}
        
        })
        .then(response=>this.setState({location:response.data.city}))
        .catch(err=>console.log(err))
        
        //QuickSearch API call
        axios({
            //details to call an API
            method:'GET',
            url:'http://localhost:8970/app/mealtype',
            headers:{'Content-Type':'application/json'}
        
        })
        .then(response=>this.setState({ mealtypes:response.data.mealType}))
        .catch(err=>console.log(err))      
    }
    

    render(){
        const {location ,mealtypes} = this.state;       
        return(
            <div>
                {/*child component of home component*/}
                < Wallpaper  ddLocation={location} />,
                < QuickSearch quicksearch={mealtypes} />
            </div>
          )}
}
export default Home;


























