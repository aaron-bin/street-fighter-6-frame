// ============================================================
// 街霸6 帧数速查网 - 主逻辑
// ============================================================

// 常量定义
const TAB_MAP = {
    '普通技': 'normals',
    '必杀技': 'specials',
    'SA / 必杀技': 'supers'
};

// DOM 元素
const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');
const searchInput = document.getElementById('searchInput');

// 状态
let activeCharId = null;
let activeTab = '普通技';

// ============================================================
// 渲染函数
// ============================================================

// 获取 Tab 标签文字
function getTabLabel(tabKey) {
    const labels = {
        zh: { '普通技': '普通技', '必杀技': '必杀技', 'SA / 必杀技': 'SA / 超必杀' },
        en: { '普通技': 'Normal Moves', '必杀技': 'Special Moves', 'SA / 必杀技': 'SA / Super Arts' }
    };
    return labels[currentLang][tabKey] || tabKey;
}

// 渲染侧边栏
function renderSidebar(filter = '') {
    const filtered = characters.filter(c =>
        c.name.includes(filter) || c.nameEn.toLowerCase().includes(filter.toLowerCase())
    );

    let html = `<div class="sidebar-title">${t('selectChar')}</div>`;
    filtered.forEach(char => {
        const isActive = char.id === activeCharId ? 'active' : '';
        const avatarUrl = getCharAvatarDataUrl(char.id);
        const displayName = currentLang === 'en' ? char.nameEn : char.name;
        const subName = currentLang === 'en' ? char.name : char.nameEn;
        html += `
            <div class="char-item ${isActive}" data-id="${char.id}">
                <img src="${avatarUrl}" alt="${displayName}" class="char-avatar-img" loading="lazy">
                <div class="char-info">
                    <div class="char-name">${displayName}</div>
                    <div class="char-name-en">${subName}</div>
                </div>
            </div>
        `;
    });

    if (filtered.length === 0) {
        html += `<div style="padding: 16px; color: #666; text-align: center;">${t('noMatch')}</div>`;
    }

    sidebar.innerHTML = html;
}

// 渲染角色详情
function renderCharDetail(char) {
    const avatarUrl = getCharAvatarDataUrl(char.id);
    const charName = currentLang === 'en' ? char.nameEn : char.name;
    const charNameSub = currentLang === 'en' ? char.name : char.nameEn;
    const description = currentLang === 'en' ? 'Real Frame Data from Street Fighter 6' : char.description;

    let html = `
        <div class="char-header">
            <img src="${avatarUrl}" alt="${charName}" class="char-header-avatar-img">
            <div class="char-header-info">
                <h2>${charName}${currentLang === 'zh' ? '（' + charNameSub + '）' : ''}</h2>
                <p>${description}</p>
            </div>
        </div>
    `;

    // Tab 切换按钮
    html += `
        <div class="tab-container">
            ${Object.keys(TAB_MAP).map(tab => `
                <button class="tab-btn ${activeTab === tab ? 'active' : ''}" data-tab="${tab}">
                    ${getTabLabel(tab)}
                </button>
            `).join('')}
        </div>
    `;

    // 广告位
    html += `<div id="ad-container">${t('adPlaceholder')}</div>`;

    // 渲染每个Tab内容
    for (const [section, moves] of Object.entries(char.moves)) {
        const isActive = section === activeTab ? 'active' : '';
        const tabId = TAB_MAP[section] || 'other';
        html += `<div class="tab-content ${isActive}" id="tab-${tabId}">`;
        html += `
            <table class="frame-table">
                <thead>
                    <tr>
                        <th>${t('thMoveName')}</th>
                        <th>${t('thDamage')}</th>
                        <th>${t('thStartup')}</th>
                        <th>${t('thHitAdv')}</th>
                        <th>${t('thBlockAdv')}</th>
                    </tr>
                </thead>
                <tbody>
        `;
        moves.forEach(move => {
            const hitClass = getAdvClass(move.onHit);
            const blockClass = getAdvClass(move.onBlock);
            const noteHtml = move.note ? `<span class="note-tag">${move.note}</span>` : '';
            const moveDisplayName = t('moveDisplayName')(move.name);
            html += `
                <tr>
                    <td>${moveDisplayName}${noteHtml}</td>
                    <td>${move.damage}</td>
                    <td>${move.startup}</td>
                    <td class="${hitClass}">${move.onHit}</td>
                    <td class="${blockClass}">${move.onBlock}</td>
                </tr>
            `;
        });
        html += '</tbody></table>';
        html += '</div>';
    }

    html += `
        <div class="data-note">
            ${t('dataNote')}
        </div>
    `;

    content.innerHTML = html;
    content.scrollTop = 0; // 滚动到顶部
}

