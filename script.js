/* =========================================================
   Hello Brothers Biryani — interactions
   Vanilla JS · no dependencies
   ========================================================= */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var WHATSAPP = "https://wa.me/916305586295";
  var PHONE = "+916305586295";
  var EMAIL = "skykid437@gmail.com";
  var INSTAGRAM = "https://www.instagram.com/mr_surya__r15";
  var MAPS = "https://www.google.com/maps/search/?api=1&query=Hello%20Brothers%20Biryani%20Yanam%20533464";

  /* ---------------- Year ---------------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- Header + mobile nav ---------------- */
  var header = $("#siteHeader");
  var navToggle = $("#navToggle");
  var navLinks = $("#navLinks");
  var toTop = $("#toTop");
  var progress = $("#scrollProgress");

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 700);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, pct)) + "%";
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });
    $$("a", navLinks).forEach(function (a) { a.addEventListener("click", closeNav); });
    document.addEventListener("click", function (e) {
      if (!navLinks.classList.contains("open")) return;
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) closeNav();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) closeNav();
    });
  }

  /* ---------------- Back to top ---------------- */
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* =========================================================
     CHATBOT
     Local knowledge-base assistant.
     To upgrade to a real AI model set CHAT_BACKEND to your own
     endpoint (see README-style notes in the project).
     ========================================================= */

  // e.g. CHAT_BACKEND = "/api/chat";  -> backend must proxy the AI key
  var CHAT_BACKEND = null;

  var knowledge = [
    {
      id: "greeting",
      keys: ["hi", "hello", "hey", "hai", "namaste", "good morning", "good evening", "vanakkam"],
      reply: "Namaste! 🙏 Welcome to <strong>Hello Brothers Biryani</strong> in Yanam. I can help you with our menu, our Signature Gongura Biryani, prices and how to order. What would you like to know?",
      chips: ["Signature Gongura Biryani", "Show me the menu", "How do I order?"]
    },
    {
      id: "gongura",
      keys: ["gongura", "signature", "special dish", "best dish", "recommend", "famous", "must try", "sorrel", "tangy", "gongoora", "pulicha"],
      reply: "<strong>Signature Gongura Biryani</strong> is our pride ✦ It's an Andhra-style biryani built around <em>gongura</em> (sorrel leaf), which gives it a bold, tangy kick. Roasted spices and long-grain rice are layered through a slow-cooked masala, so every bite is aromatic and zesty. Want to enquire about it on WhatsApp?",
      chips: ["Order Gongura Biryani", "What else is on the menu?", "Where are you located?"]
    },
    {
      id: "menu",
      keys: ["menu", "items", "what do you serve", "dishes", "food", "options", "what can i order", "available"],
      reply: "Here's what we serve right now ✦<br><br>• <strong>Special Gongura Biryani</strong> — our tangy signature<br>• <strong>Chicken Biryani</strong> — tender chicken, aromatic rice<br>• <strong>Egg Biryani</strong> — spiced eggs folded into biryani rice<br><br>Menu items and prices are confirmed on enquiry, so message us and we'll help you pick.",
      chips: ["Signature Gongura Biryani", "Prices?", "How do I order?"]
    },
    {
      id: "price",
      keys: ["price", "prices", "cost", "rate", "how much", "charge", "bill", "money", "menu rate", "rate list"],
      reply: "Our menu items and prices are confirmed directly with the restaurant, so I don't want to quote a wrong number 🙏 The fastest way to get today's prices and availability is a quick message on WhatsApp.",
      chips: ["Order on WhatsApp", "Show me the menu", "Call the restaurant"]
    },
    {
      id: "chicken",
      keys: ["chicken"],
      reply: "<strong>Chicken Biryani</strong> is a crowd favourite — tender chicken slow-cooked with whole spices and layered fragrant rice. Rich, aromatic and generously spiced. Would you like the price on WhatsApp?",
      chips: ["Prices?", "Order on WhatsApp", "Show me the menu"]
    },
    {
      id: "egg",
      keys: ["egg"],
      reply: "<strong>Egg Biryani</strong> is simple and satisfying — spiced boiled eggs folded through biryani rice with crisp fried onions. A great everyday favourite. Shall I help you order?",
      chips: ["Prices?", "Order on WhatsApp", "Show me the menu"]
    },
    {
      id: "order",
      keys: ["order", "book", "buy", "delivery", "deliver", "takeaway", "parcel", "home delivery", "how to order", "place an order", "pre order"],
      reply: "Ordering is easy — just tap below to message us on WhatsApp with what you'd like. We'll confirm your order, availability and prices right there.",
      chips: ["Open WhatsApp", "Show me the menu", "Give me the location"]
    },
    {
      id: "contact",
      keys: ["contact", "phone", "number", "call", "whatsapp", "reach", "talk to", "mobile", "email", "mail", "instagram", "insta", "social"],
      reply: "You can reach <strong>Hello Brothers Biryani</strong> here ✦<br><br>📞 Phone: <a href='tel:" + PHONE + "'>+91 63055 86295</a><br>💬 WhatsApp: <a href='" + WHATSAPP + "'>+91 63055 86295</a><br>✉️ Email: <a href='mailto:" + EMAIL + "'>" + EMAIL + "</a><br>📸 Instagram: <a href='" + INSTAGRAM + "' target='_blank' rel='noopener'>@mr_surya__r15</a>",
      chips: ["Open WhatsApp", "Open Instagram", "Email us"]
    },
    {
      id: "location",
      keys: ["location", "where", "address", "map", "direction", "directions", "how to reach", "yanam", "pin", "533464", "situated", "near", "visit"],
      reply: "We're located in <strong>Yanam, PIN 533464</strong>, India. Tap below to open Google Maps and search for us, then get directions from wherever you are.",
      chips: ["Open Google Maps", "Contact details", "How do I order?"]
    },
    {
      id: "about",
      keys: ["about", "who are you", "story", "history", "why", "speciality", "specialty"],
      reply: "<strong>Hello Brothers Biryani</strong> is a biryani kitchen in Yanam, 533464, cooking Andhra-style biryani in small batches. We're best known for our Signature <strong>Gongura Biryani</strong> — the tangy flavour our regulars come back for.",
      chips: ["Signature Gongura Biryani", "Show me the menu", "Where are you located?"]
    },
    {
      id: "timing",
      keys: ["time", "timing", "open", "close", "closing", "hours", "schedule", "when do you", "till when"],
      reply: "We haven't published fixed opening hours here yet, so please confirm the current timings with us directly before visiting 🙏",
      chips: ["Open WhatsApp", "Call the restaurant", "Give me the location"]
    },
    {
      id: "diet",
      keys: ["veg", "vegetarian", "vegan", "non veg", "jain", "gluten", "allergy", "spicy", "spice"],
      reply: "Some of our biryanis are vegetarian and others are not (for example Chicken and Egg). For specific dietary needs, ingredients or allergies, please confirm with the restaurant on WhatsApp so we can guide you correctly.",
      chips: ["Open WhatsApp", "Show me the menu", "Signature Gongura Biryani"]
    },
    {
      id: "review",
      keys: ["review", "rating", "feedback", "google review", "how good", "worth"],
      reply: "We'd rather let our biryani speak for itself than publish reviews on our own site 🙏 The best way to judge is to taste it — message us and order something, especially the Signature Gongura Biryani!",
      chips: ["Order on WhatsApp", "Signature Gongura Biryani", "Show me the menu"]
    },
    {
      id: "thanks",
      keys: ["thank", "thanks", "great", "nice", "awesome", "super"],
      reply: "Happy to help! 🙏 We'd love to serve you our Signature Gongura Biryani. Message us on WhatsApp whenever you're ready.",
      chips: ["Open WhatsApp", "Show me the menu", "Give me the location"]
    },
    {
      id: "bye",
      keys: ["bye", "goodbye", "see you", "ok thanks", "okay"],
      reply: "Thank you for stopping by Hello Brothers Biryani ✦ We hope to serve you soon. Take care!",
      chips: ["Open WhatsApp", "Show me the menu"]
    }
  ];

  var chipActions = {
    "open whatsapp": WHATSAPP,
    "order on whatsapp": WHATSAPP + "?text=Hi%20Hello%20Brothers%20Biryani%2C%20I%27d%20like%20to%20place%20an%20order.",
    "order gongura biryani": WHATSAPP + "?text=Hi%20Hello%20Brothers%20Biryani%2C%20I%27d%20like%20to%20enquire%20about%20the%20Signature%20Gongura%20Biryani.",
    "call the restaurant": "tel:" + PHONE,
    "open google maps": MAPS,
    "contact details": "tel:" + PHONE,
    "open instagram": INSTAGRAM,
    "email us": "mailto:" + EMAIL
  };

  var chatLauncher = $("#chatLauncher");
  var chatPanel = $("#chatPanel");
  var chatClose = $("#chatClose");
  var chatLog = $("#chatLog");
  var chatForm = $("#chatForm");
  var chatInput = $("#chatInput");
  var chatQuick = $("#chatQuick");
  var chatBadge = $(".chat-badge");
  var greeted = false;

  function scrollLog() { if (chatLog) chatLog.scrollTop = chatLog.scrollHeight; }

  function addMsg(html, who, actions) {
    if (!chatLog) return;
    var el = document.createElement("div");
    el.className = "msg msg-" + (who === "user" ? "user" : "bot");
    var body = document.createElement("div");
    body.innerHTML = html;
    el.appendChild(body);

    if (actions && actions.length) {
      var wrap = document.createElement("div");
      wrap.className = "msg-actions";
      actions.forEach(function (a) {
        var link = document.createElement("a");
        link.href = a.href;
        link.textContent = a.label;
        if (/^https?:/.test(a.href)) {
          link.target = "_blank";
          link.rel = "noopener";
          if (/wa\.me/.test(a.href)) link.className = "wa";
        }
        wrap.appendChild(link);
      });
      el.appendChild(wrap);
    }

    chatLog.appendChild(el);
    scrollLog();
  }

  function showTyping() {
    if (!chatLog) return;
    var el = document.createElement("div");
    el.className = "msg msg-bot";
    el.id = "typingIndicator";
    el.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
    chatLog.appendChild(el);
    scrollLog();
  }

  function removeTyping() {
    var t = $("#typingIndicator");
    if (t && t.parentNode) t.parentNode.removeChild(t);
  }

  function renderChips(list) {
    if (!chatQuick) return;
    chatQuick.innerHTML = "";
    (list || []).slice(0, 3).forEach(function (label) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chat-chip";
      b.textContent = label;
      b.addEventListener("click", function () { handleChip(label); });
      chatQuick.appendChild(b);
    });
  }

  var chipLinkLabels = {
    "Open WhatsApp": "Open WhatsApp",
    "Order on WhatsApp": "Order on WhatsApp",
    "Order Gongura Biryani": "Order Gongura Biryani",
    "Open Google Maps": "Open Google Maps",
    "Call the restaurant": "Call +91 63055 86295",
    "Contact details": "Call +91 63055 86295",
    "Open Instagram": "Open Instagram",
    "Email us": "Email skykid437@gmail.com"
  };

  function handleChip(label) {
    var url = chipActions[label.toLowerCase()];

    // Not a link action -> answer it like a normal question.
    if (!url) { respond(label); return; }

    addMsg(label, "user");
    if (/^https?:/.test(url)) {
      addMsg("Opening it for you now — if nothing happens, tap the link below.", "bot", [{ label: chipLinkLabels[label] || label, href: url }]);
      window.open(url, "_blank", "noopener");
    } else {
      addMsg(/^tel:/.test(url)
        ? "Starting your call to Hello Brothers Biryani ✦"
        : "Opening your email app to message Hello Brothers Biryani ✦", "bot");
      window.location.href = url;
    }
  }

  function score(text, keys) {
    var s = 0;
    keys.forEach(function (k) { if (text.indexOf(k) !== -1) s += k.length > 4 ? 2 : 1; });
    return s;
  }

  function matchReply(text) {
    var best = null, bestScore = 0;
    knowledge.forEach(function (item) {
      var s = score(text, item.keys);
      if (s > bestScore) { bestScore = s; best = item; }
    });
    return bestScore > 0 ? best : null;
  }

  function fallbackReply() {
    return {
      reply: "I want to make sure I get this right 🙏 I can best help with our <strong>menu</strong>, the <strong>Signature Gongura Biryani</strong>, <strong>prices</strong>, <strong>contact details</strong> and our <strong>location in Yanam</strong>. For anything else, a quick WhatsApp message reaches the restaurant directly.",
      chips: ["Show me the menu", "Signature Gongura Biryani", "Open WhatsApp"]
    };
  }

  // Swappable brain: local knowledge base, or a real backend when configured.
  function getReply(message) {
    if (CHAT_BACKEND) {
      return fetch(CHAT_BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          return { reply: data.reply || data.message || "Sorry, I didn't catch that.", chips: data.chips || [] };
        })
        .catch(function () { return fallbackReply(); });
    }
    return Promise.resolve(matchReply(message.toLowerCase()) || fallbackReply());
  }

  function respond(rawText) {
    var text = String(rawText || "").trim();
    if (!text) return;

    addMsg(text, "user");
    renderChips([]);
    if (chatInput) chatInput.value = "";

    showTyping();
    var delay = Math.min(950, 380 + text.length * 12);

    getReply(text)
      .then(function (data) {
        setTimeout(function () {
          removeTyping();
          addMsg(data.reply, "bot");
          renderChips(data.chips);
        }, delay);
      })
      .catch(function () {
        removeTyping();
        var fb = fallbackReply();
        addMsg(fb.reply, "bot");
        renderChips(fb.chips);
      });
  }

  function openChat() {
    if (!chatPanel) return;
    chatPanel.hidden = false;
    if (chatLauncher) chatLauncher.setAttribute("aria-expanded", "true");
    if (chatBadge) chatBadge.classList.add("hide");
    if (!greeted) {
      greeted = true;
      setTimeout(function () {
        addMsg("Hi! I'm the <strong>Hello Brothers Biryani</strong> assistant ✦<br>Ask me about our Signature <strong>Gongura Biryani</strong>, the menu, prices or how to reach us in Yanam.", "bot");
        renderChips(["Signature Gongura Biryani", "Show me the menu", "How do I order?"]);
      }, 260);
    }
    if (chatInput) setTimeout(function () { chatInput.focus(); }, 320);
  }

  function closeChat() {
    if (!chatPanel) return;
    chatPanel.hidden = true;
    if (chatLauncher) chatLauncher.setAttribute("aria-expanded", "false");
  }

  if (chatLauncher) {
    chatLauncher.addEventListener("click", function () {
      if (chatPanel && !chatPanel.hidden) closeChat();
      else openChat();
    });
  }
  if (chatClose) chatClose.addEventListener("click", closeChat);

  if (chatForm) {
    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      respond(chatInput ? chatInput.value : "");
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && chatPanel && !chatPanel.hidden) closeChat();
  });
})();
