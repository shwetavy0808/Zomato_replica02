import React from 'react';
import rectDom from "react-dom";
import '../styles/Details1.css';
import queryString from 'query-string';     
import axios from 'axios';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css";     
import { Carousel } from 'react-responsive-carousel';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',        
      backgroundColor : 'white'
    }
};

const customStyles1 = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',        
      backgroundColor : 'white',
      width :'80%',
      height :'65%',
      backgroundColor : '#ce0505'
    }
};


class Details extends React.Component{

    //constructor
    constructor(){
        super();
        this.state={
           restaurant : {}, 
           gallaryModalIsOpen : false,
           menuItemModalIsOpen : false,
           payNowModalIsOpen : false,
           restaurantId : undefined,
           menuItems : [],
           subTotal: 0,
           order : [] ,
           name : undefined,
           mobileNumber: undefined,
           email : undefined,
           address : undefined, 


       

          //for saving order in db we use addorder route from backend 
          _id : undefined,
          
          //userId : undefined,
          items : [],
          //amount we are getting from : subtotal
          time : undefined,
          //address : already initialzed in state
          //restaurantId : already intialzed in state




        }                  
                           
    }

    componentDidMount(){
        const qs = queryString.parse(this.props.location.search);
        
        const restaurantId = qs.restId;
       
        //API call to bind the restaurant data 
        axios({
            method:'GET',
            url:`http://localhost:8970/app/restaurantbyid/${restaurantId}`,
            header : {'Content-Type' : 'application/json'}
        }) 
        .then(response=>this.setState({restaurant:response.data.restaurant, restaurantId:restaurantId}))
        .catch(err=>console.log(err))

    }

    handleModal = (state,value) => {
        const { restaurantId, menuItems} = this.state;

        this.setState({ [state] : value });
        if(state == "menuItemModalIsOpen" && value == true){
            axios({
                method : 'GET',
                url : `http://localhost:8970/app/menuitemsbyrestaurant/${restaurantId}`,
                header : {'Content-Type' : 'application/json'}
            })
            .then((response)=>{
                this.setState({ menuItems : response.data.items })
            })
            .catch(err=>console.log(err))

        }
        if(state == 'payNowModalIsOpen' && value == true){
           const customerOrder = menuItems.filter((item)=>item.qty != 0);
           this.setState({ order : customerOrder });
        }
    }
     
    addItems = (index, operationType) => {
        const { _id,email,menuItems,subTotal,time,address,restaurantId } =this.state;
        let total = 0;
        const itemsArray = [...this.state.menuItems];
        const item = itemsArray[index];
        if(operationType =='add'){
            item.qty = item.qty + 1;//how we will get the qty key from server
        }
        else{
            item.qty = item.qty - 1;
        }
        itemsArray[index] = item;
        itemsArray.map((item)=>{
            total += item.qty * item.price;
        })
        this.setState({ menuItems : itemsArray, subTotal : total });
    {/*
        const orderDetails ={
          _id : _id,
          userId : email,
          items :  menuItems,
          amount :subTotal,
          time : time,
          address : address,
          restaurantId : restaurantId
    };
     console.log(orderDetails);
    axios({
        method : 'POST',
        url : `http://localhost:8970/app/addorder`,
        header : {'Content-Type' : 'application/json'},
        data :orderDetails
    })
    .then((response)=>{
        this.setState({ order : response.data.items,_id, userId:email, time:time, address:address,
        restaurantId:restaurantId, _id:_id, subTotal:subTotal })
    })
    .catch(err=>console.log(err))
    */}
    
}


    handleChange = (event, state) => {
       this.setState({ [state] : event.target.value });
    }


    isDate(val) {
       return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)
       

