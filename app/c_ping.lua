-- ping
local QBCore = exports['qb-core']:GetCoreObject()

RegisterCommand('ping', function(_, args)
    if not args[1] then
        QBCore.Functions.Notify("You need to input a Player ID", "error")
    else
        TriggerServerEvent('qb-phone:server:sendPing', args[1])
    end
end)


RegisterNUICallback('AcceptPingPlayer', function()
    TriggerServerEvent('qb-ping:server:acceptping')
    TriggerEvent("qb-ping:client:UiUppers", false)
end)

RegisterNUICallback('rejectPingPlayer', function()
    TriggerServerEvent('qb-ping:server:denyping')
    TriggerEvent("qb-ping:client:UiUppers", false)
end)

RegisterNUICallback('SendPingPlayer', function(data)
    TriggerServerEvent('qb-ping:server:SendPing2', data.id)
    
end)

local CurrentPings = {}

RegisterNetEvent('qb-ping:client:DoPing', function(id)
    TriggerServerEvent('qb-ping:server:SendPing', id)
end)

RegisterNetEvent('qb-ping:client:AcceptPing', function(PingData, SenderData)
    local ped = PlayerPedId()
    local pos = GetEntityCoords(ped)

        TriggerServerEvent('qb-ping:server:SendLocation', PingData, SenderData)
end)

RegisterNetEvent('qb-ping:client:SendLocation', function(PingData, SenderData)
    QBCore.Functions.Notify('Their location has been blipped on your map', 'success')

    CurrentPings[PingData.sender] = AddBlipForCoord(PingData.coords.x, PingData.coords.y, PingData.coords.z)
    SetBlipSprite(CurrentPings[PingData.sender], 280)
    SetBlipDisplay(CurrentPings[PingData.sender], 4)
    SetBlipScale(CurrentPings[PingData.sender], 1.1)
    SetBlipAsShortRange(CurrentPings[PingData.sender], false)
    SetBlipColour(CurrentPings[PingData.sender], 0)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentSubstringPlayerName("Friend")
    EndTextCommandSetBlipName(CurrentPings[PingData.sender])

    SetTimeout(5 * (60 * 1000), function()
        QBCore.Functions.Notify('Ping '..PingData.sender..' has expired...', 'error')
        RemoveBlip(CurrentPings[PingData.sender])
        CurrentPings[PingData.sender] = nil
        TriggerEvent("qb-ping:client:UiUppers", false)
    end)
end)

RegisterNetEvent('qb-ping:client:UiUppers', function(toggle)
    if toggle then
        SendNUIMessage({
            action = "acceptrejectBlock",
        })
        TriggerEvent("qb-hud:ping:client:ShowIcon", true)
    else
        SendNUIMessage({
            action = "acceptrejectNone",
        })
        TriggerEvent("qb-hud:ping:client:ShowIcon", false)
    end
end)