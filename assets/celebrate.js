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
      btn: "Got it, mojo activated!"
    },
    order: {
      title: "You did it! Order placed.",
      lines: [
        "Big move. Your couch just got upgraded to VIP lounge and your old cable bill is crying in a corner. 🛋️",
        "Your invoice is zooming to <b data-c-email></b> right now. Check your <b>inbox</b> AND your <b>spam</b> folder (emails love a good game of hide and seek).",
        "Pay the invoice and your channels light up before you can say “just one more episode”. 📺"
      ],
      btn: "Awesome, let’s go!"
    }
  };

  var CSS =
    ".mojo-celebrating,.mojo-celebrating body{overflow:hidden!important}" +
    ".mojo-cel{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:16px;overflow-y:auto;font-family:'Plus Jakarta Sans',system-ui,sans-serif;" +
    "background:radial-gradient(circle at 50% 35%,rgba(34,197,94,.22),transparent 60%),rgba(10,2,30,.93);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);animation:mcel-in .3s ease both}" +
    ".mojo-cel.is-out{animation:mcel-out .25s ease forwards}" +
    ".mojo-cel-box{position:relative;width:min(560px,100%);text-align:center;padding:clamp(28px,6vw,48px) clamp(18px,5vw,40px);background:#1a0848;border:1px solid rgba(34,197,94,.45);border-radius:20px;" +
    "box-shadow:0 0 0 1px rgba(34,197,94,.2),0 40px 120px -30px rgba(34,197,94,.45);animation:mcel-pop .55s .05s cubic-bezier(.2,.9,.3,1.3) both}" +
    ".mojo-cel-x{position:absolute;top:10px;right:10px;width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.06);color:rgba(232,224,255,.6);font-size:28px;line-height:1;cursor:pointer}" +
    ".mojo-cel-x:hover,.mojo-cel-x:focus-visible{color:#fff;background:rgba(255,255,255,.12)}" +
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
    var back = document.activeElement;
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
      '<button class="mojo-cel-x" type="button" aria-label="Close">×</button>' +
      '<svg class="mojo-cel-mark" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54"/><path d="M36 62 53 79 86 44"/></svg>' +
      '<h2 id="mojo-cel-title">' + c.title + "</h2>" +
      c.lines.map(function (l) { return "<p>" + l + "</p>"; }).join("") +
      '<button class="mojo-cel-go" type="button">' + c.btn + "</button></div>";
    var spots = el.querySelectorAll("[data-c-email]");
    for (var j = 0; j < spots.length; j++) spots[j].textContent = (email && String(email).trim()) || "your email address";
    var go = el.querySelector(".mojo-cel-go"), x = el.querySelector(".mojo-cel-x");
    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "Tab") { e.preventDefault(); (document.activeElement === go ? x : go).focus(); }
    }
    function close() {
      document.removeEventListener("keydown", onKey);
      el.classList.add("is-out");
      document.documentElement.classList.remove("mojo-celebrating");
      setTimeout(function () { el.remove(); }, 250);
      if (back && back.focus) try { back.focus({ preventScroll: true }); } catch (e) {}
    }
    document.addEventListener("keydown", onKey);
    x.addEventListener("click", close);
    go.addEventListener("click", close);
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
