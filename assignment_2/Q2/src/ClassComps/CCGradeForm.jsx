import { Component } from "react";

export default class CCGradeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      grade: "",
      activeField: null,
      eligibilityMessage: "",
    };
  }

  handleFocus = (field) => {
    this.setState({ activeField: field });
  };

  handleBlur = (field) => {
    this.setState({ activeField: null });
    if (field === "grade") {
      const score = parseInt(this.state.grade, 10);
      if (!isNaN(score)) {
        if (score > 555) {
          this.setState({
            eligibilityMessage: "You are eligible for admission!",
          });
        } else {
          this.setState({
            eligibilityMessage: "Not eligible! Try again next year.",
          });
        }
      } else {
        this.setState({ eligibilityMessage: "" });
      }
    }
  };

  handleChange = (field, value) => {
    this.setState({ [field]: value });
  };

  render() {
    const { firstName, lastName, grade, activeField, eligibilityMessage } =
      this.state;

    return (
      <form
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "#1c1c1c",
          color: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div style={{ marginBottom: "20px", position:"relative" }}>
          <label style={{ display: "block", marginBottom: "30px" }}>
            First Name:
          </label>
          {activeField === "firstName" && (
            <p style={{ color: "red", margin: "0", position:"absolute", top:"30px"}}>
              Please fill in your first name
            </p>
          )}
          <input
            type="text"
            value={firstName}
            onFocus={() => this.handleFocus("firstName")}
            onBlur={() => this.handleBlur("firstName")}
            onChange={(e) => this.handleChange("firstName", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px", position:"relative" }}>
          <label style={{ display: "block", marginBottom: "30px" }}>
            Last Name:
          </label>
          {activeField === "lastName" && (
                       <p style={{ color: "red", margin: "0", position:"absolute", top:"30px"}}>
              Please fill in your last name
            </p>
          )}
          <input
            type="text"
            value={lastName}
            onFocus={() => this.handleFocus("lastName")}
            onBlur={() => this.handleBlur("lastName")}
            onChange={(e) => this.handleChange("lastName", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px", position:"relative" }}>
          <label style={{ display: "block", marginBottom: "30px" }}>Grade:</label>
          {activeField === "grade" && (
                        <p style={{ color: "red", margin: "0", position:"absolute", top:"30px"}}>
              Please fill in your grade
            </p>
          )}
          <input
            type="text"
            value={grade}
            onFocus={() => this.handleFocus("grade")}
            onBlur={() => this.handleBlur("grade")}
            onChange={(e) => this.handleChange("grade", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        {eligibilityMessage && (
          <p
            style={{
              marginTop: "15px",
              padding: "10px",
              borderRadius: "4px",
              backgroundColor: "#282828",
              textAlign: "center",
            }}
          >
            {eligibilityMessage}
          </p>
        )}
      </form>
    );
  }
}
