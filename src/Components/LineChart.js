import { chartData, endpoints } from "./util";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { useCallback, useMemo, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { ToggleButton } from "primereact/togglebutton";

const LineChart = () => {
  const [activeEndpoint, setActiveEndpoint] = useState({
    name: "",
    code: "",
  });
  const [checked, setChecked] = useState(false);
  const [dates, setDates] = useState(null);

  console.log('')

  const sortedChartData = useMemo(() => {
    return chartData
      .sort((a, b) => new Date(a.time) - new Date(b.time))
      .filter((x) => {
        if (checked) {
          return x.special === checked;
        } else {
          return x;
        }
      })
      .filter((x) =>
        dates
          ? x.time >= (dates[0] !== null && dates[0].toISOString()) &&
            x.time <= (dates[1] !== null && dates[1].toISOString())
          : x
      );
  }, [checked, dates]);

  const dateRange = useMemo(() => {
    return sortedChartData
      .map((x) => {
        return x.time;
      })
      .filter((item, i, ar) => ar.indexOf(item) === i)
      .sort((a, b) => a - b);
  }, [sortedChartData]);

  const dateAndTimeLabels = useMemo(() => {
    return sortedChartData.map((date) =>
      new Date(Date.parse(date.time)).toUTCString()
    );
  }, [sortedChartData]);

  const getChartData = useCallback(
    (endpoint) => {
      const chartTimeArray = [...new Set(sortedChartData.map((x) => x.time))];
      return chartTimeArray.map((x) => {
        const obj = sortedChartData.find(
          (m) => m.time === x && m.endpoint === endpoint
        );
        if (obj === undefined) {
          return null;
        } else {
          return obj.requests;
        }
      });
    },
    [sortedChartData]
  );

  const onReset = () => {
    setActiveEndpoint({ name: "", code: "" });
    setChecked(false);
    setDates(null);
  };

  return (
    <div className="chart-container">
      <div className="flex flex-row p-3 justify-content-evenly bg-bluegray-100">
        <div className="flex flex-column">
          <label className="mt-3 mb-3 font-semibold">Select Endpoint</label>
          <Dropdown
            value={activeEndpoint}
            onChange={(e) => setActiveEndpoint(e.value)}
            options={endpoints}
            optionLabel="name"
            placeholder="Select an endpoint"
            className="w-full md:w-14rem"
          />
        </div>
        <div className="flex flex-column align-items-center">
          <label className="mt-3 mb-3 font-semibold">Select Date Range</label>
          <Calendar
            value={dates}
            onChange={(e) => setDates(e.value)}
            selectionMode="range"
            readOnlyInput
            minDate={new Date(dateRange[0])}
            maxDate={new Date(dateRange[dateRange.length - 1])}
            showTime
            hourFormat="24"
          />
        </div>
        <div className="flex flex-column">
          <label className="mt-3 mb-3 font-semibold">
            Show Special Endpoint
          </label>
          <ToggleButton
            checked={checked}
            onChange={(e) => setChecked(e.value)}
            className="w-8rem"
          />
        </div>
        <div className="card flex justify-content-center align-items-end">
          <Button label="Reset" onClick={onReset} />
        </div>
      </div>
      <Line
        className="m-8"
        data={{
          labels: [...new Set(dateAndTimeLabels)],
          datasets: [
            {
              label: "/home",
              data: getChartData("/home"),
              fill: false,
              borderWidth: 1,
              backgroundColor: "green",
              borderColor: "green",
              responsive: true,
              spanGaps: true,
              showLine:
                activeEndpoint?.code === "" || activeEndpoint?.code === "/home",
              pointRadius:
                activeEndpoint?.code === "" || activeEndpoint?.code === "/home"
                  ? 3
                  : 0,
            },
            {
              label: "/product",
              data: getChartData("/product"),
              fill: false,
              borderWidth: 1,
              backgroundColor: "#000",
              borderColor: "#000",
              responsive: true,
              spanGaps: true,
              showLine:
                activeEndpoint?.code === "" ||
                activeEndpoint?.code === "/product",
              pointRadius:
                activeEndpoint?.code === "" ||
                activeEndpoint?.code === "/product"
                  ? 3
                  : 0,
            },
            {
              label: "/contact",
              data: getChartData("/contact"),
              fill: false,
              borderWidth: 1,
              backgroundColor: "red",
              borderColor: "red",
              responsive: true,
              spanGaps: true,
              showLine:
                activeEndpoint?.code === "" ||
                activeEndpoint?.code === "/contact",
              pointRadius:
                activeEndpoint?.code === "" ||
                activeEndpoint?.code === "/contact"
                  ? 3
                  : 0,
            },
          ],
        }}
      />
    </div>
  );
};

export default LineChart;
