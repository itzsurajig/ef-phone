fx_version 'bodacious'
game 'gta5'

author 'EF Productions'
description 'Edits and UI designed by EF Productions'
version '1.0.0'
discord 'https://discord.gg/WbDp5GQ45t'
scriptname 'ef-phone'

ui_page 'html/index.html'

shared_scripts {
    'config.lua',
    '@qb-apartments/config.lua',
    '@qb-garages/config.lua',
}

client_scripts {
    'client/main.lua',
    'client/animation.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua'
}

files {
    'html/*.html',
    'html/js/*.js',
    'html/img/*.png',
    'html/css/*.css',
    'html/img/backgrounds/*.png',
    'html/img/apps/*.png',
}


lua54 'yes'

escrow_ignore{
    'config.lua',
    'server/main.lua',
    'client/main.lua',
    'client/animation.lua'
}

dependency '/assetpacks'