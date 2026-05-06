/**
 * Long An Decor - Vanilla JS Implementation
 */

// --- Constants & Initial Data ---
const CATEGORIES = ['Đèn', 'Tranh', 'Cây giả', 'Decor bàn', 'Khác'];

const INITIAL_PRODUCTS = [
    { id: 'P001', name: 'Đèn bàn Gốm Thủ Công', category: 'Đèn', price: 1250000, stock: 15, imageUrl: 'https://vn-fpt.azcloudstorage.com/den379.com/4-den-ban-2.jpg', createdAt: new Date().toISOString() },
    { id: 'P002', name: 'Đèn để bàn phòng khách', category: 'Đèn', price: 1500000, stock: 8, imageUrl: 'https://sundecor.vn/wp-content/uploads/2025/01/den-ban-phong-ngu-led-cao-cap-gp048db-d-1.jpg', createdAt: new Date().toISOString() },
    { id: 'P003', name: 'Tranh Canvas Trừu Tượng', category: 'Tranh', price: 850000, stock: 12, imageUrl: 'https://brocanvas.vn/wp-content/uploads/2024/05/Tranh-Canvas-Truu-Tuong-Mau-Acrylic-Song-Bien-Treo-Tuong-Trang-Tri-Decor-Khach-San-Nha-Hang-BRO6806.jpg', createdAt: new Date().toISOString() },
    { id: 'P004', name: 'Tranh Phong Cảnh', category: 'Tranh', price: 5500000, stock: 20, imageUrl: 'https://buulong.com.vn/wp-content/uploads/2026/03/nhung-buc-tranh-phong-canh-dep-3.jpg', createdAt: new Date().toISOString() },
    { id: 'P005', name: 'Cây Bàng Singapore Giả', category: 'Cây giả', price: 450000, stock: 20, imageUrl: 'https://caycanhxanh.vn/wp-content/uploads/2023/06/cay-bang-singapore-gia.jpg', createdAt: new Date().toISOString() },
    { id: 'P006', name: 'Cây Giả Decor', category: 'Cây Giả', price: 320000, stock: 25, imageUrl: 'https://tamnguyenshop.com/Upload/HOA_GIA/chau-cay-gia-14-nhanh-chau-thung-cao-35cm-2.jpg', createdAt: new Date().toISOString() },
    { id: 'P007', name: 'Tượng Gốm Decor Tối Giản', category: 'Decor bàn', price: 320000, stock: 25, imageUrl: 'https://tamnguyenshop.com/Upload/Home-decor/tuong-vit-gom-trang-tri%20(3).JPG', createdAt: new Date().toISOString() },
    { id: 'P008', name: 'Cờ Để Bàn Decor', category: 'Decor bàn', price: 980000, stock: 10, imageUrl: 'https://product.hstatic.net/1000163445/product/cot-co-ha-noi__9_-photoroom_aa663d649c0b441190dfbcd4ea02fe9d_small.jpg', createdAt: new Date().toISOString() },
    { id: 'P009', name: 'Quả Cầu Tuyết Decor', category: 'Decor bàn', price: 550000, stock: 18, imageUrl: 'https://fullhousehomedecor.vn/wp-content/uploads/2022/11/z3866337465759_725dbf5c5a25d769b7634505d50beb91.jpg', createdAt: new Date().toISOString() },
];

// --- State Management ---
let state = {
    activeTab: 'dashboard',
    user: JSON.parse(localStorage.getItem('decor_user')) || null,
    registeredUsers: JSON.parse(localStorage.getItem('decor_registered_users')) || [
        { id: 'admin-1', name: 'Quản trị viên', email: 'admin@longandecor.com', role: 'admin', password: 'admin', phone: '0901234567', address: 'Long An' }
    ],
    products: JSON.parse(localStorage.getItem('decor_products')) || INITIAL_PRODUCTS,
    orders: JSON.parse(localStorage.getItem('decor_orders')) || [],
    cart: JSON.parse(localStorage.getItem('decor_cart')) || [],
    isRegistering: false,
    registerRole: 'user',
    loginError: '',
    globalSearchTerm: '',
    regData: { name: '', email: '', phone: '', address: '', password: '', confirmPassword: '' },
    loginData: { email: '', password: '' }
};

// --- Persistence ---
function saveState() {
    localStorage.setItem('decor_user', JSON.stringify(state.user));
    localStorage.setItem('decor_registered_users', JSON.stringify(state.registeredUsers));
    localStorage.setItem('decor_products', JSON.stringify(state.products));
    localStorage.setItem('decor_orders', JSON.stringify(state.orders));
    localStorage.setItem('decor_cart', JSON.stringify(state.cart));
}

// --- Utilities ---
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// --- Rendering Logic ---
function render() {
    renderSidebar();
    renderContent();
    lucide.createIcons();
}

