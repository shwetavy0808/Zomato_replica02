import React from 'react';
import '../styles/Header.css';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';


const customStyles = {
    content : {
       
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      backgroundColor:'white',
      //height :'60%'

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
        backgroundColor:'white',
      height :'242px'
    }
  };
  const signUpModalStyles2 = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        backgroundColor:'white',
      height :'440px'
    }
  };
class Header extends React.Component{
constructor(){
    super();
    this.state={
        loginModalIsOpen : false,
        loginWithYourCredentialsModalIsOpen : false,
        userName : undefined,
        isLoggedIn : false,
        signUpModalIsOpen : false,
        isSignUp : false,
        signUpData : [],
        loginData : [],
        activeUser : false,
        isLoggedInSuccess : false,
        fullName : undefined,
        email : undefined,
        mobileNumber : undefined,
        address : undefined,
        password : undefined
    }
}

    handleModal = (state, value) =>{
    this.setState({ [state] : value });
    }

    handleSignUpModal = (state, value) =>{
      const { fullName, email, mobileNumber, address, password} = this.state;
      //alert(email);
      const inputObj={
            fullName : fullName,
            email_id : email,
            contact_number : mobileNumber,
            address : address,
            password : password
        };

      if(state ='signUpModalIsOpen' && value == true){
         axios({
          method : 'POST',
          url : `http://localhost:8970/app/signup`,
          header : {'Content-Type' : 'application/json'},
          data : inputObj
        })
        .then((response)=>{this.setState({  //need to check how to setState keys
        signUpData : response.data.data, fullName:fullName, email:email, mobileNumber:mobileNumber, address:address,password:password 
        });
        alert(response.data.message);
       }
       )
      .catch(error=>console.log(error))
      }
      this.setState({ [state] : value });

    }

    
    handleLogIn = (state, value) => {
        const { email, password} = this.state;
        const inputObj = {
            email : email,
            pwd : password 
        };
        if(state ='loginWithYourCredentialsModalIsOpen' && value == true){

            axios({
                method : 'POST',
                url : `http://localhost:8970/app/login`,
                header : {'Content-Type' : 'application/json'},
                data : inputObj
            })
            .then(response => {if(response.data.isAuthenticated == false){
                alert(response.data.message);
            }
            this.setState({
            loginData : response.data.result[0], isLoggedIn : true, activeUser:true,email:email, pwd:password,
            userName : response.data.result[0].fullName
        });
        alert(response.data.message);
        })
        .catch(err=> console.log(err))
       
        this.setState({ [state] : value });
        }
    }


    loginSuccessfulMsg = () =>{
        this.setState({isLoggedInSuccess : true});
    }

    handleChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    navigateToHomePage=()=>{
        this.props.history.push('/');
    }
    responseGoogle = (response) => {
      console.log(response);
      this.setState({userName : response.profileObj.name , isLoggedIn : true, loginModalIsOpen : false });//see in console what profileOBj
    }
    responseFacebook = (response) => {
        this.setState({userName : response.name , isLoggedIn : true, loginModalIsOpen : false });
    }
    handleLogOut = () => {
        this.setState({userName : undefined , isLoggedIn : false});
    }
    
    

