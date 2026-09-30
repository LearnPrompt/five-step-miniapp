const books = require('../../data/books');
const categories = ['全部'].concat(Array.from(new Set(books.map(book => book.category))));
Page({
  data: { categories, selectedIndex: 0, selectedCategory: '全部', visibleBooks: [] },
  onLoad() { this.applyCategory(0); },
  applyCategory(index) {
    const selectedIndex = Number.isInteger(index) && index >= 0 && index < categories.length ? index : 0;
    const selectedCategory = categories[selectedIndex];
    this.setData({ selectedIndex, selectedCategory, visibleBooks: books.filter(book => selectedCategory === '全部' || book.category === selectedCategory) });
  },
  onCategoryChange(event) { this.applyCategory(Number(event.detail.value)); },
  openDetail(event) {
    const id = event.currentTarget.dataset.id;
    if (!books.some(book => book.id === id)) { wx.showToast({ title: '这本书暂不可用', icon: 'none' }); return; }
    wx.navigateTo({ url: '/pages/detail/index?id=' + encodeURIComponent(id), fail() { wx.showToast({ title: '打开详情失败，请重试', icon: 'none' }); } });
  }
});
