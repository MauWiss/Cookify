import React, { Component } from 'react';

class ResizableTable extends Component {
  constructor(props) {
    super(props);
    this.state = { width: '100%' }; // Initial state
  }

  handleClick = () => {
    this.setState({ width: '50%' }); // Update state on single click
  };

  handleDoubleClick = () => {
    this.setState({ width: '100%' }); // Update state on double-click
  };

  render() {
    return (
      <table
        style={{
          width: this.state.width,
          border: '1px solid black',
          borderCollapse: 'collapse',
          textAlign: 'center',
          transition: 'width 0.3s ease',
        }}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
      >
        <tbody>
          <tr>
            <td style={{ border: '1px solid black' }}>Row 1, Col 1</td>
            <td style={{ border: '1px solid black' }}>Row 1, Col 2</td>
            <td style={{ border: '1px solid black' }}>Row 1, Col 3</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black' }}>Row 2, Col 1</td>
            <td style={{ border: '1px solid black' }}>Row 2, Col 2</td>
            <td style={{ border: '1px solid black' }}>Row 2, Col 3</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default ResizableTable;
