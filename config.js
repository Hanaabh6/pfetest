window.APP_CONFIG = window.APP_CONFIG || {};

if (!window.APP_CONFIG.API_BASE) {
  window.APP_CONFIG.API_BASE = "http://127.0.0.1:8000";
}

(function () {
  var nativeAlert = window.alert ? window.alert.bind(window) : function () {};
  var uiReady = false;
  var toastEl = null;
  var toastTextEl = null;
  var toastTimer = null;
  var confirmEl = null;
  var confirmTextEl = null;
  var confirmOkEl = null;
  var confirmCancelEl = null;
  var confirmBackdropEl = null;

  function ensureUi() {
    if (uiReady || !document.body) return uiReady;

    var style = document.createElement("style");
    style.id = "app-ui-feedback-style";
    style.textContent = ""
      + ".app-ui-toast{position:fixed;right:16px;top:16px;z-index:2147483646;display:none;align-items:center;gap:10px;min-width:260px;max-width:min(420px,calc(100vw - 32px));padding:10px 12px;border-radius:12px;border:1px solid rgba(148,163,184,.35);background:rgba(255,255,255,.98);box-shadow:0 18px 36px rgba(15,23,42,.22);opacity:0;transform:translateY(-8px);transition:all .24s ease;font-family:Segoe UI,sans-serif}"
      + ".app-ui-toast.show{display:flex;opacity:1;transform:translateY(0)}"
      + ".app-ui-toast img{width:32px;height:32px;border-radius:8px;padding:5px;background:#ecfeff;border:1px solid #bae6fd;object-fit:contain;flex:0 0 32px}"
      + ".app-ui-toast p{margin:0;color:#0f172a;font-size:13px;font-weight:700;line-height:1.5}"
      + ".app-ui-toast.success{background:rgba(240,253,250,.98);border-color:rgba(16,185,129,.4)}"
      + ".app-ui-toast.error{background:rgba(255,241,242,.98);border-color:rgba(244,63,94,.4)}"
      + ".app-ui-confirm{position:fixed;inset:0;display:none;align-items:center;justify-content:center;z-index:2147483645;padding:16px;font-family:Segoe UI,sans-serif}"
      + ".app-ui-confirm.show{display:flex}"
      + ".app-ui-confirm-backdrop{position:absolute;inset:0;background:rgba(15,23,42,.38);backdrop-filter:blur(2px)}"
      + ".app-ui-confirm-card{position:relative;width:min(460px,calc(100vw - 30px));border-radius:16px;border:1px solid rgba(148,163,184,.4);background:linear-gradient(170deg,rgba(255,255,255,.98),rgba(248,250,252,.95));box-shadow:0 24px 45px rgba(15,23,42,.24);padding:16px}"
      + ".app-ui-confirm-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}"
      + ".app-ui-confirm-logo{width:40px;height:40px;border-radius:10px;padding:7px;background:#ecfeff;border:1px solid #bae6fd;object-fit:contain}"
      + ".app-ui-confirm-title{margin:0;font-size:16px;font-weight:900;color:#0f172a}"
      + ".app-ui-confirm-text{margin:0;color:#334155;line-height:1.6;font-size:14px;font-weight:600}"
      + ".app-ui-confirm-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}"
      + ".app-ui-confirm-btn{border:none;border-radius:10px;padding:9px 12px;font-size:13px;font-weight:800;cursor:pointer}"
      + ".app-ui-confirm-btn.cancel{background:#e2e8f0;color:#0f172a}"
      + ".app-ui-confirm-btn.ok{background:#0f766e;color:#fff}";
    document.head.appendChild(style);

    toastEl = document.createElement("div");
    toastEl.className = "app-ui-toast";
    toastEl.innerHTML = "<img src=\"intellibuild-mark.svg\" alt=\"IntelliBuild\"><p></p>";
    toastTextEl = toastEl.querySelector("p");
    document.body.appendChild(toastEl);

    confirmEl = document.createElement("div");
    confirmEl.className = "app-ui-confirm";
    confirmEl.innerHTML = ""
      + "<div class=\"app-ui-confirm-backdrop\"></div>"
      + "<div class=\"app-ui-confirm-card\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Confirmation\">"
      + "<div class=\"app-ui-confirm-head\">"
      + "<img class=\"app-ui-confirm-logo\" src=\"intellibuild-mark.svg\" alt=\"IntelliBuild\">"
      + "<h3 class=\"app-ui-confirm-title\">Confirmer l'action</h3>"
      + "</div>"
      + "<p class=\"app-ui-confirm-text\">Confirmer cette action ?</p>"
      + "<div class=\"app-ui-confirm-actions\">"
      + "<button type=\"button\" class=\"app-ui-confirm-btn cancel\">Annuler</button>"
      + "<button type=\"button\" class=\"app-ui-confirm-btn ok\">Confirmer</button>"
      + "</div>"
      + "</div>";
    document.body.appendChild(confirmEl);

    confirmBackdropEl = confirmEl.querySelector(".app-ui-confirm-backdrop");
    confirmTextEl = confirmEl.querySelector(".app-ui-confirm-text");
    confirmOkEl = confirmEl.querySelector(".app-ui-confirm-btn.ok");
    confirmCancelEl = confirmEl.querySelector(".app-ui-confirm-btn.cancel");

    uiReady = true;
    return true;
  }

  function showToast(message, type) {
    if (!ensureUi()) {
      nativeAlert(String(message || "Information"));
      return;
    }
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    toastEl.classList.remove("success", "error", "show");
    toastEl.classList.add(type === "error" ? "error" : "success");
    toastTextEl.textContent = String(message || "Operation terminee");
    toastEl.classList.add("show");
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2600);
  }

  window.appUiAlert = function (message, type) {
    showToast(message, type || "success");
  };

  window.appUiConfirm = function (message) {
    return new Promise(function (resolve) {
      if (!ensureUi()) {
        resolve(window.confirm(String(message || "Confirmer cette action ?")));
        return;
      }

      confirmTextEl.textContent = String(message || "Confirmer cette action ?");
      confirmEl.classList.add("show");

      function close(answer) {
        confirmEl.classList.remove("show");
        confirmOkEl.removeEventListener("click", onOk);
        confirmCancelEl.removeEventListener("click", onCancel);
        confirmBackdropEl.removeEventListener("click", onCancel);
        resolve(answer);
      }

      function onOk() { close(true); }
      function onCancel() { close(false); }

      confirmOkEl.addEventListener("click", onOk);
      confirmCancelEl.addEventListener("click", onCancel);
      confirmBackdropEl.addEventListener("click", onCancel);
    });
  };

  window.alert = function (message) {
    var text = String(message || "").toLowerCase();
    var looksError = text.indexOf("erreur") >= 0
      || text.indexOf("impossible") >= 0
      || text.indexOf("invalide") >= 0
      || text.indexOf("echec") >= 0
      || text.indexOf("failed") >= 0
      || text.indexOf("error") >= 0;
    showToast(message, looksError ? "error" : "success");
  };
})();