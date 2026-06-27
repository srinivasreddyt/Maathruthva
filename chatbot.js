(function () {
  var FAQS = [
    {
      q: "What products do you sell?",
      a: "We sell natural baby food mixes made with wholesome ingredients — including our <b>Natural Baby Food Mix</b>, <b>Growth Mix</b>, and <b>Daily Millet Mix</b>. All crafted with a mother's care! 🌿"
    },
    {
      q: "How much does shipping cost?",
      a: "We offer <b>FREE shipping on orders above ₹999</b>! For orders below ₹999, a small shipping fee applies."
    },
    {
      q: "How long does delivery take?",
      a: "Orders are typically delivered within <b>3–5 business days</b> after dispatch. You'll receive updates on your order status."
    },
    {
      q: "Are the products safe for babies?",
      a: "Absolutely! 💚 All our products are <b>100% natural</b>, free from preservatives and artificial additives. They are crafted specifically for babies and toddlers."
    },
    {
      q: "How do I place an order?",
      a: "Simply browse our <a href='Food_Products.html' style='color:#4a6830;font-weight:600;'>Food Products</a> page, add items to your cart, and proceed to checkout. It's that easy!"
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept UPI, credit/debit cards, and net banking through our secure payment gateway."
    },
    {
      q: "Can I track my order?",
      a: "Yes! Once logged in, visit <a href='my-orders.html' style='color:#4a6830;font-weight:600;'>My Orders</a> to see the live status of your order."
    },
    {
      q: "How do I contact you?",
      a: "You can reach us at <b>srinivasreddytalla333@gmail.com</b> or visit our <a href='index.html#contact' style='color:#4a6830;font-weight:600;'>Contact</a> section. We're happy to help! 😊"
    },
    {
      q: "What is your return policy?",
      a: "We want you to be completely happy! If you have any issues with your order, please contact us within <b>7 days of delivery</b> and we'll make it right."
    }
  ];

  var WELCOME = "Hi there! 👋 I'm <b>Maathu</b>, your Maathruthva assistant.<br>How can I help you today?";

  function buildWidget() {
    // Inject styles
    var style = document.createElement('style');
    style.textContent = [
      '#mtr-chat-btn{position:fixed;bottom:24px;right:24px;width:64px;height:64px;border-radius:50%;cursor:pointer;z-index:9999;border:none;padding:0;background:transparent;box-shadow:0 4px 20px rgba(0,0,0,.2);transition:transform .2s;}',
      '#mtr-chat-btn:hover{transform:scale(1.08);}',
      '#mtr-chat-btn img{width:64px;height:64px;border-radius:50%;object-fit:cover;}',
      '#mtr-chat-badge{position:absolute;top:-3px;right:-3px;background:#e74c3c;color:#fff;font-size:10px;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:sans-serif;}',
      '#mtr-chat-panel{position:fixed;bottom:100px;right:24px;width:330px;max-height:500px;background:#fff;border-radius:18px;box-shadow:0 8px 40px rgba(0,0,0,.18);z-index:9998;display:flex;flex-direction:column;overflow:hidden;font-family:"Jost",sans-serif;transition:opacity .2s,transform .2s;}',
      '#mtr-chat-panel.hidden{opacity:0;pointer-events:none;transform:translateY(10px);}',
      '#mtr-chat-header{background:linear-gradient(135deg,#4a6830,#6a9040);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;}',
      '#mtr-chat-header img{width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.4);}',
      '#mtr-chat-header-text .name{font-weight:600;font-size:14px;}',
      '#mtr-chat-header-text .status{font-size:11px;opacity:.8;}',
      '#mtr-chat-close{margin-left:auto;background:none;border:none;color:#fff;font-size:20px;cursor:pointer;opacity:.8;line-height:1;padding:0;}',
      '#mtr-chat-close:hover{opacity:1;}',
      '#mtr-chat-messages{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:10px;background:#f9f6f0;}',
      '.mtr-msg{max-width:85%;padding:10px 13px;border-radius:14px;font-size:13px;line-height:1.5;}',
      '.mtr-msg.bot{background:#fff;color:#333;border-bottom-left-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,.07);align-self:flex-start;}',
      '.mtr-msg.user{background:#4a6830;color:#fff;border-bottom-right-radius:4px;align-self:flex-end;}',
      '#mtr-chat-faqs{padding:10px 12px;border-top:1px solid #ede6da;background:#fff;overflow-x:hidden;flex-shrink:0;}',
      '#mtr-chat-faqs p{font-size:11px;color:#aaa;margin-bottom:7px;text-transform:uppercase;letter-spacing:.04em;}',
      '.mtr-faq-btn{display:block;width:100%;text-align:left;background:#fdf8f0;border:1px solid #e8dfd0;border-radius:10px;padding:8px 12px;font-size:12.5px;color:#4a6830;cursor:pointer;margin-bottom:6px;font-family:"Jost",sans-serif;transition:background .15s;}',
      '.mtr-faq-btn:hover{background:#eef4e6;}',
      '@media(max-width:400px){#mtr-chat-panel{width:calc(100vw - 20px);right:10px;}}'
    ].join('');
    document.head.appendChild(style);

    // Floating button
    var btn = document.createElement('button');
    btn.id = 'mtr-chat-btn';
    btn.title = 'Chat with us';
    btn.innerHTML = '<img src="chatbot-avatar.png" alt="Chat"><div id="mtr-chat-badge">1</div>';
    document.body.appendChild(btn);

    // Panel
    var panel = document.createElement('div');
    panel.id = 'mtr-chat-panel';
    panel.className = 'hidden';
    panel.innerHTML = [
      '<div id="mtr-chat-header">',
        '<img src="chatbot-avatar.png" alt="Maathu">',
        '<div id="mtr-chat-header-text"><div class="name">Maathu</div><div class="status">● Online — here to help</div></div>',
        '<button id="mtr-chat-close" title="Close">✕</button>',
      '</div>',
      '<div id="mtr-chat-messages"></div>',
      '<div id="mtr-chat-faqs">',
        '<p>Choose a question</p>',
      '</div>'
    ].join('');
    document.body.appendChild(panel);

    var msgs = panel.querySelector('#mtr-chat-messages');
    var faqsBox = panel.querySelector('#mtr-chat-faqs');
    var badge = btn.querySelector('#mtr-chat-badge');

    function addMsg(text, who) {
      var d = document.createElement('div');
      d.className = 'mtr-msg ' + who;
      d.innerHTML = text;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function buildFaqButtons(subset) {
      // Remove old buttons
      faqsBox.querySelectorAll('.mtr-faq-btn').forEach(function(b){ b.remove(); });
      subset.forEach(function(faq) {
        var b = document.createElement('button');
        b.className = 'mtr-faq-btn';
        b.textContent = faq.q;
        b.addEventListener('click', function() {
          addMsg(faq.q, 'user');
          setTimeout(function() {
            addMsg(faq.a, 'bot');
            // After answering, show "Ask another question" option
            buildFaqButtons(FAQS.filter(function(f){ return f.q !== faq.q; }).slice(0,5));
          }, 350);
        });
        faqsBox.appendChild(b);
      });
    }

    // Show welcome + first 5 FAQs
    function openChat() {
      panel.classList.remove('hidden');
      badge.style.display = 'none';
      if (msgs.children.length === 0) {
        addMsg(WELCOME, 'bot');
        buildFaqButtons(FAQS.slice(0, 5));
      }
    }

    btn.addEventListener('click', function() {
      if (panel.classList.contains('hidden')) openChat();
      else panel.classList.add('hidden');
    });

    panel.querySelector('#mtr-chat-close').addEventListener('click', function() {
      panel.classList.add('hidden');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
