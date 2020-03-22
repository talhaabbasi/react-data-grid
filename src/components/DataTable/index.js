import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./datatable.css";
import Pagination from "../Pagination";

class DataTable extends Component {
  _preSearchData = null;

  constructor(props) {
    super(props);
    this.state = {
      headers: props.headers,
      data: props.data,
      sortby: null,
      descending: null,
      search: false,
      pageLength: props.pagination.pageLength || 10,
      currentPage: 1
    };
    this.keyField = props.keyField || "id";
    this.noData = props.noData || "No Record found";
    this.width = props.width || "100%";

    //Add pagination
    this.pagination = this.props.pagination || {};
  }

  onDragOver = event => {
    event.preventDefault();
  };

  onDragStart = (event, source) => {
    event.dataTransfer.setData("text/plain", source);
  };

  onDrop = (event, target) => {
    event.preventDefault();
    let source = event.dataTransfer.getData("text/plain");
    let headers = [...this.state.headers];
    let sourceHeader = headers[source];
    let targetHeader = headers[target];
    let temp = sourceHeader.index;
    sourceHeader.index = targetHeader.index;
    targetHeader.index = temp;
    this.setState({ headers });
  };

  renderTableHeader = () => {
    let { headers } = this.state;
    headers.sort((a, b) => {
      if (a.index > b.index) return 1;
      return -1;
    });
    let headerView = headers.map((header, index) => {
      let title = header.title;
      let cleanTitle = header.accessor;
      let width = header.width;

      if (this.state.sortby === index) {
        title += this.state.descending ? "\u2193" : "\u2191";
      }

      return (
        <th
          key={cleanTitle}
          ref={th => (this[cleanTitle] = th)}
          style={{ width: width }}
          data-col={cleanTitle}
          onDragStart={event => this.onDragStart(event, index)}
          onDragOver={this.onDragOver}
          onDrop={event => {
            this.onDrop(event, index);
          }}
        >
          <span draggable className="header-cell" data-col={cleanTitle}>
            {title}
          </span>
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

  onSort = event => {
    let data = this.state.data.slice();
    let coloumnIndex = ReactDOM.findDOMNode(event.target).parentNode.cellIndex;
    let coloumnTitle = event.target.dataset.col;

    let descending = !this.state.descending;

    data.sort((a, b) => {
      let sortValue = 0;
      if (a[coloumnTitle] < b[coloumnTitle]) {
        sortValue = -1;
      } else if (a[coloumnTitle] > b[coloumnTitle]) {
        sortValue = 1;
      }
      if (descending) {
        sortValue *= -1;
      }
      return sortValue;
    });

    this.setState({ data, sortby: coloumnIndex, descending });
  };

  onSearch = event => {
    let { headers } = this.state;
    let needle = event.target.value.trim().toLowerCase();
    if (!needle) {
      this.setState({ date: this._preSearchData });
    }
    let index = event.target.dataset.idx;

    let targetColoumn = this.state.headers[index].accessor;

    let data = this._preSearchData;

    let searchData = this._preSearchData.filter(row => {
      let show = true;
      for (let field in row) {
        let fieldValue = row[field];
        let inputID = "input" + field;
        let input = this[inputID];
        if (!fieldValue === "") {
          show = true;
        } else {
          show =
            fieldValue
              .toString()
              .toLowerCase()
              .indexOf(input.value.toLowerCase()) > -1;
          if (!show) break;
        }
      }
      return show;
    });
    this.setState({ data: searchData });
  };

  renderSearch = () => {
    let { search, headers } = this.state;
    if (!search) {
      return null;
    }
    let searchInputs = headers.map((header, index) => {
      //Get the header accessor
      let hdr = this[header.accessor];
      let inputID = "input" + header.accessor;

      return (
        <td key={index}>
          <input
            ref={input => (this[inputID] = input)}
            type="text"
            data-idx={index}
            style={{ width: hdr.clientWidth - 17 + "px" }}
          />
        </td>
      );
    });
    return <tr onChange={this.onSearch}>{searchInputs}</tr>;
  };

  renderTable = () => {
    let title = this.props.title || "DataTable";
    let headerView = this.renderTableHeader();
    let contentView =
      this.state.data.length > 0 ? this.renderContent() : this.renderNoData();

    return (
      <table className="data-inner-table">
        <caption className="data-table-caption">{title}</caption>
        <thead onClick={this.onSort}>
          <tr>{headerView}</tr>
        </thead>
        <tbody>
          {this.renderSearch()}
          {contentView}
        </tbody>
      </table>
    );
  };

  onToggleSearch = event => {
    if (this.state.search) {
      this.setState({
        data: this._preSearchData,
        search: false
      });
      this._preSearchData = null;
    } else {
      this._preSearchData = this.state.data;
      this.setState({
        search: true
      });
    }
  };

  renderToolbar = () => {
    return (
      <div className="toolbar">
        <button onClick={this.onToggleSearch}>Search</button>
      </div>
    );
  };

  render() {
    return (
      <div className={this.props.className}>
        {this.pagination.enabled && (
          <Pagination
            type={this.props.pagination.type}
            totalRecords={this.state.data.length}
            pageLength={this.state.pageLength}
          />
        )}
        {this.renderToolbar()}
        {this.renderTable()}
      </div>
    );
  }
}
export default DataTable;
