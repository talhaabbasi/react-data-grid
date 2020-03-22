import React, { Component } from "react";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.currentPage = 1;
    this.pageLength = props.pageLength;
  }
  render() {
    return (
      <div className="pagination">
        <h2>Hello World</h2>
      </div>
    );
  }
}

export default Pagination;
