import databaseData from '../data/database.json';

class DataService {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem('appDatabase');
      if (stored) {
        return JSON.parse(stored);
      }
      return { ...databaseData };
    } catch (error) {
      console.error('Error loading data:', error);
      return { ...databaseData };
    }
  }

  saveData() {
    try {
      localStorage.setItem('appDatabase', JSON.stringify(this.data));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  // Product methods
  getProducts() {
    return this.data.products || [];
  }

  getProduct(id) {
    return this.data.products?.find(p => p.id === parseInt(id));
  }

  addProduct(product) {
    const newId = Math.max(...this.data.products.map(p => p.id), 0) + 1;
    const newProduct = { ...product, id: newId };
    this.data.products.push(newProduct);
    this.saveData();
    return newProduct;
  }

  updateProduct(id, updates) {
    const index = this.data.products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      this.data.products[index] = { ...this.data.products[index], ...updates };
      this.saveData();
      return this.data.products[index];
    }
    return null;
  }

  deleteProduct(id) {
    const index = this.data.products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      this.data.products.splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  // User methods
  getUsers() {
    return this.data.users || [];
  }

  getUser(id) {
    return this.data.users?.find(u => u.id === parseInt(id));
  }

  getUserByEmail(email) {
    return this.data.users?.find(u => u.email === email);
  }

  addUser(user) {
    const newId = Math.max(...this.data.users.map(u => u.id), 0) + 1;
    const newUser = {
      ...user,
      id: newId,
      createdAt: new Date().toISOString(),
      orders: [],
      wishlist: [],
      addresses: []
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  updateUser(id, updates) {
    const index = this.data.users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      this.data.users[index] = { ...this.data.users[index], ...updates };
      this.saveData();
      return this.data.users[index];
    }
    return null;
  }

  // Order methods
  getOrders() {
    return this.data.orders || [];
  }

  getOrder(id) {
    return this.data.orders?.find(o => o.id === parseInt(id));
  }

  getUserOrders(userId) {
    return this.data.orders?.filter(o => o.userId === parseInt(userId)) || [];
  }

  addOrder(order) {
    const newId = Math.max(...this.data.orders.map(o => o.id), 0) + 1;
    const newOrder = {
      ...order,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    this.data.orders.push(newOrder);
    this.saveData();
    return newOrder;
  }

  updateOrder(id, updates) {
    const index = this.data.orders.findIndex(o => o.id === parseInt(id));
    if (index !== -1) {
      this.data.orders[index] = { ...this.data.orders[index], ...updates };
      this.saveData();
      return this.data.orders[index];
    }
    return null;
  }

  // Categories
  getCategories() {
    return [
      { id: 'unpolished-pulses-dals-rice', name: 'Unpolished Pulses, Dals & Rice' },
      { id: 'poha-aval', name: 'Poha / Aval' },
      { id: 'sugars-honey', name: 'Sugars & Honey' },
      { id: 'haircare-products', name: 'Haircare Products' },
      { id: 'skincare-products', name: 'Skincare Products' },
      { id: 'millet-items', name: 'Millet Items' },
      { id: 'powders', name: 'Powders' },
      { id: 'fries', name: 'Fries' },
      { id: 'herbal-handmade-soaps', name: 'Herbal Handmade Soaps' },
      { id: 'snacks', name: 'Snacks' },
      { id: 'herbal-products', name: 'Herbal Products' },
      { id: 'herbal-powders', name: 'Herbal Powders' }
    ];
  }

  // Authentication
  authenticate(email, password) {
    const users = this.data.users || [];
    const user = users.find(u => (u.email === email || u.username === email) && u.password === password);
    return user || null;
  }

  // Settings
  getSettings() {
    return this.data.settings || {};
  }

  updateSettings(updates) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData();
    return this.data.settings;
  }
}

export const dataService = new DataService();
export default dataService;