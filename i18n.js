// ============================================================
// 街霸6 帧数速查网 - 国际化 (i18n)
// ============================================================

let currentLang = 'zh'; // 'zh' or 'en'

// UI 文字翻译
const i18n = {
    zh: {
        title: '🎮 街霸6 帧数速查网',
        searchPlaceholder: '搜索角色名称...（上下箭头选择，回车确认）',
        escHint: '按 ESC 清除搜索',
        selectChar: '选择角色',
        emptyIcon: '👊',
        emptyText: '请从左侧选择一个角色查看帧数数据',
        emptyHint: '支持键盘导航：↑↓ 选择角色，Enter 确认',
        tabNormals: '普通技',
        tabSpecials: '必杀技',
        tabSupers: 'SA / 超必杀',
        thMoveName: '招式名称',
        thDamage: '伤害',
        thStartup: '启动帧',
        thHitAdv: '命中优势',
        thBlockAdv: '格挡优势',
        adPlaceholder: '广告位招商',
        dataNote: '📊 数据来源：GitHub 社区项目 4rays/sf6-move-data，共收录 25 个角色的真实帧数数据。招式名称已翻译为中文，数据可能随游戏版本更新而变化，请以游戏内实测为准。',
        noMatch: '未找到匹配角色',
        langBtn: 'EN',
        langBtnTitle: 'Switch to English',
        charDetailName: (cn, en) => `${cn}（${en}）`,
        moveDisplayName: (name) => getMoveNameCN(name),
    },
    en: {
        title: '🎮 SF6 Frame Data Quick Reference',
        searchPlaceholder: 'Search character... (↑↓ to select, Enter to confirm)',
        escHint: 'Press ESC to clear search',
        selectChar: 'Select Character',
        emptyIcon: '👊',
        emptyText: 'Select a character from the left to view frame data',
        emptyHint: 'Keyboard navigation: ↑↓ select character, Enter confirm',
        tabNormals: 'Normal Moves',
        tabSpecials: 'Special Moves',
        tabSupers: 'SA / Super Arts',
        thMoveName: 'Move Name',
        thDamage: 'Damage',
        thStartup: 'Startup',
        thHitAdv: 'Hit Advantage',
        thBlockAdv: 'Block Advantage',
        adPlaceholder: 'Ad Space Available',
        dataNote: '📊 Data Source: GitHub community project 4rays/sf6-move-data, covering 25 characters with real frame data. Data may change with game version updates, please verify in-game.',
        noMatch: 'No matching characters found',
        langBtn: '中',
        langBtnTitle: '切换到中文',
        charDetailName: (cn, en) => en,
        moveDisplayName: (name) => name, // English mode: show original English name
    }
};

// 获取当前语言的翻译
function t(key) {
    return i18n[currentLang][key] || key;
}

// 切换语言
function toggleLang() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    // 重新渲染
    renderSidebar(searchInput.value);
    if (activeCharId) {
        const char = characters.find(c => c.id === activeCharId);
        if (char) renderCharDetail(char);
    }
    // 更新页面标题
    document.title = currentLang === 'zh' ? '街霸6 帧数速查网' : 'SF6 Frame Data Quick Reference';
    // 更新 html lang 属性
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    // 更新按钮
    const btn = document.getElementById('langToggle');
    if (btn) {
        btn.textContent = t('langBtn');
        btn.title = t('langBtnTitle');
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { i18n, currentLang, t, toggleLang };
}
