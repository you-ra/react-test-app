import React, { Component } from 'react';
import logo from './nordsoftwarelogo.svg';
import './App.css';
import newId from './utils/newid';




class PersonRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleApply = this.handleApply.bind(this);
    this.state = {
      edit: false
    }
  }

  componentWillMount(){
   // this.id = newId();
  }

  handleRemove(e) {
    this.props.onRemove(e);
    console.log("foo"+e.target.className);
  }
  
  handleEdit(e) {
    this.setState({edit:true});
    console.log("foo"+e.target.className);
  }

  handleApply(e, data) {
    this.props.onEdit(e, data);
    this.setState({edit:false});
    
  }

  render() {
    if(!this.state.edit){
      return (
        <div className="Row">
          <div className="Cell pure-u-1-4"><div className = "td">{this.props.person.name}</div></div>
          <div className="Cell pure-u-7-24"><div className = "td">{this.props.person.email}</div></div>
          <div className="Cell pure-u-7-24"><div className = "td">{this.props.person.phone}</div></div>
          <div className="Cell pure-u-4-24"><div className = "td">
            <span className = "a-btn" onClick={this.handleEdit}><i className="fa fa-pencil fa-lg"></i></span>
            <span className = "a-btn" onClick={this.handleRemove} ><i id = {this.props.person.id} className="fa fa-trash fa-lg"></i></span>
          </div></div>
        </div>
      );
    }
    return (<AddForm onSubmit = {this.handleApply} text = "Apply" name = {this.props.person.name} email = {this.props.person.email} phone = {this.props.person.phone} id = {this.props.person.id}/>)
  }
}

class PersonTable extends React.Component {
  constructor(props) {
    super(props);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  handleRemove(e) {
    this.props.onRemove(e);
  }

  handleEdit(e, data) {
    this.props.onEdit(e, data);
    
  }

  handleSort(e) {
    this.props.onSort(e);
    
  }

  render() {
    var rows = [];
    
    this.props.personlist.forEach((person) => {
     
      rows.push(<PersonRow person={person} key={person.id} onRemove={this.handleRemove} onEdit={this.handleEdit}/>);
      
    });
    return (
      <div className="pure-g">
        <div className="pure-u-1 sortRow">
          
            <div className="sortCell pure-u-1-4" id = "name" onClick = {this.handleSort}>Name</div>
            <div className="sortCell pure-u-7-24" id = "email" onClick = {this.handleSort}>Email</div>
            <div className="sortCell pure-u-7-24" id = "phone" onClick = {this.handleSort}>Phone</div>
            <div className="sortCell pure-u-4-24"></div>

        </div>
        <div className="pure-u-1">{rows}</div>
      </div>
    );
  }
}

class AddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      email: props.email,
      phone: props.phone,
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  

  handleChange(e) {
    this.setState({[e.target.id]: e.target.value});
    
  }

  handleSubmit(e){
    e.preventDefault();
    var id = this.props.add ? newId() : this.props.id;
    var data = Object.assign(this.state, {id: id});
    this.props.onSubmit(e, data);
    console.log(data);
  }

  render() {
    return (
      <div className = "Row">
        <form className=" pure-u-1" onSubmit = {this.handleSubmit} id={this.props.id}>
          
          
          
            <div className = "pure-u-1-4 formCell"><input className="" id = "name" value = {this.state.name} type="text" placeholder="Full name" onChange = {this.handleChange}/></div>
            <div className = "pure-u-7-24 formCell"><input className="" id = "email" value = {this.state.email} type="email" placeholder="E-mail" onChange = {this.handleChange}/></div>
            <div className = "pure-u-7-24 formCell"><input className="" id = "phone" value = {this.state.phone} type="text" placeholder="Phone number" onChange = {this.handleChange}/></div>
            <div className = "pure-u-4-24 formCell"><div className=""><button type="submit" className="btn">{this.props.text}</button></div></div>
          
        </form>
      </div>
    );
  }
}

class FilterablePersonTable extends React.Component {
  constructor(props) {
    super(props);
    this.removePeople = this.removePeople.bind(this);
    this.addPeople = this.addPeople.bind(this);
    this.editPeople = this.editPeople.bind(this);
    this.sortPeople = this.sortPeople.bind(this);
    this.state = {
      people: props.personlist
    };
   
  }

  componentDidMount() {

  }

  editPeople(e, data){
    var id = e.target.id;
    this.setState((prevState) => {
      var index = this.getIndex(id, prevState.people, "id");
      var modified = prevState.people;
     
      modified[index] = data;
      return {people: modified};
    });
  }

  addPeople(e, data){
    this.setState((prevState) => {
      
      var modified = prevState.people;
      modified.push(data);
      console.log(modified);
      return {people: modified};
    });
  }

  removePeople(e) {
    var id = e.target.id;
    console.log(id);
    this.setState((prevState) => {
      var index = this.getIndex(id, prevState.people, "id");
      var modified = prevState.people;
      modified.splice(index , 1);
      return {people: modified};
    });
  }

  sortPeople(e) {
    var id = e.target.id;
    console.log(id);
    this.setState((prevState) => {
      return prevState.people.sort((a,b) => a[id] > b[id]);
      
    });
  }

  getIndex(value, arr, prop) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i][prop] === value) {
            return i;
        }
    }
    return -1; //to handle the case where the value doesn't exist
  }

  render() {
    return (
      <div className = "Content">
        <h2>List of participants</h2>
        <AddForm text = "Add new" onSubmit = {this.addPeople} add = {true}/>
        <PersonTable personlist={this.state.people} onRemove = {this.removePeople} onEdit = {this.editPeople} onSort = {this.sortPeople}/>
      </div>
    );
  }
}


var PERSONS = [
  {id: "1", name: 'Vladimir Nabokov', email: 'butterfly@collection.org', phone: '123-556-5466'},
  {id: "2", name: 'Harvey Bullock', email: 'ballock@gothpolice.org', phone: '087-659-3359'},
  {id: "3", name: 'Marvel Girl', email: 'm.girl@marvel.com', phone: '035-456-7821'},
  {id: "4", name: 'Bill Murray', email: 'bill@murray.io', phone: '069-159-3698'},
  {id: "5", name: 'Peter Parker', email: 'peter@spiderweb.com',  phone: '055-654-5612'},
  {id: "6", name: 'Bilbo Baggins', email: 'bilbo@greenfield.fi', phone: '655-568-7412'}
];



class App extends Component {
  

  render() {
    return (
      <div className="App">
        <div className = "Bg"/>
        <div className = "appWrap">
          
          <div className = "Header"><img src={logo} className="App-logo" alt="logo" /><h1>Nord Software</h1></div>
          <FilterablePersonTable personlist={PERSONS} />
        </div>
      </div>
    );
  }
}



export default App;
