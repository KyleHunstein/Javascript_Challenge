// Fetch the JSON data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
const sample_data = data.samples;
const metadata = data.metadata;

// Populate the dropdown with sample IDs
const dropdown = d3.select("#selDataset");
sample_data.forEach((d) => {
dropdown
.append("option")
.text(d.id)
.property("value", d.id);
});
dropdown.on("change", () => optionChanged(dropdown.property("value")));

// Function to update the visualizations when a new sample is selected
function optionChanged(newSample) {
// Find the metadata for the selected sample
const selectedMetadata = metadata.filter((d) => d.id == newSample)[0];
// Display the metadata
const demoInfo = d3.select("#sample-metadata");
demoInfo.html("");
Object.entries(selectedMetadata).forEach((d) => {
  demoInfo.append("p").text(`${d[0]}: ${d[1]}`);
});

// Find the sample data for the selected sample
const selectedSample = sample_data.filter((d) => d.id == newSample)[0];

// Create the horizontal bar chart
const barData = [
  {
    x: selectedSample.sample_values.slice(0, 10),
    y: selectedSample.otu_ids.slice(0, 10).map((d) => `OTU ${d}`),
    type: "bar",
    orientation: "h",
    text: selectedSample.otu_labels.slice(0, 10),
  },
];
Plotly.newPlot("bar", barData);

// Create the bubble chart
const bubbleData = [
  {
    x: selectedSample.otu_ids,
    y: selectedSample.sample_values,
    mode: "markers",
    marker: {
      size: selectedSample.sample_values,
      color: selectedSample.otu_ids,
    },
    text: selectedSample.otu_labels,
  },
];
Plotly.newPlot("bubble", bubbleData);
}

// Update the visualizations with the first sample by default
optionChanged(sample_data[0].id);
});