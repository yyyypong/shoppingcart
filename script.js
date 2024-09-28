// 商品数据
const products = [
    { id: 1, name: '下厨一次', price: 5, image: 'image/picture.svg', category: '家务' },
    { id: 2, name: '盲盒', price: 5, image: 'image/picture.svg', category: '功能牌' },
    { id: 3, name: '陪玩一次', price: 5, image: 'image/picture.svg', category: '服务类' },
    { id: 4, name: '家务一次', price: 5, image: 'image/picture.svg', category: '家务' },
    { id: 5, name: '做爱礼包', price: 5, image: 'image/picture.svg', category: '电服务类' },
    { id: 6, name: '实现一个小愿望', price: 5, image: 'image/picture.svg', category: '功能牌' },
    { id: 7, name: '跑腿一次', price: 5, image: 'image/picture.svg', category: '服务类' },
    { id: 8, name: '调酒一次', price: 5, image: 'image/picture.svg', category: '服务类' },
    { id: 9, name: '万能牌', price: 5, image: 'image/picture.svg', category: '功能牌' },
    { id: 10, name: '看电影一次', price: 5, image: 'image/picture.svg', category: '娱乐' },
    { id: 11, name: '爱心早餐一个礼拜', price: 5, image: 'image/picture.svg', category: '家务' },
];

// 购物车数据
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 显示商品列表
let currentPage = 1;
const itemsPerPage = 12;

function displayProducts(productsToShow = products, page = 1) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = productsToShow.slice(startIndex, endIndex);

    const productsSection = document.getElementById('products');
    productsSection.innerHTML = paginatedProducts.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" class="product-image" alt="${product.name}" data-bs-toggle="modal" data-bs-target="#imageModal">
            </div>
            <div class="product-details">
                <h5 class="product-title">${product.name}</h5>
                <p class="product-price">价格: ${product.price}元</p>
                <p class="product-category">类别: ${product.category}</p>
                <button onclick="addToCart(${product.id})" class="btn btn-primary btn-add-to-cart">加入购物车</button>
            </div>
        </div>
    `).join('');

    // 添加图片点击事件
    document.querySelectorAll('.product-image').forEach(img => {
        img.addEventListener('click', function() {
            document.getElementById('modalImage').src = this.src;
        });
    });

    updatePagination(productsToShow.length, page);
}

function updatePagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    
    let paginationHTML = `
        <button class="btn btn-secondary" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>上一页</button>
        <span class="mx-3">第 ${currentPage} 页，共 ${totalPages} 页</span>
        <button class="btn btn-secondary" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>下一页</button>
    `;
    
    paginationElement.innerHTML = paginationHTML;
}

function changePage(newPage) {
    currentPage = newPage;
    displayProducts(products, currentPage);
}

// 添加商品到购物车
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    saveCartToLocalStorage();
}

// 从购物车移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToLocalStorage();
}

// 更新购物车显示
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = cart.map(item => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            ${item.name} - 数量: ${item.quantity} - 价格: ${item.price * item.quantity}元
            <button onclick="removeFromCart(${item.id})" class="btn btn-danger btn-sm">删除</button>
        </li>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = total;
}

// 保存购物车到本地存储
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 结账功能
document.getElementById('checkout').addEventListener('click', function() {
    const paymentCode = prompt('请输入付款码:');
    if (paymentCode === '123456') { // 假设正确的付款码是123456
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        alert(`付款成功！总金额: ${total}元，嘻嘻嘻嘻后端提示功能我还没设置，可以拿兑换码找我兑换嘻嘻嘻嘻，兑换码是：徐江雨和庞蕊儿在一起一辈子！`);
        cart = [];
        updateCart();
        saveCartToLocalStorage();
    } else {
        alert('付款失败：付款码错误');
    }
});

// 搜索功能
document.getElementById('search').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
});

// 别筛选功能
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    const categories = [...new Set(products.map(product => product.category))];
    categoryFilter.innerHTML += categories.map(category => 
        `<option value="${category}">${category}</option>`
    ).join('');
}

document.getElementById('category-filter').addEventListener('change', function() {
    const selectedCategory = this.value;
    const filteredProducts = selectedCategory 
        ? products.filter(product => product.category === selectedCategory)
        : products;
    displayProducts(filteredProducts);
});

// 初始化
displayProducts();
updateCart();
populateCategoryFilter();

// 目录菜单功能
const catalogueBtn = document.getElementById('catalogueBtn');
const catalogueMenu = document.querySelector('.catalogue-menu');
const catalogueClose = document.getElementById('catalogueClose');

catalogueBtn.addEventListener('click', () => {
    catalogueMenu.classList.add('active');
});

catalogueClose.addEventListener('click', () => {
    catalogueMenu.classList.remove('active');
});

// 点击目录外区域关闭目录
catalogueMenu.addEventListener('click', (e) => {
    if (e.target === catalogueMenu) {
        catalogueMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4 product-card';
    card.style.animationDelay = `${0.1 * (index % 10)}s`; // 动态设置动画延迟
    card.innerHTML = `
        <div class="card h-100">
            <div class="product-image-container">
                <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
            </div>
            <div class="card-body product-details">
                <h5 class="card-title product-title">${product.name}</h5>
                <p class="card-text product-price">价格: ¥${product.price}</p>
                <p class="card-text product-category">类别: ${product.category}</p>
                <button class="btn btn-primary btn-add-to-cart" data-id="${product.id}">加入购物车</button>
            </div>
        </div>
    `;
    return card;
}
