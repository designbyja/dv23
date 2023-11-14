console.log("Displaying simple bar chart");

// Declare the chart dimensions and margins.
const width = 928;
const height = 500;
const marginTop = 30;
const marginRight = 0;
const marginBottom = 30;
const marginLeft = 80;

async function fetchData() {
  const url = "./data.json";
  let response = await fetch(url);

  if (response.ok) {
    // if HTTP-status is 200-299
    // get the response body (the method explained below)
    let json = await response.json();
    console.log("Finally received the response:");
    console.log("Response: ", json);
    drawChart(json);
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

function drawChart(data) {
  // Declare the x (horizontal position) scale.
  const x = d3
    .scaleBand()
    .domain(
      d3.groupSort(
        data,
        ([d]) => -d.Above_ground_potential_storage,
        (d) => d.Habitat_name
      )
    ) // descending frequency
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  // Declare the y (vertical position) scale.
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.Above_ground_potential_storage)])
    .range([height - marginBottom, marginTop]);

  // Create the SVG container.
  const svg = d3
    .select("#d3")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    // slight change in styling to take up whole width
    // also check ./style.css
    .attr("style", "max-width: 100%; height: auto; width: 100%;");

  // Add a rect for each bar.
  svg
    .append("g")
    .attr("fill", "steelblue")
    .selectAll()
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.Habitat_name))
    .attr("y", (d) => y(d.Above_ground_potential_storage))
    .attr("height", (d) => y(0) - y(d.Above_ground_potential_storage))
    .attr("width", x.bandwidth());

  // Add the x-axis and label.
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add the y-axis and label, and remove the domain line.
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).tickFormat((y) => y.toFixed()))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Above_ground_current_storage (tC)")
    );
}

fetchData();
