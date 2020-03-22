import React, { Component, Fragment } from "react";
import "./pagination.css";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: props.currentPage || 1
    };
  }
  onPageLengthChange = event => {
    this.props.onPageLengthChange(this.pageLengthInput.value);
  };
  onPreviousPage = event => {
    if (this.state.currentPage === 1) return;
    this.onGotoPage(this.state.currentPage - 1);
  };
  onNextPage = event => {
    if (this.state.currentPage > this.pages - 1) return;
    this.onGotoPage(this.state.currentPage + 1);
  };
  onGotoPage = pageNo => {
    if (pageNo === this.state.currentPage) return;
    if (this.currentPageInput) {
      this.currentPageInput.value = pageNo;
    }
    this.setState({
      currentPage: pageNo
    });
    this.props.onGotoPage(pageNo);
  };
  render() {
    let totalRecords = this.props.totalRecords;
    let pages = Math.ceil(totalRecords / this.props.pageLength);
    this.pages = pages;
    let pageSelector = (
      <Fragment key="f-page-selector">
        <span key="page-selector" className="page-selector">
          Rows per page:
        </span>
        <input
          key="page-input"
          type="number"
          min="1"
          ref={input => (this.pageLengthInput = input)}
          defaultValue={this.props.pageLength || 5}
          onChange={this.onPageLengthChange}
        />
      </Fragment>
    );
    let previousButton = (
      <button
        key="previous"
        className="pagination-btn prev"
        onClick={this.onPreviousPage}
      >
        {"<"}
      </button>
    );
    let nextButton = (
      <button
        key="next"
        className="pagination-btn next"
        onClick={this.onNextPage}
      >
        {">"}
      </button>
    );
    return (
      <div className="pagination">
        {[pageSelector, previousButton, nextButton]}
      </div>
    );
  }
}

export default Pagination;
