import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

class App extends Component{

  constructor(props){
    super(props);
    this.state = {hideCompleted:false};
  }

  handleSubmit(event){
    event.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim(); // Fetch the text value from the form input
    //Insert the task info into the database
    Meteor.call('tasks.insert', text);
    ReactDOM.findDOMNode(this.refs.textInput).value = ''; //Clear the form
  }

  renderTasks(){
    let filteredTasks = this.props.tasks;
    //to hide the tasks that are checked or completed
    if(this.state.hideCompleted){
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }

    return filteredTasks.map((task) => {

      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
      return (<Task key={task._id} task={task} showPrivateButton={showPrivateButton} />);
    });
  }

  toggleHideCompleted(){
    this.setState({hideCompleted: !this.state.hideCompleted});
  }

  render(){
    return(
      <div className= "container">
        <header>
          <h1>Todo List({this.props.incompleteTasksCount})</h1>
          <label className="hide-completed">
              <input type="checkbox" readOnly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)} />
              Hide Completed Tasks
          </label>
          <AccountsUIWrapper/>
          { this.props.currentUser ?
            <form className= "new-task" onSubmit= {this.handleSubmit.bind(this)}>
              <input type= "text" ref="textInput" placeholder="..Enter your todo tasks here.." />
            </form> : ''
          }
        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }

}

App.PropTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteTasksCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, {sort: { createdAt : -1}}).fetch(),
    incompleteTasksCount: Tasks.find({checked:{$ne:true}}).count(),
    currentUser: Meteor.user(),
  };
}, App);
