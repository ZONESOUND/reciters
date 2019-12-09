const Max = require("max-api");
const googleTrends = require('google-trends-api');


Max.addHandler('daily', (geo) => {
	console.log('daily!');
	//, trendDate: new Date('2019-12-09')
	googleTrends.dailyTrends({ geo: geo }, dailyTrend);
});

function dailyTrend(err, results) {
	if(err) console.log('there was an error!', err);
	else {
		var data = JSON.parse(results)['default']['trendingSearchesDays'][0]['trendingSearches'];
		Max.post(`Got ${data.length} trendings`);
		Max.outlet("daily", data);
	}

}
