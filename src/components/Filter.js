import React from 'react';
import rectDom from "react-dom";
import '../styles/Filter.css';
import querystring from 'query-string';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

class Filter extends React.Component{
    //Constructor
    constructor(){
        super();   
        this.state={
            restaurants :[],  
            location : undefined,
            mealtype : undefined,
            lcost : undefined,
            hcost : undefined,
            sort : undefined,
            page : undefined,
            //cuisine:undefined,
            locations : [],//this state variable for filterPage location search API call to bind the value in location in filter block
            cuisineDetails : []
            
        }
    }

    //componentDidMount
    componentDidMount(){
        const qs = querystring.parse(this.props.location.search);
        const location = qs.location;
        const mealtype = qs.mealtype;
        const inputObj={
           mealtype_id : Number(mealtype),
           location_id :Number(location)
        };


        axios({
            method :'POST',
            url : 'http://localhost:8970/app/filter ',
            header : {'Content-Type' : 'application/json'},
            data : inputObj 
        })
        .then(response=>this.setState({restaurants : response.data.restaurant , location:location , mealtype:mealtype }))
        .catch(err=>console.log(err));

    //filterPage location search API call
    axios({
        //details to call an API
        method:'GET',
        url:'http://localhost:8970/app/location',
        headers:{'Content-Type':'application/json'}
    
    })
    .then(response=>this.setState({locations:response.data.city}))
    .catch(err=>console.log(err))
}

//handlePageChange
handlePageChange = (pageNumber)=>{
    const {lcost ,hcost,sort,mealtype,location,cuisineDetails} = this.state;
    const inputObj={
        page : pageNumber,
        mealtype_id :mealtype,
        location_id :location,
        lcost : lcost,
        hcost : hcost,
        sort : sort ,
        cuisineId:cuisineDetails.length == 0 ? undefined :cuisineDetails
    };
    console.log(inputObj);
    axios({
        method :'POST',
        url : 'http://localhost:8970/app/filter ',
        header : {'Content-Type' : 'application/json'},
        data : inputObj 
    })
    .then(response=>this.setState({restaurants : response.data.restaurant ,page:pageNumber}))
    .catch(err=>console.log(err))
    console.log("Page",pageNumber);
}


handleLocationChange = (event)=>{
 const location = event.target.value;
 const {lcost , hcost , mealtype,sort,page,cuisineDetails} = this.state;
        const inputObj={
            mealtype_id :mealtype,
            location_id :location,
            page :page,
            sort : sort ,
            lcost : lcost,
            hcost : hcost,
            cuisineId : cuisineDetails.length == 0 ? undefined :cuisineDetails
        };
        console.log(inputObj);

  axios({
            method :'POST',
            url : 'http://localhost:8970/app/filter ',
            header : {'Content-Type' : 'application/json'},
            data : inputObj 
         })
        .then(response=>this.setState({restaurants : response.data.restaurant, location:location }))
        .catch(err=>console.log(err))
 
}

//sort handler function
    handleSortChange=(sort)=>{
        const {location , mealtype, lcost, hcost, cuisineDetails,page} = this.state;
        const inputObj={
            sort : sort ,
            mealtype_id :mealtype,
            location_id :location,
            lcost : lcost,
            hcost : hcost,
            page :page,
            cuisineId : cuisineDetails.length == 0 ? undefined :cuisineDetails
        };
        console.log(inputObj);
    axios({
            method :'POST',
            url : 'http://localhost:8970/app/filter ',
            header : {'Content-Type' : 'application/json'},
            data : inputObj
        })
        .then(response=>this.setState({restaurants : response.data.restaurant, sort:sort }))
        .catch();
    }
    
     //handleCostChange
     handleCostChange=(lcost, hcost)=>{
        const {sort,mealtype,location, cuisineDetails,page} = this.state;
        const inputObj={
            lcost : lcost,      
            hcost : hcost,       
            sort : sort , 
            page :page,    
            mealtype_id :mealtype,
            location_id :location,
            cuisineId : cuisineDetails.length == 0 ? undefined :cuisineDetails
        };
        console.log(inputObj);
        axios({
            method :'POST',
            url : 'http://localhost:8970/app/filter ',
            header : {'Content-Type' : 'application/json'},
            data : inputObj 
         })
        .then(response=>this.setState({restaurants : response.data.restaurant, lcost:lcost , hcost:hcost }))
        .catch(err=>console.log(err))
        
    }
    
