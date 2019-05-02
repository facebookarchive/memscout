// Copyright (c) Facebook, Inc. and its affiliates.

// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

// Functions ----------------------------------------------------------------------

function setData(dom, data, fmt, xtitle) {
	var spec = {
		$schema: "https://vega.github.io/schema/vega-lite/v3.json",
    width: 400,
    height: 400,
		mark: 'bar',
    data: [],
		encoding: {
			x: {
				bin: true,
        field: 'u',
				type: 'quantitative',
				axis: {"format": fmt, "title": xtitle},
			},
			y: {
				aggregate: "count",
				type: 'quantitative',
				"axis": {"title": "Number of arenas"},
			}
		}
	}
  spec['data']['values'] = data;
  vegaEmbed(dom, spec);
}

function barSetData(m) {
  var	utilArr = [];

	for (var i = 0; i < m.arenas.length; i++) {
    utilArr.push({"u" : m.arenas[i].util});
  }

  setData('#bar-view', utilArr, "g", "Arena utilization(normalized)");

	utilArr = [];
	for (var i = 0; i < m.arenas.length; i++) {
    utilArr.push({"u" : m.arenas[i].allocated});
	}

  setData('#bar-view2', utilArr, "s", "Arena size");
}
