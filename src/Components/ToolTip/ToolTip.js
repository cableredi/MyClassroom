import React, { Component } from "react";

export default class Tooltip extends Component {
  state = {
    displayTooltip: false,
    position: 'right',
    windowDimensions: window.innerWidth,
  }

  hideTooltip = () => {
    this.setState({ displayTooltip: false })
  };

  showTooltip = (e) => {
    e.clientX + 300 > this.state.windowDimensions 
      ? this.setState({position: 'left'})
      : this.setState({position: 'right'});
    this.setState({ displayTooltip: true })
  };

  render() {
    let message = this.props.message;
    let position = this.state.position;

    return (
      <span className='tooltip'
        onMouseLeave={this.hideTooltip}
      >
        {this.state.displayTooltip &&
          <div className={`tooltip-bubble tooltip-${position}`}>
            <div className='tooltip-message'>{message}</div>
          </div>
        }
        <span
          className='tooltip-trigger'
          onMouseOver={this.showTooltip}
        >
          {this.props.children}
        </span>
      </span>
    )
  };
};