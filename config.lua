Config = Config or {}
Config.BillingCommissions = { -- This is a percentage (0.10) == 10%
    mechanic = 0.10
}



-- Webhooks
Config.serverwebhook = "" ---enter your webhook link here don't forget to do this Important for camera work.
--- Important to add a webhook


--config here 
Config.corename = 'qb-core' --framework name
Config.target = 'qb-target'
Config.trucker = 'qb-trucker'
Config.crypto = 'qb-crypto'
Config.lapraces = 'qb-lapraces'
Config.houses = 'qb-houses'
Config.pings = 'qb-pings'
Config.hud = "qb-hud"
Config.bossmenu = "qb-bossmenu"

Config.Movement = false -- Allow walking and driving while using phone



Config.Linux = false -- True if linux
Config.TweetDuration = 12 -- How many hours to load tweets (12 will load the past 12 hours of tweets)
Config.RepeatTimeout = 2000
Config.CallRepeats = 10
Config.OpenPhone = 244
Config.PhoneApplications = {
    ["phone"] = {
        app = "phone",
        icon = "fa fa-phone-alt",
        tooltipText = "Phone",
        tooltipPos = "top",
        job = false,
        blockedjobs = {},
        slot = 1,
        Alerts = 0,
    },
    ["whatsapp"] = {
        app = "whatsapp",
        icon = "fab fa-whatsapp",
        tooltipText = "Whatsapp",
        tooltipPos = "top",
        style = "font-size: 2.8vh";
        job = false,
        blockedjobs = {},
        slot = 2,
        Alerts = 0,
    },
    ["settings"] = {
        app = "settings",
        icon = "fas fa-cog",
        tooltipText = "Settings",
        tooltipPos = "top",
        style = "padding-right: .08vh; font-size: 2.3vh";
        job = false,
        blockedjobs = {},
        slot = 5,
        Alerts = 0,
    },
    ["twitter"] = {
        app = "twitter",
        icon = "fab fa-twitter",
        tooltipText = "Twitter",
        tooltipPos = "top",
        job = false,
        blockedjobs = {},
        slot = 4,
        Alerts = 0,
    },
    ["garage"] = {
        app = "garage",
        icon = "fas fa-car",
        tooltipText = "My Garage",
        job = false,
        blockedjobs = {},
        slot = 14,
        Alerts = 0,
    },
    ["mail"] = {
        app = "mail",
        icon = "fas fa-envelope",
        tooltipText = "Mail",
        job = false,
        blockedjobs = {},
        slot = 3,
        Alerts = 0,
    },
    ["advert"] = {
        app = "advert",
        icon = "fas fa-bullhorn",
        tooltipText = "Advertisements",
        job = false,
        blockedjobs = {},
        slot = 13,
        Alerts = 0,
    },
    ["bank"] = {
        app = "bank",
        icon = "fas fa-money-check-alt",
        tooltipText = "PayPal",
        job = false,
        blockedjobs = {},
        slot = 6,
        Alerts = 0,
    },


    -- uncomment if u want this  (make sure u define a perfect slot to this)


    -- ["crypto"] = {
    --     app = "crypto",
    --     icon = "fas fa-coins",
    --     tooltipText = "Crypto",
    --     job = false,
    --     blockedjobs = {},
    --     slot = 19,
    --     Alerts = 0,
    -- },

    
    ["racing"] = {
        app = "racing",
        icon = "fas fa-flag-checkered",
        tooltipText = "Racing",
        job = false,
        blockedjobs = {},
        slot = 15,
        Alerts = 0,
    },
    ["houses"] = {
        app = "houses",
        icon = "fas fa-home",
        tooltipText = "Houses",
        job = false,
        blockedjobs = {},
        slot = 11,
        Alerts = 0,
    },
    ["lawyers"] = {
        app = "lawyers",
        icon = "fas fa-briefcase",
        tooltipText = "Employees",
        tooltipPos = "bottom",
        job = false,
        blockedjobs = {},
        slot = 12,
        Alerts = 0,
    },
    ["camera"] = {
        app = "camera",
        icon = "fas fa-camera",
        tooltipText = "Camera",
        tooltipPos = "bottom",
        job = false,
        blockedjobs = {},
        slot = 7,
        Alerts = 0,
    },
    ["gallery"] = {
        app = "gallery",
        icon = "fas fa-images",
        tooltipText = "Photos",
        tooltipPos = "bottom",
        job = false,
        blockedjobs = {},
        slot = 8,
        Alerts = 0,
    },
    ["calculator"] = {
        app = "calculator",
        color = "#c94001",
        color2 = "#9c3100",
        icon = "fas fa-calculator",
        tooltipText = "Calculator",
        tooltipPos = "bottom",
        style = "font-size: 2.5vh";
        job = false,
        blockedjobs = {},
        slot = 9,
        Alerts = 0,
    },
    ["meos"] = {
        app = "meos",
        -- color = "#004682",
        -- icon = "fas fa-ad",
        tooltipText = "MDT",
        job = "police",
        blockedjobs = {},
        slot = 18,
        Alerts = 0,
    },
    ["bill"] = {
        app = "bill",
        -- color = "#fdfeff",
        -- color2 = "#d5e6fa",
        -- icon = "fas fa-ad",
        tooltipText = "bill",
        job = false,
        blockedjobs = {},
        slot = 16,
        Alerts = 0,
    },
    ["paytm"] = {
        app = "paytm",
        color = "#ffffff",
        -- color2 = "#161616",
        -- icon = "fas fa-ad",
        tooltipText = "paytm",
        job = false,
        blockedjobs = {},
        slot = 17,
        Alerts = 0,
    },
    ["ping"] = {
        app = "ping",
        icon = "fas fa-map-marker-alt",
        tooltipText = "Google Maps",
        tooltipPos = "top",
        style = "font-size: 3.3vh";
        job = false,
        blockedjobs = {},
        slot = 10,
        Alerts = 0,
    },
}
Config.MaxSlots = 21

