// 角色头像 - 使用PNG图片
const charAvatars = {
    'aki': 'img/aki.png',
    'akuma': 'img/akuma.png',
    'blanka': 'img/blanka.png',
    'cammy': 'img/cammy.png',
    'chunli': 'img/chun-li.png',
    'deejay': 'img/dee-jay.png',
    'dhalsim': 'img/dhalsim.png',
    'ed': 'img/ed.png',
    'ehonda': 'img/e-honda.png',
    'guile': 'img/guile.png',
    'jamie': 'img/jamie.png',
    'jp': 'img/jp.png',
    'juri': 'img/juri.png',
    'ken': 'img/ken.png',
    'kimberly': 'img/kimberly.png',
    'lily': 'img/lily.png',
    'luke': 'img/luke.png',
    'mai': 'img/mai.png',
    'manon': 'img/manon.png',
    'marisa': 'img/marisa.png',
    'mbison': 'img/m-bison.png',
    'rashid': 'img/rashid.png',
    'ryu': 'img/ryu.png',
    'terry': 'img/terry.png',
    'zangief': 'img/zangief.png'
};

// 获取角色头像URL
function getCharAvatarDataUrl(charId) {
    return charAvatars[charId] || '';
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { charAvatars, getCharAvatarDataUrl };
}
