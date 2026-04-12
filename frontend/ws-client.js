(function () {
  var socket = null;
  var reconnectTimer = null;
  var reconnectDelayMs = 1200;
  var handlers = {};
  var currentConfig = null;

  function notify(type, payload) {
    var list = handlers[type] || [];
    var any = handlers["*"] || [];
    list.concat(any).forEach(function (fn) {
      try {
        fn(payload);
      } catch (err) {
        console.error("WS handler error:", err);
      }
    });
  }

  function buildWsUrl(apiBase, token) {
    var base = String(apiBase || window.location.origin || "").trim();
    if (!base) return "";

    var wsBase = base.replace(/^http:\/\//i, "ws://").replace(/^https:\/\//i, "wss://").replace(/\/+$/, "");
    var url = wsBase + "/ws";
    if (token) {
      url += "?token=" + encodeURIComponent(token);
    }
    return url;
  }

  function scheduleReconnect() {
    if (!currentConfig) return;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(function () {
      connect(currentConfig);
    }, reconnectDelayMs);
    reconnectDelayMs = Math.min(8000, Math.round(reconnectDelayMs * 1.6));
  }

  function connect(config) {
    currentConfig = {
      apiBase: config && config.apiBase,
      token: config && config.token
    };

    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return socket;
    }

    var wsUrl = buildWsUrl(currentConfig.apiBase, currentConfig.token);
    if (!wsUrl) return null;

    try {
      socket = new WebSocket(wsUrl);
    } catch (err) {
      console.error("WebSocket init error:", err);
      scheduleReconnect();
      return null;
    }

    socket.addEventListener("open", function () {
      reconnectDelayMs = 1200;
      notify("ws_open", { type: "ws_open" });
    });

    socket.addEventListener("message", function (event) {
      var payload = null;
      try {
        payload = JSON.parse(event.data);
      } catch (err) {
        payload = { type: "ws_message", raw: event.data };
      }

      var type = payload && payload.type ? String(payload.type) : "ws_message";
      notify(type, payload);
    });

    socket.addEventListener("close", function () {
      notify("ws_close", { type: "ws_close" });
      scheduleReconnect();
    });

    socket.addEventListener("error", function (err) {
      notify("ws_error", { type: "ws_error", error: err });
    });

    return socket;
  }

  function on(type, handler) {
    var key = String(type || "*");
    handlers[key] = handlers[key] || [];
    handlers[key].push(handler);

    return function unsubscribe() {
      handlers[key] = (handlers[key] || []).filter(function (fn) {
        return fn !== handler;
      });
    };
  }

  function disconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    currentConfig = null;
    if (socket) {
      try {
        socket.close();
      } catch (err) {
        console.error("WebSocket close error:", err);
      }
      socket = null;
    }
  }

  function isConnected() {
    return !!socket && socket.readyState === WebSocket.OPEN;
  }

  window.AppWS = {
    connect: connect,
    on: on,
    disconnect: disconnect,
    isConnected: isConnected
  };
})();
