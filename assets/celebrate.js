/* IPTVmojo: full-screen celebration after a free-trial request or a plan order.
   Pages call window.mojoCelebrate("trial" | "order", email) after a successful send.
   Preview without submitting: add ?celebrate=trial or ?celebrate=order to a page that loads this file
   (free-trial.html, order.html and the iptv-*-month*.html plan pages). */
(function () {
  var COPY = {
    trial: {
      title: "Your free trial is on its way!",
      lines: [
        "Our Mojo crew is beaming your login over to <b data-c-email></b> faster than you can find the remote. 📡",
        "It usually lands within a few minutes. Check your <b>inbox</b> AND your <b>spam</b> folder, because sometimes our email gets a little too much mojo and goes hanging out with the junk crowd.",
        "Your only job for the next 24 hours: couch, snacks, zero buffering excuses. 🍿"
      ],
      btn: "Got it, take me home!"
    },
    order: {
      title: "You did it! Order placed.",
      lines: [
        "Big move. Your couch just got upgraded to VIP lounge and your old cable bill is crying in a corner. 🛋️",
        "Your invoice is zooming to <b data-c-email></b> right now. Check your <b>inbox</b> AND your <b>spam</b> folder (emails love a good game of hide and seek).",
        "Pay the invoice and your channels light up before you can say “just one more episode”. 📺"
      ],
      btn: "Awesome, back to the homepage!"
    }
  };

  var CSS =
    ".mojo-celebrating,.mojo-celebrating body{overflow:hidden!important}" +
    ".mojo-cel{position:fixed;inset:0;z-index:100000;display:flex;padding:max(16px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left));overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;font-family:'Plus Jakarta Sans',system-ui,sans-serif;" +
    "background:radial-gradient(circle at 50% 35%,rgba(34,197,94,.22),transparent 60%),rgba(10,2,30,.93);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);animation:mcel-in .3s ease both}" +
    ".mojo-cel.is-out{animation:mcel-out .25s ease forwards}" +
    ".mojo-cel-box{position:relative;box-sizing:border-box;margin:auto;width:min(560px,100%);text-align:center;padding:clamp(28px,6vw,48px) clamp(18px,5vw,40px);background:#1a0848;border:1px solid rgba(34,197,94,.45);border-radius:20px;" +
    "box-shadow:0 0 0 1px rgba(34,197,94,.2),0 40px 120px -30px rgba(34,197,94,.45);animation:mcel-pop .55s .05s cubic-bezier(.2,.9,.3,1.3) both}" +
    ".mojo-cel-mark{display:block;width:clamp(130px,38vw,180px);height:auto;margin:0 auto 22px;fill:none;stroke:#4ade80;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 24px rgba(74,222,128,.5))}" +
    ".mojo-cel-mark circle{stroke-width:6;stroke-dasharray:340;stroke-dashoffset:340;animation:mcel-draw .7s .2s ease forwards;fill:rgba(34,197,94,.1)}" +
    ".mojo-cel-mark path{stroke-width:9;stroke-dasharray:80;stroke-dashoffset:80;animation:mcel-draw .45s .8s ease forwards,mcel-bounce .5s 1.2s ease;transform-origin:center}" +
    ".mojo-cel h2{font-size:clamp(28px,6vw,40px);font-weight:800;line-height:1.15;margin:0 0 16px;color:#4ade80}" +
    ".mojo-cel p{color:#d6cff0;font-size:clamp(16px,2.2vw,18px);line-height:1.55;margin:0 auto 12px;max-width:460px}" +
    ".mojo-cel p b{color:#fff;font-weight:800;word-break:break-word}" +
    ".mojo-cel-go{display:block;margin:18px auto 0;width:100%;max-width:360px;min-height:52px;padding:14px 22px;border:0;border-radius:12px;background:#fd0322;color:#fff;font:inherit;font-size:17px;font-weight:800;cursor:pointer;box-shadow:0 12px 30px -10px rgba(253,3,34,.7);transition:transform .15s}" +
    ".mojo-cel-go:hover,.mojo-cel-go:focus-visible{transform:translateY(-2px)}" +
    ".mojo-cel-bits{position:fixed;inset:0;pointer-events:none;overflow:hidden}" +
    ".mojo-cel-bits i{position:absolute;top:-40px;left:var(--x);width:10px;height:16px;border-radius:3px;font-style:normal;font-size:22px;line-height:1;background:#fd0322;animation:mcel-fall var(--t) var(--d) linear infinite}" +
    ".mojo-cel-bits i:nth-child(4n+1){background:#4ade80}.mojo-cel-bits i:nth-child(4n+2){background:#fff}.mojo-cel-bits i:nth-child(4n+3){background:#a78bfa}" +
    ".mojo-cel-bits i:nth-child(3n+1){width:auto;height:auto;background:none}" +
    "@keyframes mcel-in{from{opacity:0}}@keyframes mcel-out{to{opacity:0}}@keyframes mcel-draw{to{stroke-dashoffset:0}}" +
    "@keyframes mcel-pop{from{opacity:0;transform:scale(.8) translateY(20px)}}@keyframes mcel-bounce{50%{transform:scale(1.15)}}" +
    "@keyframes mcel-fall{from{transform:translateY(0) rotate(var(--r))}to{transform:translateY(110vh) rotate(calc(var(--r) + 540deg))}}" +
    "@media (max-width:360px){.mojo-cel h2{font-size:24px}.mojo-cel p{font-size:15px}.mojo-cel-mark{width:110px;margin-bottom:16px}}" +
    "@media (max-height:600px){.mojo-cel-box{padding:22px 20px}.mojo-cel-mark{width:84px;margin-bottom:10px}.mojo-cel h2{font-size:24px;margin-bottom:10px}.mojo-cel p{font-size:15px;margin-bottom:8px}.mojo-cel-go{margin-top:10px}}" +
    "@media (prefers-reduced-motion:reduce){.mojo-cel,.mojo-cel-box{animation:none}.mojo-cel-bits{display:none}.mojo-cel-mark circle,.mojo-cel-mark path{animation:none;stroke-dashoffset:0}}";

  function addCss() {
    if (document.getElementById("mojo-cel-css")) return;
    var s = document.createElement("style");
    s.id = "mojo-cel-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function celebrate(kind, email) {
    var c = COPY[kind === "order" ? "order" : "trial"];
    addCss();
    var old = document.querySelector(".mojo-cel");
    if (old) old.remove();
    var el = document.createElement("div");
    el.className = "mojo-cel";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "mojo-cel-title");
    var bits = "";
    for (var i = 0; i < 28; i++) {
      bits += '<i style="--x:' + ((i * 37) % 100) + "%;--d:" + ((i % 7) * 0.35) + "s;--t:" + (3.2 + (i % 5) * 0.5) + "s;--r:" + ((i * 53) % 360) + 'deg">' +
        (i % 3 ? "" : (i % 2 ? "⚡" : "📺")) + "</i>";
    }
    el.innerHTML = '<div class="mojo-cel-bits" aria-hidden="true">' + bits + "</div>" +
      '<div class="mojo-cel-box">' +
      '<svg class="mojo-cel-mark" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54"/><path d="M36 62 53 79 86 44"/></svg>' +
      '<h2 id="mojo-cel-title">' + c.title + "</h2>" +
      c.lines.map(function (l) { return "<p>" + l + "</p>"; }).join("") +
      '<button class="mojo-cel-go" type="button">' + c.btn + "</button></div>";
    var spots = el.querySelectorAll("[data-c-email]");
    for (var j = 0; j < spots.length; j++) spots[j].textContent = (email && String(email).trim()) || "your email address";
    var go = el.querySelector(".mojo-cel-go");
    // No way to dismiss: the only exit is the button, which goes to the homepage.
    el.addEventListener("keydown", function (e) { if (e.key === "Tab") { e.preventDefault(); go.focus(); } });
    go.addEventListener("click", function () { location.href = "/"; });
    // Hide the page's own plain confirmation so it can never show behind or after this screen.
    ["mojo-suc", "tf-suc", "mojo-form-area", "tf-form-area"].forEach(function (id) {
      var n = document.getElementById(id); if (n) n.style.setProperty("display", "none", "important");
    });
    document.body.appendChild(el);
    document.documentElement.classList.add("mojo-celebrating");
    try { go.focus({ preventScroll: true }); } catch (e) {}
  }

  window.mojoCelebrate = celebrate;

  var q = new URLSearchParams(location.search).get("celebrate");
  if (q) {
    var run = function () { celebrate(q === "order" ? "order" : "trial", "you@example.com"); };
    if (document.body) run(); else document.addEventListener("DOMContentLoaded", run);
  }
})();
