-- ping

local QBCore = exports['qb-core']:GetCoreObject()
local Pings = {}

RegisterNetEvent('qb-phone:server:sendPing', function(data)
    local src = source
    if src == data then
        TriggerClientEvent("QBCore:Notify", src, "You cannot ping yourself", "error")
    end
end)

RegisterNetEvent('qb-ping:server:SendPing2', function(id)
    local src = source

    TriggerClientEvent('qb-ping:client:DoPing', src, tonumber(id))
end)

RegisterNetEvent('qb-ping:server:acceptping', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if Pings[src] ~= nil then
        TriggerClientEvent('qb-ping:client:AcceptPing', src, Pings[src], QBCore.Functions.GetPlayer(Pings[src].sender))
        TriggerClientEvent('QBCore:Notify', Pings[src].sender, Player.PlayerData.charinfo.firstname.." "..Player.PlayerData.charinfo.lastname.." accepted your ping request!")
        Pings[src] = nil
    else
        TriggerClientEvent('QBCore:Notify', src, "You have no ping...", "error")
    end
end)

RegisterNetEvent('qb-ping:server:denyping', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if Pings[src] ~= nil then
        TriggerClientEvent('QBCore:Notify', Pings[src].sender, "Your ping request has been rejected...", "error")
        TriggerClientEvent('QBCore:Notify', src, "You turned down the ping...", "success")
        Pings[src] = nil
    else
        TriggerClientEvent('QBCore:Notify', src, "You have no ping...", "error")
    end
end)

RegisterNetEvent('qb-ping:server:SendPing', function(id)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    local Target = QBCore.Functions.GetPlayer(id)
    local ped = GetPlayerPed(id)
    local coords = GetEntityCoords(ped)

    if Target ~= nil then
        local OtherItem = Target.Functions.GetItemByName("phone")
        if OtherItem ~= nil then
            TriggerClientEvent('QBCore:Notify', src, "You have requested the location of "..Target.PlayerData.charinfo.firstname.." "..Target.PlayerData.charinfo.lastname)
            Pings[id] = {
                coords = coords,
                sender = src,
            }
            TriggerClientEvent('QBCore:Notify', id, "You have received a ping request from "..Player.PlayerData.charinfo.firstname.." "..Player.PlayerData.charinfo.lastname..". Use the app to allow or reject!")
            TriggerClientEvent('qb-ping:client:UiUppers', id, true)
        else
            TriggerClientEvent('QBCore:Notify', src, "Could not send ping...", "error")
        end
    else
        TriggerClientEvent('QBCore:Notify', src, "This person is not in the city...", "error")
    end
end)

RegisterNetEvent('qb-ping:server:SendLocation', function(PingData, SenderData)
    TriggerClientEvent('qb-ping:client:SendLocation', PingData.sender, PingData, SenderData)
end)