    render(){
        const { loginModalIsOpen, isLoggedIn, userName, signUpModalIsOpen, loginWithYourCredentialsModalIsOpen, activeUser,fullName,isLoggedInSuccess } = this.state;
        return(
            <div>
                    {/*<div>{restaurant.name}</div>*/}
                 <nav className="nav navbar  navbar-dark bg-dark">
                       {/*Edureka Logo*/}
                       <div>
                           <b className="Edureka_logo1" onClick={this.navigateToHomePage}>e!</b>
                       </div>
                        {isLoggedIn || activeUser.length > 0 ?   
                   <div className="Login-Act">
                        {/*Login Button*/}
                         <input className="login" type="button" value={userName} />
                      
                        {/*<div className="login">{userName}</div>*/}
                        
                        {/*Creat Account Button*/}
                       <input className="create-act" type="button" value="LogOut" onClick={this.handleLogOut} />
                   </div> :
                         
                   <div className="Login-Act">
                        {/*Login Button*/}
                       <input className="login" type="button" value="Login" onClick={()=>this.handleModal('loginModalIsOpen', true)} />
                        {/*Creat Account Button*/}
                       <input className="create-act" type="button" value="Create an account" onClick={()=>this.handleModal('signUpModalIsOpen',true)} />
                   </div>}
                </nav>
                <Modal
                isOpen={loginModalIsOpen}
                style={customStyles}
                >
                <div>
                <div className="glyphicon glyphicon-remove" style={{ float:'right', margin:"5px" }} onClick={()=>this.handleModal('loginModalIsOpen', false)}></div>
                <div className="modalLoginName">Login</div>
                <div>
                <GoogleLogin 
                   clientId="548458411543-kr3hfp3svv69do5hbqa7o29cj4t39hkt.apps.googleusercontent.com"
                   buttonText="Continue With Google"
                   onSuccess={this.responseGoogle}//callback function
                   onFailure={this.responseGoogle}//callback function
                   cookiePolicy={'single_host_origin'}
                   className="Continue-with-Google"
                   
                   icon = {false}
                />
                </div>
                <div>
                <FacebookLogin
                     appId="524576111893493"
                     fields="name,email,picture"
                     textButton = "Continue With Facebook"
                     callback={this.responseFacebook} 
                     cssClass="Continue-with-Facebook"/>
                     
                </div>
                <div className="Continue-with-Facebook" onClick={()=>{this.handleModal('loginWithYourCredentialsModalIsOpen',true);this.handleModal('loginModalIsOpen', false)}}>Continue With Your Credentials</div>
                {/* <div className="Continue-with-Facebook" onClick={this.handleLoginWithCredentials}>Continue With Your Credentials</div>
                <hr />
                */}
                <hr />

                <div style={{textAlign: "center"}}>
                <span className="Dont-have-account-Sign-UP">Don’t have account?
                <span className="Dont-have-account-Sign-UP" style={{color: "#ed5a6b"}} onClick={()=>{this.handleModal('signUpModalIsOpen',true); this.handleModal('loginModalIsOpen',false) }}>Sign UP</span></span>
                </div>
            </div>
        </Modal>
                {/*Modal for SignUp*/}
              
    <Modal 
        isOpen={signUpModalIsOpen}
                style={signUpModalStyles2}>
            <div>
            <form onSubmit={()=>{this.handleSignUpModal('signUpModalIsOpen', true);this.handleModal('signUpModalIsOpen', false)}}>
            <div className="glyphicon glyphicon-remove" style={{ float:'right', margin:"5px" }} onClick={()=>this.handleModal('signUpModalIsOpen', false)}></div>
            <div className="modalLoginName">SignUp</div>
            <div className="lables">Name</div>
            <input className="form-control form-control-lg" required  style={{width : "350px"}} type="text" placeholder="Enter Your Name" onChange={(event)=>this.handleChange(event, 'fullName')}/>
            <div className="lables" >Mobile Number</div>
            <input className="form-control form-control-lg" id="phone" name="phone" type="text"  required style={{width : "350px"}}  placeholder="Enter Your Mobile Number" onChange={(event)=>this.handleChange(event, 'mobileNumber')}/>
            <div className="lables">Email</div>
            <input className="form-control form-control-lg" required style={{width : "350px"}} type="email" name="email" placeholder="Enter Your Email" onChange={(event)=>this.handleChange(event, 'email')}/>
            <div className="lables" >Address</div>
            <textarea className="form-control form-control-lg" required style={{width : "350px" , height:"50px"}} type="text" placeholder="Enter Your Address" onChange={(event)=>this.handleChange(event, 'address')}/>
            <div className="lables">Password</div>
            <input className="form-control form-control-lg" required style={{width : "350px"}} type="password" name="pwd" placeholder="Enter Your Password" onChange={(event)=>this.handleChange(event, 'password')}/>
            <input className="btn btn-success signUp" type="submit" dataDismiss="modal" value="Sign Up" />
            </form>
           </div>
    </Modal>
    <Modal
        isOpen={ loginWithYourCredentialsModalIsOpen }
        style={customStyles1}>
    <div>
        <form onSubmit={()=>{this.handleLogIn('loginWithYourCredentialsModalIsOpen', true);this.handleModal('loginWithYourCredentialsModalIsOpen', false)}}>
            <div className="glyphicon glyphicon-remove" style={{ float:'right', margin:"5px" }} onClick={()=>this.handleModal('loginWithYourCredentialsModalIsOpen',false)}></div>
            <div className="modalLoginName">Login</div>
            <div className="lables">Email</div>
            <input className="form-control form-control-lg"  type="email" name="email" placeholder="Enter Your Email" required onChange={(event) => this.handleChange(event, 'email')}/>
            <div className="lables">Password</div>
            <input className="form-control form-control-lg"  type="password" name="password" id="password" placeholder="Enter Your Password" required onChange={(event) => this.handleChange(event, 'password')}/>
            <input className="btn btn-success signUp" dataDismiss="modal" type="submit" value="LogIn" /> 
        </form>
    </div>

    </Modal>

        <Modal
           isOpen={isLoggedInSuccess}
           style={customStyles1}>
           <div>
              <div className="glyphicon glyphicon-remove" style={{ float:'right', margin:"5px" }} onClick={()=>this.handleModal('isLoggedInSuccess', false)}></div>
               {fullName} you are successfully logged In
            </div>
        </Modal>
       
    </div>
        )
    }
}
export default withRouter(Header);