function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('mobile-menu-btn');
    
    if (!state.user) {
        sidebar.innerHTML = '';
        sidebar.classList.add('translate-x-full');
        if (menuBtn) menuBtn.classList.add('hidden');
        return;
    }
    
    if (menuBtn) menuBtn.classList.remove('hidden');
    // Note: We don't remove translate-x-full here because it's a drawer now
    // It should only be visible when toggled

    const isAdmin = state.user.role === 'admin';
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { id: 'products', label: isAdmin ? 'Quản lý kho' : 'Cửa hàng', icon: 'package' },
        { id: 'orders', label: 'Đơn hàng', icon: 'shopping-bag' },
    ];

    if (!isAdmin) {
        navItems.push({ id: 'cart', label: 'Giỏ hàng', icon: 'shopping-cart', badge: state.cart.length });
    }

    sidebar.innerHTML = `
        <div class="p-5 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 bg-[#0EA5E9] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#0EA5E9]/20">
                    <i data-lucide="leaf" class="w-4.5 h-4.5"></i>
                </div>
                <span class="font-serif font-bold text-base text-[#0EA5E9] tracking-tight">Long An Decor</span>
            </div>
            <button onclick="toggleSidebar()" class="p-1.5 text-[#64748B] hover:bg-white rounded-lg transition-colors">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <nav class="flex-1 px-2.5 space-y-0.5 overflow-y-auto">
            ${navItems.map(item => `
                <button onclick="setActiveTab('${item.id}')" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all duration-300 group ${state.activeTab === item.id ? 'bg-[#0EA5E9] text-white shadow-sm' : 'text-[#64748B] hover:bg-white hover:text-[#0C4A6E]'}">
                    <div class="flex items-center gap-2.5">
                        <i data-lucide="${item.icon}" class="w-4 h-4"></i>
                        <span class="text-[11px] font-bold tracking-wide">${item.label}</span>
                    </div>
                    ${item.badge ? `<span class="bg-white text-[#0EA5E9] text-[8px] font-bold px-1.5 py-0.5 rounded-full">${item.badge}</span>` : ''}
                </button>
            `).join('')}
        </nav>

        <div class="p-3 border-t border-[#BAE6FD] shrink-0">
            <div class="bg-white/50 rounded-lg p-2.5 border border-[#BAE6FD]">
                <div class="flex items-center gap-2 mb-1.5">
                    <div class="w-6 h-6 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9]">
                        <i data-lucide="user" class="w-3 h-3"></i>
                    </div>
                    <div class="min-w-0">
                        <p class="text-[8px] font-bold text-[#64748B] uppercase tracking-widest leading-none mb-0.5">${state.user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
                        <p class="text-[11px] font-bold text-[#0C4A6E] truncate">${state.user.name}</p>
                    </div>
                </div>
                <div class="space-y-1 pt-1.5 border-t border-[#BAE6FD]/30">
                    <p class="text-[8px] text-[#64748B] truncate flex items-center gap-1.5">
                        <span class="w-1 h-1 rounded-full bg-[#0EA5E9] shrink-0"></span>
                        ${state.user.email}
                    </p>
                    ${state.user.role === 'user' ? `
                        <p class="text-[8px] text-[#64748B] truncate flex items-center gap-1.5">
                            <span class="w-1 h-1 rounded-full bg-[#0EA5E9] shrink-0"></span>
                            ${state.user.phone || 'Chưa có SĐT'}
                        </p>
                        <p class="text-[8px] text-[#64748B] line-clamp-1 flex items-start gap-1.5">
                            <span class="w-1 h-1 rounded-full bg-[#0EA5E9] mt-1 shrink-0"></span>
                            ${state.user.address || 'Chưa có địa chỉ'}
                        </p>
                    ` : ''}
                </div>
            </div>
            <button onclick="logout()" class="w-full flex items-center justify-center gap-2 py-2.5 mt-2 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100">
                <i data-lucide="log-out" class="w-4 h-4"></i>
                Đăng xuất
            </button>
        </div>
    `;
}

function renderContent() {
    const content = document.getElementById('content');
    if (!state.user) {
        renderAuth();
        return;
    }

    switch (state.activeTab) {
        case 'dashboard': renderDashboard(); break;
        case 'products': renderProducts(); break;
        case 'orders': renderOrders(); break;
        case 'cart': renderCart(); break;
    }
}