    //here backend expecting id=>cusineId
    handleCuisineChange = (cuisineId) =>{
        const {sort,mealtype,location,lcost, hcost,cuisineDetails,page} = this.state;
       
       if(cuisineDetails.indexOf(cuisineId) == -1){
            cuisineDetails.push(cuisineId);
        }else{
              const index = cuisineDetails.indexOf(cuisineId);
              cuisineDetails.splice(index, 1);
        }
       
        const inputObj={
            lcost : lcost,      
            hcost : hcost,       
            sort : sort,   
            page :page,      
            mealtype_id :mealtype,
            location_id :location,
            cuisineId :cuisineDetails.length == 0 ? undefined :cuisineDetails
            
        };
        console.log(inputObj);
        //axios is a library to make http request
        axios({
            method :'POST',
            url : 'http://localhost:8970/app/filter',
            header : {'Content-Type' : 'application/json'},
            data : inputObj //`data` is the response that was provided by the server
         })
        .then(response=>this.setState({restaurants : response.data.restaurant, cuisineDetails:cuisineDetails }))
        .catch(err=>console.log(err))
    }

    
    handleNavigateToDetailsPage=(restaurantId)=>{
        this.props.history.push(`/details?restId=${restaurantId}`);
        console.log(restaurantId);
    }
    
