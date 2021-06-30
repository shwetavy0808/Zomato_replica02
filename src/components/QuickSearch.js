import React from 'react';
import '../styles/quickSearch.css';
import {withRouter} from 'react-router-dom';

class QuickSearch extends React.Component{
    handleClickOnQuicksearchItem=(mealtypeId)=>{
        //console.log(mealtypeId);
        const locationId = sessionStorage.getItem('locationId');
        //const location = sessionStorage.getItem('location');
        if(locationId){
        this.props.history.push(`/filter?mealtype=${mealtypeId}&location=${locationId}`);
        }else{
        this.props.history.push(`/filter?mealtype=${mealtypeId}`);
        }
    }

    render(){
        {/*Accessing props from home component to quickSearch*/}
        const { quicksearch } = this.props;
        return(
            <div>
    {/*Quick Discover*/} 
     <div className="Quick-Discover">
          {/*Quick Searches*/}
        <div className="Quick-Searches">Quick Searches</div>
        {/*Discover restaurants by type of meal*/}
        <div className="Discover-restaurants-by-type-of-meal">Discover restaurants by type of meal</div>
      </div>
     
       {/*Blocks*/}
       <div className="container">
        <div className="row">
            {quicksearch.map((item)=>{
            return <div className="col-lg-4 col-md-6 col-sm-12" onClick={()=>this.handleClickOnQuicksearchItem(item.meal_type)}>
                <div className="block">
                    {/*Image*/}
                    <div style={{display: "inline-block", width: "35%" }}>
                     <img src={item.image} className="image-block" />
                    </div>
                    {/*Containts*/}
                    <div style={{display: "inline-block" , width: "60%" }}>
                         <div className="image-block-menu1">{item.name}</div>
                          <div className="image-block-containts">
                             {item.content}
                          </div>
                    </div>
                </div>
            </div>
            })}
        </div>
    </div>
</div>
        )
    }
}
export default withRouter(QuickSearch);


