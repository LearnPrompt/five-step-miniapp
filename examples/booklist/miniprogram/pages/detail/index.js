const books = require('../../data/books');
Page({
  data: { book: null },
  onLoad(options) { this.setData({ book: books.find(book => book.id === options.id) || null }); },
  backToBooks() { wx.navigateBack({ delta: 1, fail() { wx.reLaunch({ url: '/pages/books/index' }); } }); }
});
