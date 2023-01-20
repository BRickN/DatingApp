using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{

    public class PresenceHub : Hub
    {
        public PresenceTracker _tracker { get; }
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;

        }

        public override async Task OnConnectedAsync()
        {
            var username = Context.User.GetUsername();
            var isOnline = await _tracker.UserConnected(username, Context.ConnectionId);
            if (isOnline)
            {
                await Clients.Others.SendAsync("UserIsOnline", username);
            }

            var currentUsers = await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var username = Context.User.GetUsername();
            var isOffline = await _tracker.UserDisconnected(username, Context.ConnectionId);
            if (isOffline)
            {
                await Clients.Others.SendAsync("UserIsOffline", username);
            }

            //since exception is being passed through, we have to call the base method
            await base.OnDisconnectedAsync(exception);
        }
    }
}