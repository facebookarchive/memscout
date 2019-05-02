// Copyright (c) Facebook, Inc. and its affiliates.

// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

window.onload = scatterInit();

function scatterInit() {
}

function scatterSetData(dom, field_x, field_y, data, fmt) {
	var spec = {
		$schema: "https://vega.github.io/schema/vega-lite/v3.json",
    description: "A scatterplot showing horsepower and miles per gallons for various cars.",
    data: [],
    mark: {"type": "circle", "size": 80},
    width: 800,
    height: 400,
		encoding: {
      x: {"field": field_x,"type": "ordinal"},
      y: {"field": field_y,"type": "quantitative", "axis": {"format": fmt}},
		}
	}
  spec['data']['values'] = data;
  vegaEmbed(dom, spec);
}

function scatterUpdateData(m) {
  util = [];
  requests = [];
  allocated = [];
	for (var i = 0; i < m.bins.length; i++) {
    util.push({"bin size" : m.bins[i].size, "util" : m.bins[i].util});
    requests.push({"bin size" : m.bins[i].size, "num requests" : m.bins[i].nrequests});
    allocated.push({"bin size" : m.bins[i].size, "allocated" : m.bins[i].allocated});
	}

  scatterSetData("#scatter-chart-area1", "bin size", "util", util, "0.1f");
  scatterSetData("#scatter-chart-area2", "bin size", "num requests", requests, ".0s");
  scatterSetData("#scatter-chart-area3", "bin size", "allocated", allocated, ".0s");
}