// --- Auth Rendering ---
function renderAuth() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-[80vh] py-10 space-y-8 fade-in">
            <div class="text-center space-y-4">
                <h1 class="text-3xl lg:text-5xl font-bold text-[#0C4A6E] font-serif">Long An Decor</h1>
                <p class="text-[#64748B] max-w-md mx-auto text-sm lg:text-base">
                    ${state.isRegistering ? `Tham gia với tư cách ${state.registerRole === 'admin' ? 'Quản trị viên' : 'Khách hàng'}.` : 'Chào mừng bạn quay trở lại.'}
                </p>
            </div>

            ${state.isRegistering ? `
                <form onsubmit="handleRegister(event)" class="w-full max-w-md bg-white p-6 rounded-[24px] border border-[#BAE6FD] shadow-xl space-y-3">
                    <div class="flex gap-1.5 p-1 bg-[#F0F9FF] rounded-lg border border-[#BAE6FD] mb-3">
                        <button type="button" onclick="setRegisterRole('user')" class="flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${state.registerRole === 'user' ? 'bg-[#0EA5E9] text-white shadow-sm' : 'text-[#64748B]'}">Người dùng</button>
                        <button type="button" onclick="setRegisterRole('admin')" class="flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all ${state.registerRole === 'admin' ? 'bg-[#0EA5E9] text-white shadow-sm' : 'text-[#64748B]'}">Admin</button>
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-[9px] font-bold text-[#64748B] uppercase tracking-widest ml-1">Họ và tên</label>
                        <input required type="text" id="reg-name" oninput="updateRegData('name', this.value)" placeholder="Nguyễn Văn A" class="w-full px-3.5 py-2.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-xs" value="${state.regData.name}">
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-bold text-[#64748B] uppercase tracking-widest ml-1">Email</label>
                            <input required type="email" id="reg-email" oninput="updateRegData('email', this.value)" placeholder="email@example.com" class="w-full px-3.5 py-2.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-xs" value="${state.regData.email}">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-bold text-[#64748B] uppercase tracking-widest ml-1">Số điện thoại</label>
                            <input required type="tel" id="reg-phone" oninput="updateRegData('phone', this.value)" placeholder="090..." class="w-full px-3.5 py-2.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-xs" value="${state.regData.phone}">
                        </div>
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-[9px] font-bold text-[#64748B] uppercase tracking-widest ml-1">Địa chỉ</label>
                        <input required type="text" id="reg-address" oninput="updateRegData('address', this.value)" placeholder="Số nhà, tên đường..." class="w-full px-3.5 py-2.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-xs" value="${state.regData.address}">
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-bold text-[#64748B] uppercase tracking-widest ml-1">Mật khẩu</label>
                            <input required type="password" id="reg-password" oninput="updateRegData('password', this.value)" placeholder="••••••••" class="w-full px-3.5 py-2.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-xs" value="${state.regData.password}">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-bold text-[#64748B] uppercase tracking-widest ml-1">Xác nhận</label>
                            <input required type="password" id="reg-confirm" oninput="updateRegData('confirmPassword', this.value)" placeholder="••••••••" class="w-full px-3.5 py-2.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-xs" value="${state.regData.confirmPassword}">
                        </div>
                    </div>
                    <button type="submit" class="w-full py-3.5 bg-[#0EA5E9] text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-[#0EA5E9]/20 mt-3 text-xs uppercase tracking-widest">Đăng ký ngay</button>
                    <button type="button" onclick="setIsRegistering(false)" class="w-full py-1 text-[10px] font-bold text-[#64748B] hover:text-[#0EA5E9] transition-all">Đã có tài khoản? Đăng nhập</button>
                </form>
            ` : `
                <form onsubmit="handleLogin(event)" class="w-full max-w-md bg-white p-6 rounded-[24px] border border-[#BAE6FD] shadow-xl space-y-3">
                    <div class="space-y-1.5">
                        <label class="text-[9px] font-bold text-[#64748B] uppercase tracking-widest ml-1">Email</label>
                        <input required type="email" id="login-email" oninput="updateLoginData('email', this.value)" placeholder="email@example.com" class="w-full px-3.5 py-2.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-xs" value="${state.loginData.email}">
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-[9px] font-bold text-[#64748B] uppercase tracking-widest ml-1">Mật khẩu</label>
                        <input required type="password" id="login-password" oninput="updateLoginData('password', this.value)" placeholder="••••••••" class="w-full px-3.5 py-2.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-xs" value="${state.loginData.password}">
                    </div>
                    ${state.loginError ? `<p class="text-red-500 text-[10px] font-bold text-center animate-bounce">${state.loginError}</p>` : ''}
                    <button type="submit" class="w-full py-3.5 bg-[#0EA5E9] text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-[#0EA5E9]/20 mt-3 text-xs uppercase tracking-widest">Đăng nhập</button>
                    <div class="h-px bg-[#BAE6FD] w-full my-1"></div>
                    <button type="button" onclick="setIsRegistering(true)" class="w-full py-3.5 bg-[#E0F2FE] text-[#64748B] rounded-xl font-bold hover:bg-[#BAE6FD] transition-all border border-[#BAE6FD] text-[10px] uppercase tracking-widest">Đăng ký tài khoản mới</button>
                </form>
            `}
        </div>
    `;
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar || !overlay) return;
    
    const isHidden = sidebar.classList.contains('translate-x-full');
    
    if (isHidden) {
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('hidden');
    }
}
window.toggleSidebar = toggleSidebar;

// Close sidebar when clicking overlay
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', toggleSidebar);
    }
});

// --- Dashboard Rendering ---
function renderDashboard() {
    const content = document.getElementById('content');
    const totalProducts = state.products.length;
    const totalOrders = state.orders.length;
    const totalRevenue = state.orders
        .filter(o => o.status === 'Đã thanh toán')
        .reduce((sum, o) => sum + o.totalAmount, 0);

    const stats = [
        { label: 'Tổng sản phẩm', value: totalProducts, icon: 'package', trend: '+4 sản phẩm mới' },
        { label: 'Đơn hàng', value: totalOrders, icon: 'shopping-bag', trend: '12 đơn chờ xử lý' },
        { label: 'Doanh thu', value: formatCurrency(totalRevenue), icon: 'dollar-sign', trend: '+12% tháng này' },
    ];

    content.innerHTML = `
        <div class="space-y-6 lg:space-y-10 fade-in">
            <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 class="text-3xl lg:text-4xl font-bold text-[#0C4A6E] font-serif">Dashboard</h2>
                    <p class="text-[#64748B] mt-1 text-sm">Chào mừng trở lại, hôm nay có ${totalOrders} đơn hàng mới.</p>
                </div>
                <form onsubmit="handleGlobalSearch(event)" class="flex gap-4 w-full sm:w-auto">
                    <div class="relative flex-1 sm:flex-none">
                        <input type="text" id="dashboard-search" placeholder="Tìm kiếm sản phẩm..." class="w-full sm:w-64 bg-white border border-[#BAE6FD] px-4 py-2 rounded-xl text-sm text-[#0C4A6E]">
                    </div>
                    <button type="submit" class="w-10 h-10 bg-[#0EA5E9] text-white rounded-xl shadow-sm flex items-center justify-center hover:opacity-90 transition-all">
                        <i data-lucide="search" class="w-5 h-5"></i>
                    </button>
                </form>
            </header>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                ${stats.map(stat => `
                    <div class="bg-white p-6 rounded-[24px] border border-[#BAE6FD] shadow-sm">
                        <div class="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em] mb-3">${stat.label}</div>
                        <div class="text-2xl lg:text-3xl font-bold text-[#0C4A6E] font-serif">${stat.value}</div>
                        <div class="text-[10px] text-[#0EA5E9] mt-2 font-medium">${stat.trend}</div>
                    </div>
                `).join('')}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div class="lg:col-span-2 bg-white p-6 lg:p-8 rounded-[24px] border border-[#BAE6FD] shadow-sm overflow-hidden">
                    <div class="flex justify-between items-center mb-6 lg:mb-8">
                        <h3 class="text-lg lg:text-xl font-bold text-[#0C4A6E] font-serif">Xu hướng danh mục</h3>
                        <span class="px-3 py-1 bg-[#E0F2FE] text-[#64748B] text-[8px] lg:text-[10px] font-bold rounded-full uppercase tracking-wider">Thống kê kho</span>
                    </div>
                    <div class="h-[250px] lg:h-[300px] w-full">
                        <canvas id="categoryChart"></canvas>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-[24px] border border-[#BAE6FD] shadow-sm">
                    <div class="flex justify-between items-center mb-8">
                        <h3 class="text-xl font-bold text-[#0C4A6E] font-serif">Sản phẩm mới</h3>
                        <button onclick="setActiveTab('products')" class="text-[10px] text-[#0EA5E9] font-bold uppercase tracking-wider hover:underline">Xem tất cả</button>
                    </div>
                    <div class="space-y-4">
                        ${state.products.slice(0, 4).map(product => `
                            <div class="flex items-center gap-4 p-3 rounded-2xl border border-[#BAE6FD] hover:bg-[#F0F9FF] transition-colors">
                                <div class="w-12 h-12 bg-[#E0F2FE] rounded-xl flex items-center justify-center text-xl">
                                    ${product.category === 'Đèn' ? '💡' : product.category === 'Tranh' ? '🖼️' : product.category === 'Cây giả' ? '🌿' : '🏺'}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-bold text-[#0C4A6E] text-sm truncate">${product.name}</p>
                                    <p class="text-[10px] text-[#64748B] uppercase tracking-wider">${product.category}</p>
                                </div>
                                <p class="font-bold text-[#0C4A6E] font-serif text-sm">${formatCurrency(product.price).replace('₫', 'k')}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(initChart, 100);
}

function initChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    const categoryCounts = state.products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categoryCounts),
            datasets: [{
                label: 'Số lượng sản phẩm',
                data: Object.values(categoryCounts),
                backgroundColor: '#059669',
                borderRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: '#E5E1D8' }, ticks: { font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { font: { size: 10 } } }
            }
        }
    });
}

// --- Products Rendering ---
let productFilters = { searchTerm: '', category: 'All', viewMode: 'table' };

function renderProducts() {
    const content = document.getElementById('content');
    const isAdmin = state.user.role === 'admin';
    
    if (state.globalSearchTerm) {
        productFilters.searchTerm = state.globalSearchTerm;
        state.globalSearchTerm = '';
    }

    const filtered = state.products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(productFilters.searchTerm.toLowerCase()) || p.id.toLowerCase().includes(productFilters.searchTerm.toLowerCase());
        const matchesCategory = productFilters.category === 'All' || p.category === productFilters.category;
        return matchesSearch && matchesCategory;
    });

    content.innerHTML = `
        <div class="space-y-8 fade-in">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-xl lg:text-3xl font-bold text-[#0C4A6E] font-serif">${isAdmin ? 'Quản lý sản phẩm' : 'Cửa hàng Decor'}</h2>
                    <p class="text-[#64748B] text-[10px] lg:text-sm">${isAdmin ? 'Thêm, sửa, xóa và theo dõi kho hàng của bạn.' : 'Khám phá bộ sưu tập decor độc đáo của chúng tôi.'}</p>
                </div>
                ${isAdmin ? `<button onclick="openProductModal()" class="bg-[#0EA5E9] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-sm w-full sm:w-auto"><i data-lucide="plus" class="w-5 h-5"></i>Thêm sản phẩm</button>` : ''}
            </div>

            <div class="bg-white p-4 rounded-[24px] shadow-sm border border-[#BAE6FD] flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                <div class="relative flex-1">
                    <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] w-4.5 h-4.5"></i>
                    <input type="text" id="product-search" placeholder="Tìm kiếm..." class="w-full pl-12 pr-12 py-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-sm" value="${productFilters.searchTerm}" oninput="updateProductSearch(this.value)">
                    ${productFilters.searchTerm ? `<button onclick="clearProductSearch()" class="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0EA5E9]"><i data-lucide="x" class="w-4 h-4"></i></button>` : ''}
                </div>
                
                <div class="flex items-center gap-1 bg-[#F0F9FF] p-1 rounded-xl border border-[#BAE6FD] overflow-x-auto no-scrollbar">
                    <button onclick="setProductCategory('All')" class="px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${productFilters.category === 'All' ? 'bg-white text-[#0EA5E9] shadow-sm' : 'text-[#64748B]'}">Tất cả</button>
                    ${CATEGORIES.map(cat => `<button onclick="setProductCategory('${cat}')" class="px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${productFilters.category === cat ? 'bg-white text-[#0EA5E9] shadow-sm' : 'text-[#64748B]'}">${cat}</button>`).join('')}
                </div>

                <div class="flex items-center gap-2 bg-[#F0F9FF] p-1 rounded-xl border border-[#BAE6FD] self-end lg:self-auto">
                    <button onclick="setProductView('table')" class="p-2 rounded-lg transition-all ${productFilters.viewMode === 'table' ? 'bg-white text-[#0EA5E9] shadow-sm' : 'text-[#64748B]'}"><i data-lucide="list" class="w-4.5 h-4.5"></i></button>
                    <button onclick="setProductView('grid')" class="p-2 rounded-lg transition-all ${productFilters.viewMode === 'grid' ? 'bg-white text-[#0EA5E9] shadow-sm' : 'text-[#64748B]'}"><i data-lucide="grid" class="w-4.5 h-4.5"></i></button>
                </div>
            </div>

            ${productFilters.viewMode === 'table' ? `
                <div class="bg-white rounded-[24px] shadow-sm border border-[#BAE6FD] overflow-x-auto">
                    <table class="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr class="bg-[#E0F2FE]/50 border-b border-[#BAE6FD]">
                                <th class="px-6 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.15em]">Sản phẩm</th>
                                <th class="px-6 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.15em]">Danh mục</th>
                                <th class="px-6 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.15em]">Giá</th>
                                <th class="px-6 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.15em]">Tồn kho</th>
                                <th class="px-6 py-4 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.15em] text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#BAE6FD]/50">
                            ${filtered.map(p => `
                                <tr class="hover:bg-[#F0F9FF]/50 transition-colors group">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-4">
                                            <img src="${p.imageUrl}" alt="${p.name}" class="w-12 h-12 rounded-xl object-cover border border-[#BAE6FD]" referrerPolicy="no-referrer">
                                            <div>
                                                <p class="font-bold text-[#0C4A6E] text-sm">${p.name}</p>
                                                <p class="text-[10px] text-[#64748B] uppercase tracking-wider">${p.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4"><span class="px-3 py-1 bg-[#E0F2FE] text-[#64748B] text-[10px] font-bold rounded-full uppercase tracking-wider">${p.category}</span></td>
                                    <td class="px-6 py-4 font-bold text-[#0C4A6E] font-serif">${formatCurrency(p.price)}</td>
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-2">
                                            <div class="w-1.5 h-1.5 rounded-full ${p.stock > 10 ? 'bg-[#0EA5E9]' : p.stock > 0 ? 'bg-orange-300' : 'bg-red-300'}"></div>
                                            <span class="font-medium text-[#0C4A6E] text-sm">${p.stock}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            ${isAdmin ? `
                                                <button onclick="openProductModal('${p.id}')" class="p-2 text-[#64748B] hover:text-[#0EA5E9] hover:bg-white rounded-lg transition-all border border-transparent hover:border-[#BAE6FD] shadow-sm"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                                                <button onclick="deleteProduct('${p.id}')" class="p-2 text-[#64748B] hover:text-red-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-[#BAE6FD] shadow-sm"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                            ` : `
                                                <button onclick="addToCart('${p.id}')" class="px-4 py-2 bg-[#0EA5E9] text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all">Thêm vào giỏ</button>
                                            `}
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${filtered.length === 0 ? `<div class="py-20 text-center"><p class="text-[#64748B] italic font-serif">Không có sản phẩm nào phù hợp.</p></div>` : ''}
                </div>
            ` : `
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    ${filtered.map(p => `
                        <div class="bg-white rounded-[24px] border border-[#BAE6FD] overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div class="relative h-48 overflow-hidden bg-[#E0F2FE]">
                                <img src="${p.imageUrl}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer">
                                ${isAdmin ? `
                                    <div class="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onclick="openProductModal('${p.id}')" class="p-2 bg-white text-[#0EA5E9] rounded-lg shadow-sm hover:bg-[#0EA5E9] hover:text-white border border-[#BAE6FD]"><i data-lucide="edit-2" class="w-3.5 h-3.5"></i></button>
                                        <button onclick="deleteProduct('${p.id}')" class="p-2 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-500 hover:text-white border border-[#BAE6FD]"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                                    </div>
                                ` : ''}
                                <div class="absolute bottom-4 left-4">
                                    <span class="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#64748B] text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm border border-[#BAE6FD]/50">${p.category}</span>
                                </div>
                            </div>
                            <div class="p-4 lg:p-6">
                                <h4 class="font-bold text-[#0C4A6E] text-sm lg:text-base mb-1 lg:mb-2 truncate font-serif">${p.name}</h4>
                                <div class="flex justify-between items-end">
                                    <div>
                                        <p class="text-[8px] lg:text-[10px] text-[#64748B] uppercase tracking-wider mb-0.5 lg:mb-1">${p.id}</p>
                                        <p class="text-base lg:text-lg font-bold text-[#0EA5E9] font-serif">${formatCurrency(p.price)}</p>
                                    </div>
                                    ${!isAdmin ? `<button onclick="addToCart('${p.id}')" class="p-2 bg-[#0EA5E9] text-white rounded-xl shadow-sm hover:opacity-90 transition-all"><i data-lucide="plus" class="w-4.5 h-4.5"></i></button>` : `
                                        <div class="text-right">
                                            <p class="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">Tồn kho</p>
                                            <p class="font-bold text-[#0C4A6E]">${p.stock}</p>
                                        </div>
                                    `}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
    lucide.createIcons();
}

// --- Orders Rendering ---
function renderOrders() {
    const content = document.getElementById('content');
    const isAdmin = state.user.role === 'admin';
    const filteredOrders = isAdmin ? state.orders : state.orders.filter(o => o.userId === state.user.id);

    content.innerHTML = `
        <div class="space-y-8 fade-in">
            <div>
                <h2 class="text-3xl font-bold text-[#0C4A6E] font-serif">Đơn hàng</h2>
                <p class="text-[#64748B] text-sm">Theo dõi trạng thái và lịch sử mua sắm.</p>
            </div>

            <div class="bg-white rounded-[32px] border border-[#BAE6FD] shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr class="bg-[#E0F2FE]/50 border-b border-[#BAE6FD]">
                                <th class="px-8 py-5 text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Mã đơn</th>
                                <th class="px-8 py-5 text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Ngày đặt</th>
                                <th class="px-8 py-5 text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Sản phẩm</th>
                                <th class="px-8 py-5 text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Tổng tiền</th>
                                <th class="px-8 py-5 text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Trạng thái</th>
                                <th class="px-8 py-5 text-[10px] font-bold text-[#64748B] uppercase tracking-widest text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#BAE6FD]/50">
                            ${filteredOrders.map(order => `
                                <tr class="hover:bg-[#F0F9FF]/50 transition-colors">
                                    <td class="px-8 py-6 font-bold text-[#0C4A6E] text-sm">${order.id}</td>
                                    <td class="px-8 py-6 text-sm text-[#64748B]">${new Date(order.date).toLocaleDateString('vi-VN')}</td>
                                    <td class="px-8 py-6">
                                        <div class="flex -space-x-3">
                                            ${order.items.slice(0, 3).map(item => `<img src="${item.imageUrl}" class="w-10 h-10 rounded-full border-2 border-white object-cover" referrerPolicy="no-referrer">`).join('')}
                                            ${order.items.length > 3 ? `<div class="w-10 h-10 rounded-full border-2 border-white bg-[#E0F2FE] flex items-center justify-center text-[10px] font-bold text-[#64748B]">+${order.items.length - 3}</div>` : ''}
                                        </div>
                                    </td>
                                    <td class="px-8 py-6 font-bold text-[#0C4A6E] font-serif">${formatCurrency(order.totalAmount)}</td>
                                    <td class="px-8 py-6">
                                        <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'Đã thanh toán' ? 'bg-emerald-50 text-emerald-600' : order.status === 'Đã hủy' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}">
                                            ${order.status}
                                        </span>
                                    </td>
                                    <td class="px-8 py-6 text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            ${isAdmin && order.status === 'Chưa thanh toán' ? `<button onclick="updateOrderStatus('${order.id}', 'Đã thanh toán')" class="p-2 text-[#0EA5E9] hover:bg-emerald-50 rounded-lg transition-all"><i data-lucide="check-circle" class="w-5 h-5"></i></button>` : ''}
                                            <button onclick="deleteOrder('${order.id}')" class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${filteredOrders.length === 0 ? `<div class="py-24 text-center"><div class="w-20 h-20 bg-[#E0F2FE] rounded-full flex items-center justify-center mx-auto mb-4 text-[#64748B]"><i data-lucide="shopping-bag" class="w-10 h-10"></i></div><p class="text-[#64748B] italic font-serif">Chưa có đơn hàng nào.</p></div>` : ''}
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// --- Cart Rendering ---
function renderCart() {
    const content = document.getElementById('content');
    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    content.innerHTML = `
        <div class="space-y-8 fade-in">
            <div>
                <h2 class="text-3xl font-bold text-[#0C4A6E] font-serif">Giỏ hàng</h2>
                <p class="text-[#64748B] text-sm">Kiểm tra lại các sản phẩm trước khi thanh toán.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-4">
                    ${state.cart.map(item => `
                        <div class="bg-white p-6 rounded-[32px] border border-[#BAE6FD] shadow-sm flex items-center gap-6 group">
                            <img src="${item.imageUrl}" class="w-24 h-24 rounded-2xl object-cover border border-[#BAE6FD]" referrerPolicy="no-referrer">
                            <div class="flex-1 min-w-0">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h4 class="font-bold text-[#0C4A6E] text-lg font-serif">${item.name}</h4>
                                        <p class="text-xs text-[#64748B] uppercase tracking-widest mt-1">${item.category}</p>
                                    </div>
                                    <button onclick="removeFromCart('${item.id}')" class="p-2 text-[#64748B] hover:text-red-500 transition-colors"><i data-lucide="x" class="w-5 h-5"></i></button>
                                </div>
                                <div class="flex justify-between items-end mt-4">
                                    <div class="flex items-center gap-3 bg-[#F0F9FF] p-1 rounded-xl border border-[#BAE6FD]">
                                        <button onclick="updateCartQuantity('${item.id}', -1)" class="w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#0EA5E9] transition-colors"><i data-lucide="minus" class="w-4 h-4"></i></button>
                                        <span class="w-8 text-center font-bold text-sm text-[#0C4A6E]">${item.quantity}</span>
                                        <button onclick="updateCartQuantity('${item.id}', 1)" class="w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#0EA5E9] transition-colors"><i data-lucide="plus" class="w-4 h-4"></i></button>
                                    </div>
                                    <p class="font-bold text-[#0EA5E9] text-xl font-serif">${formatCurrency(item.price * item.quantity)}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    ${state.cart.length === 0 ? `<div class="py-24 text-center bg-white rounded-[32px] border border-[#BAE6FD] border-dashed"><p class="text-[#64748B] italic font-serif">Giỏ hàng đang trống.</p><button onclick="setActiveTab('products')" class="mt-4 text-[#0EA5E9] font-bold hover:underline">Quay lại cửa hàng</button></div>` : ''}
                </div>

                <div class="space-y-6">
                    <div class="bg-white p-8 rounded-[32px] border border-[#BAE6FD] shadow-sm space-y-6">
                        <h3 class="text-xl font-bold text-[#0C4A6E] font-serif">Tổng đơn hàng</h3>
                        <div class="space-y-3 border-b border-[#BAE6FD] pb-6">
                            <div class="flex justify-between text-sm text-[#64748B]"><span>Tạm tính</span><span>${formatCurrency(total)}</span></div>
                            <div class="flex justify-between text-sm text-[#64748B]"><span>Phí vận chuyển</span><span class="text-[#0EA5E9] font-bold">Miễn phí</span></div>
                        </div>
                        <div class="flex justify-between items-center pt-2">
                            <span class="font-bold text-[#0C4A6E]">Tổng cộng</span>
                            <span class="text-2xl font-bold text-[#0EA5E9] font-serif">${formatCurrency(total)}</span>
                        </div>
                        <button onclick="checkout()" class="w-full py-4 bg-[#0EA5E9] text-white rounded-2xl font-bold shadow-lg shadow-[#0EA5E9]/20 hover:opacity-90 transition-all uppercase tracking-widest text-xs" ${state.cart.length === 0 ? 'disabled' : ''}>Thanh toán ngay</button>
                    </div>
                    <div class="bg-[#E0F2FE] p-6 rounded-[24px] border border-[#BAE6FD] flex items-start gap-4">
                        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0EA5E9] shrink-0"><i data-lucide="shield-check" class="w-6 h-6"></i></div>
                        <div><p class="text-xs font-bold text-[#0C4A6E] mb-1">Thanh toán an toàn</p><p class="text-[10px] text-[#64748B] leading-relaxed">Chúng tôi cam kết bảo mật thông tin và giao hàng tận nơi trong 2-3 ngày.</p></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// --- Action Handlers ---
window.updateRegData = (field, value) => {
    state.regData[field] = value;
};

window.updateLoginData = (field, value) => {
    state.loginData[field] = value;
};

window.setActiveTab = (tab) => {
    state.activeTab = tab;
    const sidebar = document.getElementById('sidebar');
    if (sidebar && !sidebar.classList.contains('translate-x-full')) {
        toggleSidebar();
    }
    render();
};

window.setRegisterRole = (role) => {
    state.registerRole = role;
    render();
};

window.setIsRegistering = (val) => {
    state.isRegistering = val;
    render();
};

window.handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = state.loginData;
    
    const found = state.registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
        state.user = found;
        state.loginError = '';
        state.activeTab = 'dashboard';
        state.loginData = { email: '', password: '' }; // Reset
        saveState();
        render();
    } else {
        state.loginError = 'Sai tài khoản hoặc mật khẩu';
        render();
    }
};

window.handleRegister = (e) => {
    e.preventDefault();
    const { name, email, phone, address, password, confirmPassword } = state.regData;

    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }
    if (state.registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert('Email này đã được đăng ký!');
        return;
    }

    const newUser = {
        id: (state.registerRole === 'admin' ? 'A' : 'U') + Math.random().toString(36).substr(2, 9).toUpperCase(),
        name, email, phone, address, password,
        role: state.registerRole
    };

    state.registeredUsers.push(newUser);
    state.user = newUser;
    state.isRegistering = false;
    state.regData = { name: '', email: '', phone: '', address: '', password: '', confirmPassword: '' }; // Reset
    saveState();
    alert(`Đăng ký tài khoản ${state.registerRole === 'admin' ? 'Admin' : 'Người dùng'} thành công!`);
    render();
};

window.logout = () => {
    state.user = null;
    state.cart = [];
    state.activeTab = 'dashboard';
    const sidebar = document.getElementById('sidebar');
    if (sidebar && !sidebar.classList.contains('translate-x-full')) {
        toggleSidebar();
    }
    saveState();
    render();
};

window.handleGlobalSearch = (e) => {
    e.preventDefault();
    const term = document.getElementById('dashboard-search').value;
    state.globalSearchTerm = term;
    state.activeTab = 'products';
    const sidebar = document.getElementById('sidebar');
    if (sidebar && !sidebar.classList.contains('translate-x-full')) {
        toggleSidebar();
    }
    render();
};

window.updateProductSearch = (term) => {
    productFilters.searchTerm = term;
    renderProducts();
};

window.clearProductSearch = () => {
    productFilters.searchTerm = '';
    renderProducts();
};

window.setProductCategory = (cat) => {
    productFilters.category = cat;
    renderProducts();
};

window.setProductView = (view) => {
    productFilters.viewMode = view;
    renderProducts();
};

window.addToCart = (id) => {
    const product = state.products.find(p => p.id === id);
    const existing = state.cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }
    state.activeTab = 'cart';
    saveState();
    render();
};

window.updateCartQuantity = (id, delta) => {
    const item = state.cart.find(i => i.id === id);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        saveState();
        renderCart();
        renderSidebar(); // Update badge
    }
};

window.removeFromCart = (id) => {
    state.cart = state.cart.filter(i => i.id !== id);
    saveState();
    renderCart();
    renderSidebar();
};

window.checkout = () => {
    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder = {
        id: `ORD${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        items: [...state.cart],
        totalAmount: total,
        status: 'Chưa thanh toán',
        userId: state.user.id
    };
    state.orders.unshift(newOrder);
    state.cart = [];
    state.activeTab = 'orders';
    saveState();
    render();
};

window.updateOrderStatus = (id, status) => {
    const order = state.orders.find(o => o.id === id);
    if (order) {
        order.status = status;
        saveState();
        renderOrders();
    }
};

window.deleteOrder = (id) => {
    state.orders = state.orders.filter(o => o.id !== id);
    saveState();
    renderOrders();
};

window.deleteProduct = (id) => {
    state.products = state.products.filter(p => p.id !== id);
    saveState();
    renderProducts();
};

// --- Product Modal ---
let editingProductId = null;

window.openProductModal = (id = null) => {
    editingProductId = id;
    const product = id ? state.products.find(p => p.id === id) : { name: '', category: 'Đèn', price: 0, stock: 0, imageUrl: '' };
    
    const modal = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="p-8 border-b border-[#BAE6FD] flex justify-between items-center bg-[#E0F2FE]/30">
            <h3 class="text-2xl font-bold text-[#0C4A6E] font-serif">${id ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
            <button onclick="closeModal()" class="p-2 hover:bg-[#E0F2FE] rounded-full transition-colors"><i data-lucide="x" class="w-6 h-6 text-[#64748B]"></i></button>
        </div>
        <form onsubmit="handleProductSubmit(event)" class="p-8 space-y-5">
            <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-[#64748B] uppercase tracking-widest ml-1">Tên sản phẩm</label>
                <input required type="text" id="prod-name" class="w-full px-4 py-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-sm" value="${product.name}">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-[#64748B] uppercase tracking-widest ml-1">Danh mục</label>
                    <select id="prod-cat" class="w-full px-4 py-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-sm appearance-none">
                        ${CATEGORIES.map(cat => `<option value="${cat}" ${product.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
                    </select>
                </div>
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-[#64748B] uppercase tracking-widest ml-1">Giá (VND)</label>
                    <input required type="number" id="prod-price" class="w-full px-4 py-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-sm" value="${product.price}">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-[#64748B] uppercase tracking-widest ml-1">Số lượng</label>
                    <input required type="number" id="prod-stock" class="w-full px-4 py-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-sm" value="${product.stock}">
                </div>
                <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-[#64748B] uppercase tracking-widest ml-1">Ảnh sản phẩm</label>
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-2">
                            <label for="prod-file" class="flex-1 px-4 py-2.5 bg-white border border-[#BAE6FD] rounded-xl text-[10px] font-bold text-[#0EA5E9] cursor-pointer hover:bg-[#F0F9FF] transition-colors text-center uppercase tracking-wider">
                                <i data-lucide="upload" class="w-3 h-3 inline-block mr-1"></i> Tải ảnh lên
                            </label>
                            <input type="file" id="prod-file" class="hidden" accept="image/*" onchange="previewImage(this)">
                        </div>
                        <div class="relative">
                            <input type="text" id="prod-img" placeholder="Hoặc dán URL ảnh tại đây..." class="w-full px-4 py-2.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl text-[10px]" value="${product.imageUrl}" oninput="updatePreviewFromUrl(this.value)">
                        </div>
                    </div>
                </div>
            </div>
            <div id="image-preview-container" class="mt-2 ${product.imageUrl ? '' : 'hidden'}">
                <p class="text-[10px] font-bold text-[#64748B] uppercase tracking-widest ml-1 mb-2">Xem trước ảnh</p>
                <div class="relative w-full h-32 rounded-2xl overflow-hidden border border-[#BAE6FD] bg-[#F0F9FF]">
                    <img id="prod-preview" src="${product.imageUrl || ''}" class="w-full h-full object-contain" referrerPolicy="no-referrer">
                </div>
            </div>
            <div class="pt-4">
                <button type="submit" class="w-full bg-[#0EA5E9] text-white py-4 rounded-xl font-bold shadow-sm hover:opacity-90 transition-all uppercase tracking-widest text-xs">${id ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</button>
            </div>
        </form>
    `;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    lucide.createIcons();
};

window.previewImage = (input) => {
    const preview = document.getElementById('prod-preview');
    const container = document.getElementById('image-preview-container');
    const urlInput = document.getElementById('prod-img');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            container.classList.remove('hidden');
            urlInput.value = ''; // Clear URL if file is chosen
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.updatePreviewFromUrl = (url) => {
    const preview = document.getElementById('prod-preview');
    const container = document.getElementById('image-preview-container');
    const fileInput = document.getElementById('prod-file');
    
    if (url) {
        preview.src = url;
        container.classList.remove('hidden');
        fileInput.value = ''; // Clear file if URL is typed
    } else {
        container.classList.add('hidden');
    }
};

window.closeModal = () => {
    const modal = document.getElementById('modal-container');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

window.handleProductSubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('prod-name').value;
    const category = document.getElementById('prod-cat').value;
    const price = Number(document.getElementById('prod-price').value);
    const stock = Number(document.getElementById('prod-stock').value);
    const urlInput = document.getElementById('prod-img').value;
    const fileInput = document.getElementById('prod-file');
    
    let imageUrl = urlInput;
    
    // If there's a file, convert it to base64
    if (fileInput.files && fileInput.files[0]) {
        imageUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(fileInput.files[0]);
        });
    }

    if (editingProductId) {
        const p = state.products.find(p => p.id === editingProductId);
        Object.assign(p, { name, category, price, stock, imageUrl });
    } else {
        const newProduct = {
            id: `P${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            name, category, price, stock, imageUrl,
            createdAt: new Date().toISOString()
        };
        state.products.unshift(newProduct);
    }
    saveState();
    closeModal();
    renderProducts();
};

// --- Initial Render ---
render();
