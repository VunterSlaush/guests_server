function monthDiff(d1, d2) {
	let d;

	if (d1 < d2) {
		d = d2;
		d2 = d1;
		d1 = d;
	}

	var m =
		(d1.getFullYear() - d2.getFullYear()) * 12 +
		(d1.getMonth() - d2.getMonth());
	if (d1.getDate() < d2.getDate()) --m;
	return m;
}

function dateCheck(from, to, check) {
	if (check <= to && check >= from) {
		return true;
	}
	return false;
}

function calculateYearsOfExperience(experiences) {
	if (!experiences || experiences.length == 0) return 0;
	let months = 0;
	let now = new Date();
	let sorted = experiences
		.filter(exp => (exp.begin ? true : false))
		.sort((a, b) => {
			return new Date(a.begin) - new Date(b.begin);
		})
		.map(experience => {
			if (!experience.end) experience.end = now;
			return { begin: experience.begin, end: experience.end };
		});

	let begin;
	let end;
	for (var i in sorted) {
		let dif = 0;
		if (!end && !begin) {
			dif = monthDiff(sorted[i].begin, sorted[i].end);
			begin = sorted[i].begin;
			end = sorted[i].end;
		} else if (
			!dateCheck(begin, end, sorted[i].begin) &&
			!dateCheck(begin, end, sorted[i].end)
		) {
			dif = monthDiff(sorted[i].begin, sorted[i].end);
			end = sorted[i].end;
		} else if (dateCheck(begin, end, sorted[i].begin)) {
			dif = monthDiff(end, sorted[i].end);
			end = sorted[i].end;
		}
		months += dif;
	}
	return months / 12;
}

module.exports = { dateCheck, monthDiff, calculateYearsOfExperience };
