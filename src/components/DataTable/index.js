import React, { Component } from "react";
import "./datatable.css";

class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: props.headers,
      data: props.data
    };
    this.keyField = props.keyField || "id";
    this.noData = props.noData || "No Record found";
    this.width = props.width || "100%";
  }
  renderTableHeader = () => {
    let { headers } = this.state;
    headers.sort((a, b) => {
      if (a.index > a.index) return 1;
      return -1;
    });
    let headerView = headers.map((header, index) => {
      let title = header.title;
      let cleanTitle = header.accessor;
      let width = headers.width;

      return (
        <th
          key={cleanTitle}
          ref={th => (this.th = th)}
          style={{ width: width }}
          data-col={cleanTitle}
        >
          <span className="header-cell">{title}</span>
        </th>
      );
    });
    return headerView;
  };
  renderTable = () => {
    let title = this.props.title || "DataTable";
    let headerView = this.renderTableHeader();
    let contentView = "Content goes here";

    return (
      <table className="data-inner-table">
        <caption className="data-table-caption">{title}</caption>
      </table>
    );
  };
  render() {
    return <div className={this.props.className}>{this.renderTable()}</div>;
  }
}
export default DataTable;
