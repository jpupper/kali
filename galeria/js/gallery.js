/* Galería de sketches de Kali — carga viva con cupo de contextos WebGL */
(function () {
    'use strict';

    var MAX_LIVE = 6;          // iframes vivos al mismo tiempo (límite de contextos WebGL del navegador)
    var stages = Array.prototype.slice.call(document.querySelectorAll('.stage'));
    var grid = document.getElementById('grid');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.sketch'));
    var search = document.getElementById('search');
    var countEl = document.getElementById('count');
    var emptyEl = document.getElementById('empty');
    var randomBtn = document.getElementById('random');

    var live = new Set();       // stages con iframe cargado
    var pending = [];           // stages que quieren cargarse

    function load(stage) {
        if (stage.dataset.loaded === '1' || live.has(stage)) return;
        var src = stage.dataset.src;
        if (!src) return;
        var frame = document.createElement('iframe');
        frame.src = src;
        frame.loading = 'lazy';
        frame.setAttribute('scrolling', 'no');
        frame.setAttribute('title', 'Sketch de Kali');
        frame.setAttribute('allow', 'autoplay');
        stage.appendChild(frame);
        stage.dataset.loaded = '1';
        live.add(stage);
        frame.addEventListener('load', function () {
            setTimeout(function () { checkRender(stage, frame); }, 1600);
        });
    }

    /* Si el sketch todavía no dibujó nada (cuadro uniforme), se deja el poster:
       así no queda un rectángulo negro tapando la vista previa. */
    function checkRender(stage, frame) {
        var sd = -1;
        try {
            var doc = frame.contentDocument;
            var cv = doc && doc.querySelector('canvas');
            if (cv && cv.width > 4 && cv.height > 4) {
                var c = document.createElement('canvas');
                c.width = 64;
                c.height = 40;
                var x = c.getContext('2d');
                x.drawImage(cv, 0, 0, 64, 40);
                var d = x.getImageData(0, 0, 64, 40).data;
                var n = 0, s = 0, s2 = 0;
                for (var i = 0; i < d.length; i += 4) {
                    var v = (d[i] + d[i + 1] + d[i + 2]) / 3;
                    s += v; s2 += v * v; n++;
                }
                var mean = s / n;
                sd = Math.sqrt(Math.max(0, s2 / n - mean * mean));
            }
        } catch (err) { sd = -1; }
        if (sd >= 0 && sd < 5) {
            stage.classList.add('blank');
        } else {
            stage.classList.add('live');
        }
    }

    function unload(stage) {
        var frame = stage.querySelector('iframe');
        if (frame) {
            frame.src = 'about:blank';
            frame.remove();
        }
        stage.classList.remove('live', 'blank', 'active');
        stage.dataset.loaded = '0';
        live.delete(stage);
        pump();
    }

    function pump() {
        while (live.size < MAX_LIVE && pending.length) {
            var stage = pending.shift();
            if (!stage.dataset.loaded || stage.dataset.loaded === '0') load(stage);
        }
    }

    function request(stage) {
        if (stage.dataset.loaded === '1') return;
        if (live.size < MAX_LIVE) { load(stage); }
        else if (pending.indexOf(stage) === -1) { pending.push(stage); }
    }

    var nearObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            var stage = entry.target;
            if (entry.isIntersecting) {
                request(stage);
            } else if (live.has(stage)) {
                var rect = entry.boundingClientRect;
                // liberar sólo si salió bastante de pantalla
                if (rect.bottom < -600 || rect.top > window.innerHeight + 600) unload(stage);
            }
        });
    }, { rootMargin: '350px 0px', threshold: 0.01 });

    stages.forEach(function (stage) { nearObserver.observe(stage); });

    /* Interactuar: le pasa el mouse al sketch (si no, la rueda queda para la página) */
    function deactivateAll(except) {
        stages.forEach(function (s) { if (s !== except) s.classList.remove('active'); });
    }

    document.addEventListener('click', function (ev) {
        var btn = ev.target.closest ? ev.target.closest('[data-act="interact"]') : null;
        if (btn) {
            var stage = btn.closest('.stage');
            ev.preventDefault();
            var on = stage.classList.toggle('active');
            if (on) {
                deactivateAll(stage);
                request(stage);
                stage.classList.remove('blank');
                stage.classList.add('live');
                btn.textContent = 'soltar mouse';
            } else {
                btn.textContent = 'interactuar';
            }
            return;
        }
        if (!ev.target.closest || !ev.target.closest('.stage.active')) {
            stages.forEach(function (s) {
                s.classList.remove('active');
                var b = s.querySelector('[data-act="interact"]');
                if (b) b.textContent = 'interactuar';
            });
        }
    });

    document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape') {
            stages.forEach(function (s) {
                s.classList.remove('active');
                var b = s.querySelector('[data-act="interact"]');
                if (b) b.textContent = 'interactuar';
            });
        }
    });

    /* Buscador */
    function norm(s) {
        return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function applyFilter() {
        var q = norm(search.value.trim());
        var shown = 0;
        cards.forEach(function (card) {
            var hit = !q || norm(card.dataset.name).indexOf(q) !== -1 || norm(card.querySelector('h3').textContent).indexOf(q) !== -1;
            card.classList.toggle('hidden', !hit);
            if (hit) shown++;
        });
        countEl.textContent = shown;
        emptyEl.hidden = shown !== 0;
    }

    search.addEventListener('input', applyFilter);

    /* Al azar */
    randomBtn.addEventListener('click', function () {
        var pool = cards.filter(function (c) { return !c.classList.contains('hidden'); });
        if (!pool.length) return;
        var card = pool[Math.floor(Math.random() * pool.length)];
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        var stage = card.querySelector('.stage');
        request(stage);
        stage.classList.add('active');
        deactivateAll(stage);
        var b = stage.querySelector('[data-act="interact"]');
        if (b) b.textContent = 'soltar mouse';
    });

    /* Posters que no existen todavía: no romper la grilla */
    document.querySelectorAll('.poster').forEach(function (img) {
        img.addEventListener('error', function () {
            img.style.display = 'none';
            img.parentNode.style.background = 'radial-gradient(circle at 50% 40%, #0b1620, #000 70%)';
        });
    });
})();