   //render method
    render(){
        const { restaurants , locations,city} =  this.state;
        return(
            <div>
              {/*
               <div className="Breakfast_Places_in_Mumbai">Breakfast Places in Mumbai</div>
              */} 
             <div className="Breakfast_Places_in_Mumbai">Breakfast Places in Mumbai {city}</div>
         
             <div className="container-fluid">

              <div className="row">
          
            <div className="col-sm-3 col-md-3 col-lg-3 filter-options">
                <div className="filter2">
                    <div className="filter_Page_heading">Filters / Sort</div>
                <span className="glyphicon glyphicon-chevron-down toggle-span" id="glyphicon1" data-toggle="collapse"  
                data-target="#filter1"></span>

            </div>

               
                <div id="filter1" className="collapse show filter-block">
                  
                    <div className="select">Select Location </div>
                    <select className="Select_Location_dd" onChange={this.handleLocationChange}>
                       <option value="0">Select</option>
                    {locations.map((item)=>{
                    return  <option value={item.Location_id}>{`${item.name},  ${item.city}`}</option>
                    })}
                   </select>
                {/*Cuisine*/}
                <div className="select">Cuisine</div>
                <div style= {{ marginBottom : "11px" }}>
                 
                    <div>
                        <input required type="checkbox" onChange={()=>this.handleCuisineChange(1)} />
                        <span  className="input-options">North Indian</span>
                    </div>
                    <div>
                     <input required type="checkbox" onChange={()=>this.handleCuisineChange(2)} />
                     <span className="input-options">South Indian</span>
                    </div>
                    <div>
                     <input required type="checkbox" onChange={()=>this.handleCuisineChange(3)} />
                     <span className="input-options">Chinese</span>
                    </div>
                    <div>
                     <input required type="checkbox" onChange={()=>this.handleCuisineChange(4)}  />
                     <span className="input-options">Fast Food</span>
                    </div>
                    <div>
                     <input required type="checkbox" onChange={()=>this.handleCuisineChange(5)} />
                     <span  className="input-options">Street Food</span>
                    </div>
                </div>
                 
                 {/*Cost For Two*/}
                <div className="select">Cost For Two</div>
               <div  style={{marginBottom: "11px"}}>
                
                <div>
                   {/*passing parameter ()=>this.handleCostChange(1,500)=>(lcost,hcost)*/}
                   <input type="radio" name="cost" onChange={()=>this.handleCostChange(1, 500)}/>
                    <span className="input-options">Less than &#8377; 500</span>
                </div>
                <div>
                    <input type="radio" name="cost" onChange={()=>this.handleCostChange(500, 1000)}/>
                    <span className="input-options"> &#8377; 500 to &#8377; 1000</span>
                </div>
                <div>
                    <input type="radio" name="cost" onChange={()=>this.handleCostChange(1000, 1500)}/>
                    <span className="input-options">&#8377; 1000 to &#8377; 1500</span>
                </div>
                <div>
                    <input type="radio" name="cost" onChange={()=>this.handleCostChange(1500, 2000)}/>
                    <span className="input-options">&#8377; 1500 to &#8377; 2000</span>
                </div>
                <div>
                    {/* in below case while passing params,here cost is 2000 ,But we need pass lcost and hcost ,we set lcost=2000 and hcost=10000 (2000,10000)*/}
                    <input type="radio" name="cost" onChange={()=>this.handleCostChange(2000, 10000)}/>
                    <span className="input-options">&#8377; 2000 +</span>
                </div>
               </div>
              
                <div className="select">Sort</div>
                <div style={{ marginBottom: "11px" }}>
                    <div>
                        <input type="radio" className="radio1" name="sort" onChange={()=>this.handleSortChange(1)} />
                        <span className="input-options ">Price Low to High</span>
                    </div>
                    <div>
                        <input type="radio" className="radio1"  name="sort"  onChange={()=>this.handleSortChange(-1)} />
                        <span className="input-options ">Price High to low</span>
                    </div>
                </div>
            
            </div>
        </div>

          
           
            <div className="col-sm-9 col-md-9 col-lg-9">
                {restaurants && restaurants.length > 0 ? restaurants.map((item)=>{
                    console.log("prev:",item._id);
                   return <div className="Item-Block" onClick={()=>this.handleNavigateToDetailsPage(item._id)}>
                   <div className="contaner-fluid">
                       <div className="row">
                           <div className="col-sm-3 col-md-3 col-lg-3 " style={{display: "inline-block"}}>
                         <img className="Item-img" src="assets/breakfast.png" height="100" width="120" />
                     </div>
                     <div className="col-sm-9 col-md-9 col-lg-9 " style={{display: "inline-block" }}>
                         <div className="Item-block-heading headings"  style={{ marginTop: "15px" }}>{item.name}</div>
                         <div className="Item-block-subheading headings">{item.locality}</div>
                         <div className="Item-block-address headings">{item.city}</div>
                     </div>
                    
                    </div>
                    <hr id="hr" />
                    <div className="row">
                       <div className="col-sm-3 col-md-3 col-lg-3 " style={{ display: "inline-block"}}>
                         <div className="CUISINES-COST-FOR-TWO ">CUISINES:</div>
                         <div className="CUISINES-COST-FOR-TWO ">COST FOR TWO:</div>
                        </div>
                     <div className="col-sm-9 col-md-9 col-lg-9 " style={{ display: "inline-block"}}>
                         {/*cuisine is an array of object ,for that we need to iterate using map method*/}
                         <div className="Bakery-700" style={{ color: "#192f60" }}>{item.CuisineDesc.map((cuis)=>`${cuis.name}, `)}</div>
                         <div className="Bakery-700"style={{ color: "#192f60" }}> {item.min_price}</div>
                     </div>
                    
                    </div>

                   </div>
                   
                </div>
                }):<div className="defaultMessageforNoRecordFound">Sorry.No records Found...</div>}
                
        </div>
          
        <div className="pagination" >
            <a href="#" onClick={()=>this.handlePageChange()}>&laquo;</a>
            <a href="#" onClick={()=>this.handlePageChange(1)}>1</a>
            <a href="#" onClick={()=>this.handlePageChange(2)}>2</a>
            <a href="#" onClick={()=>this.handlePageChange(3)}>3</a>
            <a href="#" onClick={()=>this.handlePageChange(4)}>4</a>
            <a href="#" onClick={()=>this.handlePageChange(5)}>5</a>
            <a href="#" onClick={()=>this.handlePageChange(6)}>6</a>
            <a href="#" onClick={()=>this.handlePageChange()}>&raquo;</a>
        </div>
</div>
    </div>
       </div>
       )
    }
}

export default withRouter(Filter);