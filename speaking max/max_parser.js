const Max = require("max-api");
const googleTrends = require('google-trends-api');


Max.addHandler('daily', (geo) => {
	googleTrends.dailyTrends({ geo: geo }, dailyTrend);
});

Max.addHandler('realtime', (geo) => {
	googleTrends.realTimeTrends({geo: geo, category: 'all'}, realtimeTrend);
})

function dailyTrend(err, results) {
	if(err) {
		Max.post('dailyTrend error');
		console.log('In dailyTrend: ', err);
	}
	else {
		if (results[0] != '{') {
			Max.post('failed to parse result');
			console.log('Failed to parse: ', results);
			return;
		}
		var data = JSON.parse(results)['default']['trendingSearchesDays'][0]['trendingSearches'];
		Max.post(`Got ${data.length} daily trends`);
		Max.outlet('daily', data);
	}
}

function realtimeTrend(err, results) {
	if(err) {
		Max.post('realtimeTrend error');
		console.log('In dailyTrend: ', err);
	}
	else {
		if (results[0] != '{') {
			Max.post('failed to parse result');
			console.log('Failed to parse: ', results);
			return;
		}
		var data = JSON.parse(results)['storySummaries']['trendingStories'];
		Max.post(`Got ${data.length} realtime trends.`);
		Max.outlet("realtime", data);
	}
}