// Copyright (c) Facebook, Inc. and its affiliates.

// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

// Make sure ths indexes match.
var summary = ['Number of Arenas', 'Allocated Memory', 'Active(Held) Memory',
	'Tcache Size', 'Number of Dirty Pages', 'Fragmentation',
	'Profiling Interval', 'Decay Time'];

function initTables() {
	var table = document.getElementById("summary");
	for (var i = 0; i < summary.length; i++) {
		var row = table.insertRow(-1);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		cell1.innerHTML = summary[i];
		cell1.style.width = 10;
		cell2.style.width = 10;
	}

	var definitions = new Map([
		['Allocated Memory', 'Memory granted to the application'],
		['Active(Held) Memory', 'Memory controlled by jemalloc on behalf of the application'],
		['Fragmentation', 'Memory held by the allocator, but, not given to the application'],
		['Arena', 'Independent memory allocation area'],
		['Bin', 'Size-classes to which allocations are mapped to'],
		['Profiling Interval', 'Incremental number of bytes at which a backtrace is taken']]);


	definitions.forEach(function (value, key, map) {
		var table = document.getElementById("definitions");
		var row = table.insertRow(-1);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		cell1.innerHTML = key;
		cell2.innerHTML = value;
	});

}

function tableSetData(m) {
	var table = document.getElementById("summary");
	rows = table.rows;

	// Inefficient to lookup indexes like this but the array is small. Once we finalize
	// what to report in the table hardcode indexes or do some Map tricks.

	rows[summary.indexOf('Number of Arenas')].cells[1].innerHTML = m.narenas;
	rows[summary.indexOf('Allocated Memory')].cells[1].innerHTML = m.allocated;
	rows[summary.indexOf('Active(Held) Memory')].cells[1].innerHTML = m.active;
	rows[summary.indexOf('Tcache Size')].cells[1].innerHTML = m.tcache_max;
	rows[summary.indexOf('Number of Dirty Pages')].cells[1].innerHTML = m.dirty;
	rows[summary.indexOf('Fragmentation')].cells[1].innerHTML = m.fragmentation.toFixed(2) + "%";
	rows[summary.indexOf('Profiling Interval')].cells[1].innerHTML = m.profiling_interval;
	rows[summary.indexOf('Decay Time')].cells[1].innerHTML = m.dirty_decay_time;
}
