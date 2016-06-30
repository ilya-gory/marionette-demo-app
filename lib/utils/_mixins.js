_.mixin({
	hashString(s){
		let hash = 0;
		let i;
		if (s.length == 0) return hash;
		for (i = 0; i < s.length; i++) {
			let char = s.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash;
		}
		return hash;
	},
	pstemplate(string, paramsAccumulator) {
		if (!string) {
			return;
		}
		if (_.isArray(paramsAccumulator)) {
			string.replace(_.templateSettings.interpolate, (s, k)=> paramsAccumulator.push(k));
		}
		return _.template(string);
	},
	stringifyURL(parsed) {
		let buf = `${parsed.protocol}://${parsed.host}`;
		if (parsed.port) buf += `:${parsed.port}`;
		buf += parsed.path;
		if (!_.isEmpty(parsed.params)) {
			let p = _.reduce(parsed.params, (m, pv, pk)=> {
				m.push(`${pk}=${pv}`);
				return m;
			}, []);
			buf += `?${p.join('&')}`
		}
		return buf;
	},
	parseURL(url) {
		let a = document.createElement('a');
		a.href = url;
		return {
			source:   url,
			protocol: a.protocol.replace(':', ''),
			host:     a.hostname,
			port:     parseInt(a.port),
			query:    a.search,
			params:   (() => {
				let ret = {},
					seg = a.search.replace(/^\?/, '').split('&'),
					s;
				_.each(seg, (x)=> {
					s = x.split('=');
					let v = s[1];
					if (!_.isUndefined(v)) {
						ret[s[0]] = v;
					}
				});
				return ret;
			})(),
			file:     (a.pathname.match(/([^\?#]+)$/i) || [, ''])[1],
			hash:     a.hash.replace('#', ''),
			path:     a.pathname.replace(/^([^\/])/, '/$1'),
			relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
			segments: a.pathname.replace(/^\//, '').split('/')
		}
	},
	/**
	 * @param {Date} date
	 * @return {String}
	 */
	date(date){
		let yyyy = date.getFullYear();
		let mm = date.getMonth() + 1;
		if (mm < 10) {
			mm = '0' + mm;
		}
		let dd = date.getDate();
		if (dd < 10) {
			dd = '0' + dd;
		}
		return `${yyyy}-${mm}-${dd}`;
	}
});