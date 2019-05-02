// Copyright (c) Facebook, Inc. and its affiliates.

// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

// Functions ----------------------------------------------------------------------

function pieSetData(data) {
	var spec = {
		$schema: "https://vega.github.io/schema/vega-lite/v3.json",
		description: "A bar chart that sorts the y-values by the x-values.",
    width: 800,
    height: 300,
		transform: [{
			"window": [{
				"op": "sum",
				"field": "allocated",
				"as": "allocated_sum"
			}],
			"frame": [null, null]
		},
			{
				"calculate": "datum.allocated/datum.allocated_sum * 100",
				"as": "% of allocated"
			}],
		data: [],
		mark: "bar",
		encoding: {
			x: {
				field: "bin size",
				type: "ordinal",
				scale: {"rangeStep": 17},
				sort: {"encoding": "y", "order": "descending"}
			},
			y: {
				field: "% of allocated",
				type: "quantitative",
			},
			tooltip: [
				{"field": "bin size", "type": "quantitative"},
				{"field": "% of allocated", "type": "quantitative"},
				{"field": "allocated", "type": "quantitative"},
			]
		}
	}
  spec['data']['values'] = data;
  vegaEmbed('#pie-chart-area', spec);

	var spec2 = {
		$schema: "https://vega.github.io/schema/vega-lite/v3.json",
		width: 800,
		data: [],
		transform: [{
			"window": [{
				"op": "sum",
				"field": "allocated",
				"as": "allocated_sum"
			}],
			"frame": [null, null]
		},
			{
				"calculate": "datum.allocated/datum.allocated_sum * 100",
				"as": "% of allocated"
			}],
		mark: "bar",
		encoding: {
			x: {
				"aggregate": "sum", "field": "allocated", "type": "quantitative",
				"axis": {"title": "Allocation breakdown by bin size (normalized)"},
				"stack":  "normalize",
				"sort": {"op": "sum", "field":"allocated", "order": "descending"},
			},
			y: {
				"type": "ordinal",
				"scale": {"rangeStep": 17}
			},
			color: {
				"field": "bin size", "type": "nominal", "legend": false
			},
			order: {"aggregate": "sum", "field": "allocated", "type": "quantitative", "sort":"descending"},
			tooltip: [
				{"field": "bin size", "type": "quantitative"},
				{"field": "% of allocated", "type": "quantitative"},
				{"field": "allocated", "type": "quantitative"},
			]
		}
	}

  spec2['data']['values'] = data;
  vegaEmbed('#pie-chart-area2', spec2);
}

function pieUpdateData(m) {
	data = [];
	for (var i = 0; i < m.bins.length; i++) {
    data.push({"allocated" : m.bins[i].allocated, "bin size" : m.bins[i].size, "dummy" : "1"});
	}
	pieSetData(data);
}
