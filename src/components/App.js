import React, { Component } from "react";
import "../App.css";
import DataTable from "./DataTable";
import Axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: [
        { title: "Id", accessor: "UniqueRowId", index: 0 },

        {
          title: "First Name",
          accessor: "FirstName",
          index: 1
        },
        {
          title: "Last Name",
          accessor: "LastName",
          index: 2
        },
        {
          title: "Phone Number",
          accessor: "StudentPhoneNumber",
          index: 3
        },
        {
          title: "Campus Name",
          accessor: "CampusName",
          index: 4
        },
        {
          title: "Recommendation",
          accessor: "Recommendation",
          index: 5
        }
        //   {
        //     title: "Age",
        //     accessor: "age",
        //     index: 3
        //   },
        //   {
        //     title: "Qualification",
        //     accessor: "qualification",
        //     index: 4
        //   }
      ],
      data: null,
      fetchTime: null
    };
  }
  async componentDidMount() {
    var startTime = new Date();
    await Axios.get(
      `https://localhost:44316/api/vTDPS_AB_AllInterventions`
    ).then(res => {
      this.setState({ data: res.data });
      console.log((new Date() - startTime) / 1000);
    });
  }
  render() {
    if (!this.state.data) {
      return <div />;
    }
    return (
      <div>
        <DataTable
          className="data-table"
          title="TDPS Records"
          keyField="Id"
          pagination={{
            enabled: false,
            pageLength: 10,
            type: "long"
          }}
          width="100%"
          headers={this.state.headers}
          data={this.state.data}
          noData="No records!"
        />
      </div>
    );
  }
}

export default App;
