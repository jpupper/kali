/* Archivo de obras de Kali — HEN / fxhash / Salviado */
(function () {
    'use strict';

    var ALFABETO = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
    var grid = document.getElementById('grid');
    var modal = document.getElementById('modal');
    var frame = document.getElementById('frame');
    var still = document.getElementById('still');
    var obras = [];
    var filtro = 'TODO';
    var actual = null;

    function nuevaSemilla() {
        var s = 'oo';
        for (var i = 0; i < 49; i++) s += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
        return s;
    }

    function urlObra(o, semilla) {
        if (!o.codigo) return null;
        var u = o.codigo;
        if (o.semilla || semilla) {
            u += '?fxhash=' + encodeURIComponent(semilla || o.semilla) + '&fxiteration=' + Math.floor(Math.random() * 100);
        }
        return u;
    }

    function esc(t) {
        return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    function badgeGrupo(g) {
        if (g === 'HEN') return '<span class="badge hen">HEN</span>';
        if (g === 'SALVIADO') return '<span class="badge sal">Salviado</span>';
        return '<span class="badge fx">fxhash Kali</span>';
    }

    function tarjeta(o) {
        var img = o.thumb
            ? '<img src="' + o.thumb + '" alt="' + esc(o.nombre) + '" loading="lazy">'
            : '<div class="sin-img">' + esc(o.nombre) + '</div>';
        var ed = o.ediciones > 1 ? o.ediciones + ' ed.' : '1 ed.';
        return '<article class="obra" data-id="' + o.id + '" data-grupo="' + esc(o.grupo) + '" data-p5="' + (o.p5 ? '1' : '0') + '" data-codigo="' + (o.codigo ? '1' : '0') + '" data-nombre="' + esc((o.nombre + ' ' + (o.descripcion || '')).toLowerCase()) + '">' +
            '<div class="thumb">' + img +
                '<div class="badges">' + badgeGrupo(o.grupo) + (o.codigo ? '<span class="badge code">código</span>' : '') + (o.p5 ? '<span class="badge">p5</span>' : '') + '</div>' +
                '<div class="play">' + (o.codigo ? '▶' : '↗') + '</div>' +
            '</div>' +
            '<div class="info">' +
                '<h3>' + esc(o.nombre) + '</h3>' +
                '<p>' + esc(o.descripcion || 'Sin descripción registrada.') + '</p>' +
                '<div class="metaline"><span>' + esc(o.plataforma) + '</span><span>' + ed + '</span><span>' + (o.fecha || '') + '</span></div>' +
            '</div></article>';
    }

    function pintar() {
        grid.innerHTML = obras.map(tarjeta).join('');
        aplicar();
    }

    function aplicar() {
        var q = (document.getElementById('search').value || '').toLowerCase().trim();
        var n = 0;
        [].forEach.call(grid.children, function (el) {
            var ok = true;
            if (filtro === 'P5') ok = el.dataset.p5 === '1';
            else if (filtro === 'CODIGO') ok = el.dataset.codigo === '1';
            else if (filtro !== 'TODO') ok = el.dataset.grupo === filtro;
            if (ok && q) ok = el.dataset.nombre.indexOf(q) !== -1;
            el.classList.toggle('hidden', !ok);
            if (ok) n++;
        });
        document.getElementById('count').textContent = n;
        document.getElementById('vacio').hidden = n !== 0;
    }

    function cerrar() {
        modal.hidden = true;
        frame.src = 'about:blank';
        actual = null;
    }

    function abrir(id) {
        var o = obras.find(function (x) { return x.id === id; });
        if (!o) return;
        actual = o;
        document.getElementById('mtitulo').textContent = o.nombre;
        document.getElementById('mbadge').outerHTML = '<span class="badge ' + (o.grupo === 'HEN' ? 'hen' : o.grupo === 'SALVIADO' ? 'sal' : 'fx') + '" id="mbadge">' + (o.grupo === 'HEN' ? 'HEN' : o.grupo === 'SALVIADO' ? 'Salviado · ' + o.plataforma : 'fxhash Kali · ' + o.plataforma) + '</span>';
        document.getElementById('mdesc').textContent = o.descripcion || 'Sin descripción registrada en la cadena.';
        var zip = document.getElementById('mzip');
        if (o.zip) { zip.href = o.zip; zip.setAttribute('download', o.id + '.zip'); zip.removeAttribute('disabled'); }
        else { zip.removeAttribute('href'); zip.setAttribute('disabled', ''); }
        var obj = document.getElementById('mobjkt');
        if (o.objkt) obj.href = o.objkt; else obj.setAttribute('disabled', '');

        var hayCodigo = !!o.codigo;
        var video = document.getElementById('video');
        video.hidden = true; video.removeAttribute('src');
        frame.hidden = true; still.hidden = true;
        var tieneSemilla = !!o.semilla;
        document.getElementById('mseed').disabled = !(hayCodigo && tieneSemilla);
        document.getElementById('mseed').style.display = tieneSemilla ? '' : 'none';
        document.getElementById('morig').disabled = !(hayCodigo && tieneSemilla);
        document.getElementById('morig').style.display = tieneSemilla ? '' : 'none';

        if (o.tipo === 'video') document.getElementById('mhint').textContent = 'Video original de la obra (HEN).';
        if (o.tipo === 'img') document.getElementById('mhint').textContent = 'Imagen original de la obra (HEN).';
        if (o.tipo === 'texto') document.getElementById('mhint').textContent = 'Obra de texto: el original completo está en objkt.';
        if (!hayCodigo && !o.media) document.getElementById('mhint').textContent = 'Sin código descargable (alojado en onchfs de fxhash). Se muestra la imagen registrada en la cadena; el original se abre en objkt.';
        if (hayCodigo) document.getElementById('mhint').textContent = hayCodigo
            ? (tieneSemilla
                ? 'Sistema generativo corriendo con el código original. «Nueva semilla» sortea otro resultado del mismo sistema; las ediciones acuñadas no se reindexan.'
                : 'Obra única (HEN): corre con su código original.')
            : 'Sin código descargable (alojado en onchfs de fxhash). Se muestra la imagen registrada en la cadena; el original se abre en objkt.';

        if (hayCodigo && o.semilla) {
            frame.hidden = false; frame.src = urlObra(o, o.semilla);
        } else if (hayCodigo) {
            frame.hidden = false; frame.src = o.codigo;
        } else if (o.tipo === 'video' && o.media) {
            video.hidden = false; video.src = o.media; video.play().catch(function () {});
        } else {
            frame.src = 'about:blank';
            still.hidden = false; still.src = o.thumb || o.media || '';
        }
        modal.hidden = false;
    }

    document.getElementById('search').addEventListener('input', aplicar);
    document.getElementById('filters').addEventListener('click', function (ev) {
        var b = ev.target.closest('.chip');
        if (!b) return;
        filtro = b.dataset.f;
        [].forEach.call(document.querySelectorAll('.chip'), function (c) { c.classList.toggle('is-on', c === b); });
        aplicar();
    });
    grid.addEventListener('click', function (ev) {
        var c = ev.target.closest('.obra');
        if (c) abrir(c.dataset.id);
    });
    document.getElementById('cerrar').addEventListener('click', cerrar);
    modal.addEventListener('click', function (ev) { if (ev.target === modal) cerrar(); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !modal.hidden) cerrar(); });
    document.getElementById('mseed').addEventListener('click', function () {
        if (actual && actual.codigo && actual.semilla) frame.src = urlObra(actual, nuevaSemilla());
    });
    document.getElementById('morig').addEventListener('click', function () {
        if (actual && actual.codigo && actual.semilla) frame.src = urlObra(actual, actual.semilla);
    });

    fetch('data/proyectos.json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            obras = data;
            var ed = data.reduce(function (a, o) { return a + (o.ediciones || 0); }, 0);
            var conCodigo = data.filter(function (o) { return o.codigo; }).length;
            var hen = data.filter(function (o) { return o.grupo === 'HEN'; }).length;
            var sal = data.filter(function (o) { return o.grupo === 'SALVIADO'; }).length;
            document.getElementById('stats').innerHTML =
                '<span><strong>' + data.length + '</strong> obras</span>' +
                '<span><strong>' + ed + '</strong> ediciones</span>' +
                '<span><strong>' + conCodigo + '</strong> con código</span>' +
                '<span><strong>' + hen + '</strong> HEN</span>' +
                '<span><strong>' + sal + '</strong> Salviado</span>';
            pintar();
        })
        .catch(function (e) {
            grid.innerHTML = '<p class="vacio">No se pudo cargar el archivo de obras.</p>';
            console.error(e);
        });
})();
