import React from 'react'
import Table from "rc-table"


export const TransHistory = () => {

    const columns = [

        {
          title: "Date",
          dataIndex: "date",
          key: "date",
          width: "10%",
          className: "classes.date"
        },
        {
          title: "Time",
          dataIndex: "time",
          key: "time",
          width: "10%",
        },
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
          width: "12.5%",
        },
        {
          title: "Company",
          dataIndex: "company",
          key: "company",
          width:"18.5%",
        },
        {
          title: "Symbol",
          dataIndex: "symbol",
          key: "symbol",
          width:"12.5%",
        },
        {
          title: "Quantity",
          dataIndex: "quantity",
          key: "quantity",
          width:"12.5%",
        },
        {
          title: "Price",
          dataIndex: "price",
          key: "price",
          width:"12.5%",
        },
        {
          title: "Total Value",
          dataIndex: "value",
          key: "value",
          width:"14%",
        },
      ];

      const data = [
        {
          date: "1/1/22",
          time: "12:45am",
          action: "buy",
          company: "Meta Platforms",
          symbol: "fb",
          quantity: "2",
          price: 222.36,
          value: 444.72,
        }
      ];

      return (
          <div>
            <Table
                columns={columns}
                data={data}
                tableLayout="auto"
                useFixedHeader={true}
                scroll = {{x: "800px", y: "500px"}}
            />
          </div>   
      );

    };