        //using forEAch loop we are convrting each input field to form
        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }

    post = (details) => {
        
        console.log(details);
        const form = this.buildForm(details);
        document.body.appendChild(form);
        form.submit()
        form.remove()
        
    }

    getData = (data) => {
        // getData method return whole promise using fetch method
        // calling the API using fetch method
        return fetch(`http://localhost:8970/app/payment`, 
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
        
    }
    

    handlePayment = () => {
        const { subTotal, email } = this.state;
        //to check whether states are updating or not:-alert(email);
        //alert(email);
        var re = /\S+@\S+\.\S+/;
        if (re.test(email)) {
            // Payment API Call
            this.getData({ amount: subTotal, email: email }).then(response => {
                //let know paytm about transaction
                var information = { 
                    action: "https://securegw-stage.paytm.in/order/process",//paytm api
                    params: response
                }
                this.post(information)
            })
        }
        else {
            alert('Email is not valid, Please check it');
        }
    }

    render(){
        const { restaurant, gallaryModalIsOpen, menuItemModalIsOpen, menuItems, subTotal, payNowModalIsOpen  } = this.state;
        return(
            <div>
              <div className="container">
             {/*row1*/}
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                      {/*Placing Background Image in Details Page*/}
                        <img src="assets/breakfast.png" style={{ width: "100%" , height: "480px" }} className="detailsPageBackgroundImage" />
                </div>
            </div>

             {/*Click to see Image Gallery Button*/}
                    <button className="clickToSeeImageGalleryButton"  style={{borderColor: "#ffffff" }} onClick={()=>this.handleModal('gallaryModalIsOpen',true)}>Click to see Image Gallery </button>

             {/*row2*/}
            <div className="row">
               
                <div className="col-lg-12 col-md-12 col-sm-12">
                     {/*The Big Chill Cakery Heading*/}
                    <div className="bigChillCakery">
                             <div>{/*The Big Chill Cakery*/} {restaurant.name}</div>
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
                    <button className="placeOnlineOrderButton"  style={{borderColor: "#ce0505"}} onClick={()=>this.handleModal('menuItemModalIsOpen',true)}>Place Online Order</button>
                    </div>
                </div>

        {/* start editing for tab*/}
         <div className="tabs">
                <div className="tab">
                    <input type="radio" id="tab-1" name="tab-group-1" defaultChecked />
                    <label for="tab-1" className="overview" >Overview</label>

                    <div className="content">
                        <div className="about">About this place</div>
                        <div className="head">Cuisine</div>
                        <div className="value">{restaurant && restaurant.CuisineDesc ? restaurant.CuisineDesc.map((item)=>`${item.name}, `):null }</div>
                        <div className="head">Average Cost</div>
                        <div className="value">  &#8377;{/*700*/}{restaurant.min_price} for two people (approx.)</div>
                    </div>
                </div>

                <div className="tab">
                    <input type="radio" id="tab-2" name="tab-group-1" />
                    <label for="tab-2" className="overview" >Contact</label>

                    <div className="content">
                        <div className="head">Phone Number</div>
                        <div className="value">{restaurant.contact_number}</div>
                        <div className="head">Address</div>
                        <div className="value1" style={{fontWeight : 'bold',  marginBottom :' none !important'}}>{restaurant.name}</div>
                        <div className="value" >{`${restaurant.locality}, ${restaurant.city}`}</div>
                    </div>
                </div>
            </div>
        </div>

        <Modal
          isOpen={gallaryModalIsOpen}
          style={customStyles1}>
           <div>
              <div className="glyphicon glyphicon-remove" style={{ float:'right', margin:"5px" }} 
              onClick={()=>this.handleModal('gallaryModalIsOpen',false)}></div>
            <Carousel showThumbs={false}>
                 { restaurant &&  restaurant.thumb ? restaurant.thumb.map((imagePath)=>{
                   return <div>
                            <img src={imagePath}  height ="380px" width = "100px"/>
                          </div>
               }):null}
            </Carousel>
        </div>
        </Modal>

        {/*Modal to open itemMenuModal onClick of place_Online_order button*/}
        <Modal 
            isOpen={menuItemModalIsOpen}
            style={customStyles}
        >
        <div>
            <div className="glyphicon glyphicon-remove" style={{ float:'right', margin:"5px" }} onClick={()=>this.handleModal('menuItemModalIsOpen',false)}></div>
            <h3 className="restroName">{restaurant.name}</h3>
                        <button className="btn btn-danger pay" onClick={() =>{this.handleModal('payNowModalIsOpen', true); this.handleModal('menuItemModalIsOpen', false) }}> Pay Now</button>
                        {menuItems.map((item, index) => {
                            return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                    <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                        <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <span className="card-body">
                                                <h5 className="item-name">{item.name}</h5>
                                                <h5 className="item-price">&#8377;{item.price}</h5>
                                                <p className="item-descp">{item.description}</p>
                                            </span>
                                        </div>
                                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="card-img-center title-img" src={`../${item.image}`} style={{ height: '75px', width: '75px', borderRadius: '20px' }} />
                                            {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                                <div className="add-number"><button onClick={() => this.addItems(index, 'subtract')}>-</button><span style={{ backgroundColor: 'white' }}>{item.qty}</span><button onClick={() => this.addItems(index, 'add')}>+</button></div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        })}
                <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>
                        <h3 className="Subtotal">SubTotal : {subTotal}</h3>
                </div>
        </div>
    </Modal>

    <Modal
        isOpen={payNowModalIsOpen}
        style={customStyles}
    >
        <div>
           
            <div className="glyphicon glyphicon-remove" style={{ float:'right', margin:"5px" }} onClick={()=>this.handleModal('payNowModalIsOpen',false)}></div>
            <div className = "restaurantHeading">{restaurant.name}</div>
            <div className="lables">Name</div>
            <input className="form-control form-control-lg"   style={{width : "350px"}} type="text" placeholder="Enter Your Name" onChange={(event)=>this.handleChange(event, 'name')}/>
            <div className="lables" >Mobile Number</div>
            <input className="form-control form-control-lg"  style={{width : "350px"}} type="text" placeholder="Enter Your Mobile Number" onChange={(event)=>this.handleChange(event, 'mobileNumber')}/>
            <div className="lables">Email</div>
            <input className="form-control form-control-lg" style={{width : "350px"}} type="email" placeholder="Enter Your Email" onChange={(event)=>this.handleChange(event, 'email')}/>
            <div className="lables" >Address</div>
            <textarea className="form-control form-control-lg" style={{width : "350px" , height:"50px"}} type="text" placeholder="Enter Your Address" onChange={(event)=>this.handleChange(event, 'address')}/>
            {/*bind order details using menuteItems.map*/}
            <h3 className="Subtotal">Amount : {subTotal}</h3>
            <div className="proceedRectangle"></div>
            <button className="btn btn-danger proceed" type="submit" onClick={this.handlePayment}> PROCEED</button>

           
         
          
    {/*
         <div className = "restaurantHeading" >Order Details</div>
    <h3 className="restroName">{restaurant.name}</h3>
        <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
        <div className="card" style={{ width: '43rem', margin: 'auto' }}>
            <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                       
                                    {menuItems.map((item, index)=>{
                  return <div>{item.qty != 0 ?
                <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                    <span className="card-body">
                        <h5 className="item1-name">{item.name}</h5>
                        <h5 className="item1-price">&#8377;{item.price}</h5>
                        <p className="item1-descp">{item.qty}</p>
                    </span>
                </div>:null}
               </div>
               })}     
            </div>
        </div>
    </div> 
    */}
          

                
           
        </div>
    </Modal>
    </div>  
          )
    }
}
export default Details;

