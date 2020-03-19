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
      if (a.index > b.index) return 1;
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

  renderNoData = () => {
    return (
      <tr>
        <td colSpan={this.props.headers.length}>{this.noData}</td>
      </tr>
    );
  };
  renderContent = () => {
    let { headers, data } = this.state;
    let contentView = data.map((row, rowIndex) => {
      let id = row[this.keyField];
      let tds = headers.map((header, index) => {
        let content = row[header.accessor];
        let cell = header.cell;
        if (cell) {
          if (typeof cell === "object") {
            if (cell.type === "image" && content) {
              content = <img style={cell.style} src={content} />;
            }
          } else if (typeof cell === "function") {
            content = cell(content);
          }
        }
        return (
          <td key={index} data-id={id} data-row={rowIndex}>
            {content}
          </td>
        );
      });
      return <tr key={rowIndex}>{tds}</tr>;
    });
    return contentView;
  };
  renderTable = () => {
    let title = this.props.title || "DataTable";
    let headerView = this.renderTableHeader();
    let contentView =
      this.state.data.length > 0 ? this.renderContent() : this.renderNoData();

    return (
      <table className="data-inner-table">
        <caption className="data-table-caption">{title}</caption>
        <thead>
          <tr>{headerView}</tr>
        </thead>
        <tbody>{contentView}</tbody>
      </table>
    );
  };
  render() {
    return <div className={this.props.className}>{this.renderTable()}</div>;
  }
}
export default DataTable;
