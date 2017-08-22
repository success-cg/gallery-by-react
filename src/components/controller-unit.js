import React from 'react';

class ControllerUnit extends React.Component {

  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
  }


  render() {
    return (
      <span className="controller-unit" onClick={this.handleClick}></span>
    )
  }
}

// module.exports = ControllerUnit

export default ControllerUnit
