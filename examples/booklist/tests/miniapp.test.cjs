const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
function loadPage(relative) {
  const filename = path.join(root, 'miniprogram', relative);
  let definition;
  const calls = [];
  const wx = Object.fromEntries(['navigateTo', 'navigateBack', 'reLaunch', 'showToast'].map(name => [name, options => calls.push({ name, options })]));
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), { Page(value) { definition = value; }, require: createRequire(filename), wx }, { filename });
  const page = { ...definition, data: JSON.parse(JSON.stringify(definition.data)), setData(patch) { Object.assign(this.data, patch); } };
  return { page, calls };
}
const source = JSON.parse(fs.readFileSync(path.join(root, 'books.json'), 'utf8'));
test('打包数据完整复用原书单，ID 唯一且字段可用', () => {
  assert.deepEqual(require('../miniprogram/data/books'), source);
  assert.equal(new Set(source.map(book => book.id)).size, source.length);
  for (const book of source) for (const key of ['id', 'title', 'category', 'description']) assert.ok(typeof book[key] === 'string' && book[key].trim());
});
test('执行实际页面 JS：浏览 → 两类筛选 → 每本详情 → 返回后保留筛选', () => {
  const { page, calls } = loadPage('pages/books/index.js');
  page.onLoad();
  assert.deepEqual(JSON.parse(JSON.stringify(page.data.visibleBooks)), source);
  assert.deepEqual(JSON.parse(JSON.stringify(page.data.categories)), ['全部', '小说', '技术']);
  for (const [index, category] of [[1, '小说'], [2, '技术']]) {
    page.onCategoryChange({ detail: { value: String(index) } });
    assert.equal(page.data.selectedCategory, category);
    assert.equal(page.data.visibleBooks.length, 1);
    const expected = source.find(book => book.category === category);
    page.openDetail({ currentTarget: { dataset: { id: expected.id } } });
    const navigation = calls.at(-1);
    assert.equal(navigation.name, 'navigateTo');
    assert.equal(navigation.options.url, '/pages/detail/index?id=' + expected.id);
    const detail = loadPage('pages/detail/index.js');
    detail.page.onLoad({ id: new URL('https://local.test' + navigation.options.url).searchParams.get('id') });
    assert.deepEqual(JSON.parse(JSON.stringify(detail.page.data.book)), expected);
    detail.page.backToBooks();
    assert.equal(detail.calls.at(-1).name, 'navigateBack');
    assert.equal(page.data.selectedCategory, category);
  }
  page.onCategoryChange({ detail: { value: '0' } });
  assert.equal(page.data.visibleBooks.length, 2);
});
test('无效分类回退全部，无效书籍不跳转', () => {
  const { page, calls } = loadPage('pages/books/index.js');
  page.onCategoryChange({ detail: { value: '999' } });
  assert.equal(page.data.selectedCategory, '全部');
  assert.equal(page.data.visibleBooks.length, 2);
  page.openDetail({ currentTarget: { dataset: { id: 'missing' } } });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].name, 'showToast');
});
test('导航失败反馈；未知详情与直接进入的返回降级', () => {
  const list = loadPage('pages/books/index.js');
  list.page.openDetail({ currentTarget: { dataset: { id: 'b1' } } });
  list.calls[0].options.fail();
  assert.equal(list.calls.at(-1).name, 'showToast');
  const detail = loadPage('pages/detail/index.js');
  detail.page.onLoad({ id: 'missing' });
  assert.equal(detail.page.data.book, null);
  detail.page.backToBooks();
  detail.calls[0].options.fail();
  assert.equal(detail.calls.at(-1).name, 'reLaunch');
  assert.equal(detail.calls.at(-1).options.url, '/pages/books/index');
});
test('项目入口和页面文件齐全，JSON 能解析，WXML 事件有对应方法', () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'project.config.json')));
  assert.equal(config.compileType, 'miniprogram');
  assert.equal(config.appid, '');
  const app = JSON.parse(fs.readFileSync(path.join(root, config.miniprogramRoot, 'app.json')));
  for (const route of app.pages) {
    for (const suffix of ['js', 'json', 'wxml', 'wxss']) assert.ok(fs.existsSync(path.join(root, config.miniprogramRoot, route + '.' + suffix)));
    JSON.parse(fs.readFileSync(path.join(root, config.miniprogramRoot, route + '.json')));
    const { page } = loadPage(route + '.js');
    const template = fs.readFileSync(path.join(root, config.miniprogramRoot, route + '.wxml'), 'utf8');
    for (const binding of template.matchAll(/bind(?:tap|change)="([A-Za-z][\w]*)"/g)) assert.equal(typeof page[binding[1]], 'function');
  }
});
