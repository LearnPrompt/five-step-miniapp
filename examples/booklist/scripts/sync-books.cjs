const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const books = JSON.parse(fs.readFileSync(path.join(root, 'books.json'), 'utf8'));
if (!Array.isArray(books)) throw new Error('books.json 必须是数组');
const ids = new Set();
for (const book of books) {
  for (const key of ['id', 'title', 'category', 'description']) {
    if (typeof book[key] !== 'string' || !book[key].trim()) throw new Error('书籍字段缺失或无效：' + key);
  }
  if (ids.has(book.id)) throw new Error('重复书籍 ID：' + book.id);
  ids.add(book.id);
}
fs.writeFileSync(path.join(root, 'miniprogram/data/books.js'), '// 由 npm run sync:data 从 books.json 生成。\nmodule.exports = ' + JSON.stringify(books, null, 2) + ';\n');
console.log('已同步 ' + books.length + ' 本书（本地数据，无网络请求）');
