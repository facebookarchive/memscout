// Copyright (c) Facebook, Inc. and its affiliates.

// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

document.getElementById('inputFile').addEventListener('change', handleFileSelect, false);

var ARENA_STATS_KEYS = ['0', 'merged']

class BinData {
	//Holds stats about each bin.

	constructor(size, allocated, nrequests, util) {
		this.size = size;
		this.allocated = allocated;
		this.nrequests = nrequests;
		this.util = util;
	}
}

class ArenaData {
	//Holds stats about arenas.

	constructor(allocated, active, util) {
		this.allocated = allocated;
		this.active = active;
		this.util = util;
	}
}

// Notice that the gap before this line is two lines.
class MemscoutData {
	//Holds stats parsed from jemalloc JSON dump.

	constructor() {
		// Holds the raw stats JSON blob.
		this.profiling_enabled = false;
		this.profiling_interval = -1;
		this.stats_dict = {};
		this.dirty_decay_time = -1;
		this.muzzy_decay_time = -1;
		this.num_configured_arenas = -1;
		this.allocated = -1;
		this.active = -1;
    this.fragmentation = 0.0;
		this.tcache_max = -1;
		this.dirty = -1;
		this.narenas = 0;
		// List holds ArenaData objects
		this.arenas = [];
		// List holds BinData objects
		this.bins = [];
	}

	parse(contents) {
		//Load the provided JSON file
		//
		this.stats_dict = JSON.parse(contents);

		this.stats_dict = this.stats_dict['jemalloc'];


		this.parseHeader();
		this.parseArenasStats();
	}

	parseHeader() {
		//Parse the header portions of the dump.

		this.profiling_enabled = this.stats_dict['opt']['prof'];
		this.profiling_interval = Math.pow(2,(this.stats_dict['opt']['lg_prof_sample']));

		this.dirty_decay_time = this.stats_dict['arenas']['dirty_decay_ms']
		this.muzzy_decay_time = this.stats_dict['arenas']['muzzy_decay_ms'];
		this.narenas = this.stats_dict['arenas']['narenas'];
		this.tcache_max = this.stats_dict['arenas']['tcache_max'];
		this.allocated = this.stats_dict['stats']['allocated'];
		this.active = this.stats_dict['stats']['active'];
    this.fragmentation = this.active > 0 ?
      100 * (1 - parseFloat(this.allocated)/parseFloat(this.active)) : 0.0;
	}

	parseBinsFromArenas(arenas, summary) {
		//Parse bin data from arenas.

		var bin_sizes = [];
		var bin_nregs = [];
		var bins = arenas['bin'];

		//assert(type(bins) == list)

		for (i = 0; i < bins.length; i++) {
			bin_sizes.push(bins[i]['size']);
			bin_nregs.push(bins[i]['nregs']);
		}

		var bin_stats = summary['bins'];

		//assert(bin_stats is not None)
		//assert(len(bin_stats) == len(bin_sizes))

		for (i = 0; i < bin_stats.length; i++) {
			var bin = bin_stats[i];
			var size = bin_sizes[i];
			var nregs = bin_nregs[i];
			var curregs = bin['curregs'];
			var curslabs = bin['curslabs'];
			var nrequests = bin['nrequests'];

			if(curregs && curslabs && nrequests) {
				var allocated = curregs * size;
				var util = curregs / (nregs * curslabs);
				if (util < 0 || util > 1) {
					util = 1.0;
				}
				this.bins.push(new BinData(size, allocated, nrequests, util));
			}
		}
	}

	parseArenas(arenas, arena_stats) {
		//Parse per arena stats.

		var page_size = arenas['page'];
		for (var key in arena_stats) {
			if (key != 'merged') {
				var allocated = 0;
				var active = 0;
				if (arena_stats[key]['small']) {
					allocated += arena_stats[key]['small']['allocated'];
				}
				if (arena_stats[key]['large']) {
					allocated += arena_stats[key]['large']['allocated'];
				}
				if (arena_stats[key]['pactive']) {
					active = arena_stats[key]['pactive'] * page_size;
				}
				var util;
				if (active == 0) {
					util = 0.0;
				} else {
					util = allocated/active;
				}
				this.arenas.push(new ArenaData(allocated, active, util));
			}
		}
	}

	parseArenasStats() {
		//Parse Arena stats.

		var arena_stats = this.stats_dict['stats.arenas']
		//keys = list(arena_stats.keys())

		// TODO: Fix for JS
		//if (!arena_stats && keys not in ARENA_STATS_KEYS) {
		//raise ValueError("No arena stats found")
		//}

		var summary;
		if ('0' in arena_stats) {
			summary = arena_stats['0']
		} else {
			summary = arena_stats['merged']
		}

		// Get the dirty pages.
		this.dirty = summary['pdirty']

		var arenas = this.stats_dict['arenas']

		this.parseBinsFromArenas(arenas, summary)
		this.parseArenas(arenas, arena_stats)

		this.profiling_enabled = false;
	}

}

function updateCharts(memscoutData) {
  pieUpdateData(memscoutData);
  scatterUpdateData(memscoutData);
	barSetData(memscoutData);
	tableSetData(memscoutData);
}

function loadContents(contents) {
	var m = new MemscoutData();
	m.parse(contents);
	updateCharts(m);
}

function onLoadFile(e) {
  loadContents(e.target.result);
}

function handleFileSelect(f) {
	var filename = f.target.files[0];
	if (!filename) {
		return;
	}

	var reader = new FileReader();
	reader.onload = function (e) {
		onLoadFile(e);
	}
	reader.readAsText(filename);
}
