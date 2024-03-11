fx_version 'bodacious'
game 'gta5'
lua54 'yes'

author 'EF Development'
description 'Edits and UI designed by BlasterSuraj'
version '2.1.0'
discord 'https://discord.gg/WbDp5GQ45t'
-- scriptname 'ef-phone'

ui_page 'html/index.html'

shared_scripts {
    'config.lua',
    '@qb-apartments/config.lua',
    -- '@qb-garages/config.lua',
}

-- client_scripts {
--     'code/animation.lua',
--     'code/client.lua',
--     'code/c_ping.lua',
-- }

-- server_scripts {
--     '@oxmysql/lib/MySQL.lua',
--     'code/server.lua',
--     'code/s_ping.lua'
-- }

client_scripts {
    'client/main.lua',
    'client/animation.lua',
    'app/c_ping.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
    'app/s_ping.lua'
}

files {
    'html/*.html',
    'html/js/*.js',
    'html/img/*.png',
    'html/img/*.jpg',
    'html/img/*.webp',
    'html/css/*.css',
    'html/img/backgrounds/*.png',
    'html/img/apps/*.png',
}


escrow_ignore{
    'config.lua',
    'code/*.lua',
}