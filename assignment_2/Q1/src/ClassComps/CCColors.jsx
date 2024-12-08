import { Component } from "react";

export default class CCColors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: "white",
    };
  }

  chgColor = (color) => {
    this.setState({ backgroundColor: color });
  };

  render() {
    const colors = [
      "crimson",
      "skyblue",
      "green",
      "gold",
      "purple",
      "orange",
      "pink",
      "gray",
    ];

    return (
      <div
        style={{
          backgroundColor: this.state.backgroundColor,
          padding: "20px",
          textAlign: "center",
          border: "1px solid black",
          borderRadius: "10px"
        }}
      >
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => this.chgColor(color)}
            style={{
              margin: "8px",
              padding: "10px",
              backgroundColor: color,
              color: "eggshell",
              border: "1px solid black",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            {color}
          </button>
        ))}
      </div>
    );
  }
}