// 更新静态UI元素的语言
function updateStaticUI() {
    document.getElementById('headerTitle').textContent = t('title');
    searchInput.placeholder = t('searchPlaceholder');
    document.getElementById('escHint').textContent = t('escHint');
    document.getElementById('emptyText').textContent = t('emptyText');
    document.getElementById('emptyHint').textContent = t('emptyHint');
}

// ============================================================
// 交互函数
// ============================================================

// Tab 切换
function switchTab(tabName) {
    activeTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.remove('active');
    });
    const tabId = TAB_MAP[tabName] || 'other';
    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// 优势值颜色
function getAdvClass(val) {
    if (val === '倒地' || val === '—') return '';
    const num = parseInt(val);
    if (num > 0) return 'adv-positive';
    if (num < 0) return 'adv-negative';
    return 'adv-zero';
}

// 选择角色
function selectChar(id) {
    activeCharId = id;
    activeTab = '普通技';
    const char = characters.find(c => c.id === id);
    renderSidebar(searchInput.value);
    renderCharDetail(char);
}

// 获取当前可见的角色列表
function getVisibleChars() {
    const filter = searchInput.value;
    return characters.filter(c =>
        c.name.includes(filter) || c.nameEn.toLowerCase().includes(filter.toLowerCase())
    );
}

// ============================================================
// 事件绑定（事件委托）
// ============================================================

// 侧边栏点击事件
sidebar.addEventListener('click', (e) => {
    const charItem = e.target.closest('.char-item');
    if (charItem) {
        selectChar(charItem.dataset.id);
    }
});

// Tab 切换事件
content.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.tab-btn');
    if (tabBtn) {
        switchTab(tabBtn.dataset.tab);
    }
});

// 语言切换事件
document.getElementById('langToggle').addEventListener('click', () => {
    toggleLang();
    updateStaticUI();
});

// 搜索功能
searchInput.addEventListener('input', () => {
    renderSidebar(searchInput.value);
});

// 键盘导航
document.addEventListener('keydown', (e) => {
    // ESC 清除搜索
    if (e.key === 'Escape') {
        searchInput.value = '';
        renderSidebar();
        searchInput.blur();
        return;
    }

    // 搜索框聚焦时不处理方向键
    if (document.activeElement === searchInput) {
        if (e.key === 'Enter') {
            const visibleChars = getVisibleChars();
            if (visibleChars.length > 0) {
                selectChar(visibleChars[0].id);
            }
        }
        return;
    }

    // 上下箭头选择角色
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const visibleChars = getVisibleChars();
        if (visibleChars.length === 0) return;

        const currentIndex = visibleChars.findIndex(c => c.id === activeCharId);
        let newIndex;

        if (e.key === 'ArrowUp') {
            newIndex = currentIndex <= 0 ? visibleChars.length - 1 : currentIndex - 1;
        } else {
            newIndex = currentIndex >= visibleChars.length - 1 ? 0 : currentIndex + 1;
        }

        selectChar(visibleChars[newIndex].id);

        // 滚动到可见位置
        const activeItem = sidebar.querySelector('.char-item.active');
        if (activeItem) {
            activeItem.scrollIntoView({ block: 'nearest' });
        }
    }
});

// ============================================================
// 初始化
// ============================================================

// 渲染群像封面
function renderRosterBanner() {
    const banner = document.getElementById('roster-banner');
    if (!banner) return;

    const avatars = characters.map(char => {
        const url = getCharAvatarDataUrl(char.id);
        const name = currentLang === 'en' ? char.nameEn : char.name;
        return `<img src="${url}" alt="${name}" class="roster-avatar" data-id="${char.id}" title="${name}" loading="lazy">`;
    });

    banner.innerHTML = avatars.join('');

    // 点击头像选择角色
    banner.addEventListener('click', (e) => {
        const avatar = e.target.closest('.roster-avatar');
        if (avatar) {
            selectChar(avatar.dataset.id);
        }
    });
}

// 自动聚焦搜索框
searchInput.focus();

// 渲染封面和侧边栏
renderRosterBanner();
renderSidebar();
