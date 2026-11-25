// Run with node scripts/test-calendar.cjs. No browser or dependencies required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
const context = {
  Intl, Date, window: {addEventListener() {}},
  document: {
    querySelector: selector => selector.includes('ld+json') ? {textContent: schema} : null,
    querySelectorAll: () => [], addEventListener() {},
  },
  setTimeout() {}, clearTimeout() {},
};
vm.runInNewContext(fs.readFileSync(path.join(root, 'calendar.js'), 'utf8'), context);
const calendar = context.window.RestaurantCalendar;
for (const day of ['2026-12-24', '2026-12-25', '2027-01-01']) {
  const hours = calendar.forDate(day);
  assert.equal(hours?.opens, hours?.closes, `${day}: restaurant must be closed for the holiday`);
}
const reopening = calendar.forDate('2026-12-26');
assert.equal(reopening.opens, '17:00', '26 December: reopen at 17:00');
assert.equal(reopening.closes, '22:30', '26 December: keep the regular Saturday closing time');
for (const [day, opens, closes] of [
  ['2026-12-23', '11:30', '22:00'],
  ['2026-12-27', '11:30', '22:30'],
  ['2026-12-28', '00:00', '00:00'],
  ['2027-01-02', '11:30', '22:30'],
  ['2026-11-02', '08:00', '22:00'],
  ['2026-11-03', '00:00', '00:00'],
]) {
  const hours = calendar.forDate(day);
  assert.equal(hours.opens, opens, `${day}: correct opening`);
  assert.equal(hours.closes, closes, `${day}: correct closing`);
}
assert.equal(calendar.forDate('2026-02-30'), null);
console.log('Calendar: holiday exceptions, reopening and regular schedules passed.');
