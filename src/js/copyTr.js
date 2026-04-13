$(document).ready(function () {
	// let stratsCount = 0;
	let allStrats = [];
	let isMT5 = true;

	const apiMT4 = '/api/copy/strategies';
	const apiMT5 = 'https://copytrading.onfin.group/api/partner/v1/strategies.search';
	const investors = ['investor', 'investors'];
	const days = ['day', 'days'];

	let apiUrl = isMT5 ? apiMT5 : apiMT4;

	// const countField = $('div[field=tn_text_1697334385688]');
	const bestStrats = [
		{
			'name': $('div[field=tn_text_1732111770884]'),
			'subsCount': $('div[field=tn_text_1732111770887]')
		},
		{
			'name': $('div[field=tn_text_1732111427036]'),
			'subsCount': $('div[field=tn_text_1732111427039]')
		},
		{
			'name': $('div[field=tn_text_1732111462187]'),
			'subsCount': $('div[field=tn_text_1732111462189]')
		}
	];

	const fullStratsData = [
		{
			'name': $('div[field=tn_text_1732111770884]'),
			'firstLetter': $('div[field=tn_text_1702038602913]'),
			'days': $('div[field=tn_text_1732111316179]'),
			'graph': $('img[imgfield=tn_img_1732111612682]'),
			'yield': $('div[field=tn_text_1732111282090]'),
			'tools': $('div[field=tn_text_1732111700053]')
		},
		{
			'name': $('div[field=tn_text_1732111427036]'),
			'firstLetter': $('div[field=tn_text_1702038946873]'),
			'days': $('div[field=tn_text_1732111830352]'),
			'graph': $('img[imgfield=tn_img_1732111627763]'),
			'yield': $('div[field=tn_text_1732111830349]'),
			'tools': $('div[field=tn_text_1732111702952]')
		},
		{
			'name': $('div[field=tn_text_1732111462187]'),
			'firstLetter': $('div[field=tn_text_1702038946873]'),
			'days': $('div[field=tn_text_1732111850650]'),
			'graph': $('img[imgfield=tn_img_1732111553337]'),
			'yield': $('div[field=tn_text_1732111850648]'),
			'tools': $('div[field=tn_text_1732111641802]')
		}
	];

	getStratData(true);

	function getStratData(isBest = false) {
		if (isBest) {
			$.post(apiUrl, JSON.stringify({
				'type': 'best'
			}))
				.done(function (data) {
					delNulls(data.strategies.sort((a, b) => b.yield - a.yield));
					fillThePage();
				});
		} else {
			$.getJSON(apiUrl, function (data) {
				if (!isMT5) { // MT4
					delNulls(data);
				} else { // MT5
					delNulls(data.strategies);
				}
				// stratsCount = data.length;
				fillThePage();
			});
		}
	}

	function fillThePage() {
		// countField.text(stratsCount);
		for (let i = 0; i < bestStrats.length; i++) {
			if (!isMT5) { // MT4
				bestStrats[i].name.text(allStrats[i].data.name);
				bestStrats[i].subsCount.text(allStrats[i].data.subscribers + ' ' + numWord(allStrats[i].data.subscribers, investors));
			} else { // MT5
				bestStrats[i].name.text(allStrats[i].name);
				bestStrats[i].subsCount.text(allStrats[i].investments + ' ' + numWord(allStrats[i].investments, investors));
			}
		}
		for (let i = 0; i < fullStratsData.length; i++) {
			if (!isMT5) { // MT4
				fullStratsData[i].name.text(allStrats[i].data.name);
				fullStratsData[i].firstLetter.text(allStrats[i].data.name.substring(0, 1));
				fullStratsData[i].days.text(allStrats[i].data.days + ' ' + numWord(allStrats[i].data.days, days));
				fullStratsData[i].graph.parent().attr('id', 'chart_' + allStrats[i].idstrategy);
				fullStratsData[i].yield.text('+' + (allStrats[i].data.yield * 100).toFixed(2) + '%');
				fullStratsData[i].tools.html(concatTools(allStrats[i]));
			} else { // MT5
				fullStratsData[i].name.text(allStrats[i].name);
				fullStratsData[i].days.text(allStrats[i].days + ' ' + numWord(allStrats[i].days, days));
				fullStratsData[i].graph.parent().attr('id', 'chart_' + allStrats[i].id);
				fullStratsData[i].yield.text('+' + (allStrats[i].yield).toFixed(2) + '%');
				// fullStratsData[i].tools.html(concatTools(allStrats[i]));
			}
			createChart(allStrats[i]);
		}
	}

	function concatTools(strat) {
		let result = '';
		const portfolio = strat.data.portfolio;
		for (let i = 0; i < portfolio.length; i++) {
			if (portfolio[i].symbol != '' && portfolio[i].symbol != 'OTHER') {
				result += portfolio[i].symbol + ' | ';
			}
		}
		return result;
	}

	function delNulls(arr) {
		let yield;
		for (let i = 0; i < arr.length; i++) {
			if (!isMT5) { // MT4
				yield = arr[i].data.yield;
			} else { // MT5
				yield = arr[i].yield;
			}
			if (yield) {
				allStrats.push(arr[i]);
			}
		}
	}

	function createChart(strat) {
		Highcharts.chart('chart_' + (isMT5 ? strat.id : strat.idstrategy), {
			chart: {
				width: 101,
				height: 47,
				type: 'areaspline',
				backgroundColor: null
			},
			exporting: { enabled: false },
			title: {
				text: ''
			},
			subtitle: {
				text: ''
			},
			legend: { enabled: false },
			colors: ['#9FCE10'],
			tooltip: { enabled: false },
			accessibility: { enabled: false },

			yAxis: {
				title: {
					text: ''
				},
				labels: {
					enabled: false
				},
			},
			xAxis: {
				labels: {
					enabled: false
				},
			},
			plotOptions: {
				areaspline: {
					fillColor: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0, '#d5e1f5'], // start
							[0.25, '#d5e1f5'], // middle
							[1, 'rgba(255, 255, 255, 0.0)'] // end
						]
					},
					lineWidth: 2,
					threshold: null
				},
				series: {
					marker: {
						enabled: false
					}
				}
			},
			series: [
				{
					name: '',
					data: isMT5 ? strat.chartYieldSmall : strat.data.chart_yield_small
				}
			]
		});
	}

	const numWord = (value, words) => {
		value = Math.abs(value);
		if (value == 1) {
			return words[0];
		}
		return words[1];
	}
});





