import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';




const user = {
  firstName: 'ethan',
  lastName: 'hall'
}

const fullname = 'Ethan Hall';

const divelement = <div tabIndex="0"></div>
const imgelement = <img src={user.avatarURl}></img>
const element = (
  <div>
    {getGreeting()}
    {divelement}
    {imgelement}
  </div>
);

//functions
function getGreeting(user){
  if(user){
    return <h1>Hello, {formatName(user)}</h1>;
  }
  else{
    return <h1> Hello, Stranger</h1>;
  }
}
function formatName(user){
  return user.firstName + ' ' + user.lastName;
}



class Clock extends React.Component{
  constructor(props){
    super(props);
    this.state = {date: new Date()};
  }

    //Lifecycle methods
  componentDidMount() { 
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
   }
  componentWillUnmount() { 
    clearInterval(this.timerID);
   }

   tick(){ 
     this.setState({
      date: new Date()
     });
   }
  render() {
    return (
    <div>
      <h1>Hello world</h1>
      <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
    </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
