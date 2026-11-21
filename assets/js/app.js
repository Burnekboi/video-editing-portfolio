/* ============================================================
   Portfolio interactions — gallery, filters, player modal
   ============================================================ */
(function () {
  'use strict';

  var state = {
    videos: [],
    filter: 'all',
    query: '',
    sort: 'order',
    visible: 24,
    current: null
  };

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function fmtTime(sec) {
    if (!sec || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function categoryLabel(cat) {
    return { series: 'Feature Episode', cino: 'Cino Short', scenes: 'Scene Clip' }[cat] || 'Video';
  }

  function videoSource(v) { return v.mediaUrl || v.rawUrl; }

  /* ---------- Rendering ---------- */
  function cardHTML(v, featured) {
    return '' +
      '<article class="card' + (featured ? ' featured' : '') + '" data-id="' + esc(v.id) + '" tabindex="0" role="button" aria-label="Play ' + esc(v.title) + '">' +
        '<div class="card-media">' +
          '<span class="badge">' + esc(featured ? 'Featured' : categoryLabel(v.category)) + '</span>' +
          '<img src="' + esc(v.poster) + '" alt="' + esc(v.title) + '" loading="lazy">' +
          '<span class="duration">' + fmtTime(v.duration) + '</span>' +
          '<span class="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-title">' + esc(v.title) + '</div>' +
          '<div class="card-meta"><span>' + esc(v.group) + '</span><span>' + esc(v.sizeMB) + ' MB</span></div>' +
        '</div>' +
      '</article>';
  }

  function renderFeatured() {
    var host = $('#featured-grid');
    if (!host) return;
    var picks = state.videos.filter(function (v) { return v.featured; }).slice(0, 5);
    host.innerHTML = picks.map(function (v) { return cardHTML(v, true); }).join('');
  }

  function filtered() {
    var q = state.query.toLowerCase();
    var list = state.videos.filter(function (v) {
      var catOK = state.filter === 'all' || v.category === state.filter;
      var qOK = !q || (v.title + ' ' + v.group + ' ' + categoryLabel(v.category)).toLowerCase().indexOf(q) !== -1;
      return catOK && qOK;
    });

    if (state.sort === 'title') {
      list.sort(function (a, b) { return a.title.localeCompare(b.title); });
    } else if (state.sort === 'duration') {
      list.sort(function (a, b) { return b.duration - a.duration; });
    } else if (state.sort === 'size') {
      list.sort(function (a, b) { return b.sizeMB - a.sizeMB; });
    }
    return list;
  }

  function renderGallery() {
    var host = $('#video-grid');
    if (!host) return;
    var list = filtered();
    var shown = list.slice(0, state.visible);
    host.innerHTML = shown.map(function (v) { return cardHTML(v, false); }).join('');

    var count = $('#result-count');
    if (count) count.textContent = 'Showing ' + shown.length + ' of ' + list.length + ' videos';

    var more = $('#load-more-wrap');
    if (more) more.style.display = shown.length < list.length ? 'flex' : 'none';

    if (!list.length) host.innerHTML = '<div class="empty">No videos match that search. Try a different keyword or filter.</div>';
  }

  function updateChipCounts() {
    var counts = { all: state.videos.length, series: 0, cino: 0, scenes: 0 };
    state.videos.forEach(function (v) { if (counts[v.category] != null) counts[v.category]++; });
    $$('.chip[data-filter]').forEach(function (chip) {
      var n = counts[chip.dataset.filter];
      var el = chip.querySelector('.count');
      if (el && n != null) el.textContent = n;
    });
  }

  /* ---------- Modal ---------- */
  function openVideo(id) {
    var v = state.videos.find(function (x) { return x.id === id; });
    if (!v) return;
    state.current = v;

    $('#modal-title').textContent = v.title;
    $('#modal-meta').textContent = [categoryLabel(v.category), v.group, fmtTime(v.duration), v.width + '×' + v.height, v.sizeMB + ' MB'].join('  ·  ');

    var player = $('#modal-video');
    player.poster = v.poster;
    player.src = videoSource(v);
    player.load();

    var newTab = $('#modal-newtab');
    if (newTab) newTab.href = videoSource(v);

    var note = $('#modal-note');
    if (note) note.textContent = 'Streamed from the portfolio media repository. First play may take a moment while the video loads.';

    $('#video-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeVideo() {
    var modal = $('#video-modal');
    if (!modal || !modal.classList.contains('open')) return;
    var player = $('#modal-video');
    player.pause();
    player.removeAttribute('src');
    player.load();
    modal.classList.remove('open');
    document.body.style.overflow = '';
    state.current = null;
  }

  function bindCardClicks(host) {
    if (!host) return;
    host.addEventListener('click', function (e) {
      var card = e.target.closest('.card');
      if (card) openVideo(card.dataset.id);
    });
    host.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var card = e.target.closest('.card');
      if (card) { e.preventDefault(); openVideo(card.dataset.id); }
    });
  }

  /* ---------- Static UI ---------- */
  function bindUI() {
    var nav = $('.nav');
    var toggle = $('#menu-toggle');
    var links = $('#nav-links');

    window.addEventListener('scroll', function () {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    if (toggle && links) {
      toggle.addEventListener('click', function () { links.classList.toggle('open'); });
      $$('a', links).forEach(function (a) { a.addEventListener('click', function () { links.classList.remove('open'); }); });
    }

    $$('.chip[data-filter]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        state.filter = chip.dataset.filter;
        state.visible = 24;
        $$('.chip[data-filter]').forEach(function (c) { c.classList.toggle('active', c === chip); });
        renderGallery();
      });
    });

    var search = $('#video-search');
    if (search) {
      var timer;
      search.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          state.query = search.value.trim();
          state.visible = 24;
          renderGallery();
        }, 160);
      });
    }

    var sort = $('#video-sort');
    if (sort) sort.addEventListener('change', function () { state.sort = sort.value; renderGallery(); });

    var more = $('#load-more');
    if (more) more.addEventListener('click', function () { state.visible += 24; renderGallery(); });

    $('#modal-close').addEventListener('click', closeVideo);
    $('#video-modal').addEventListener('click', function (e) { if (e.target.id === 'video-modal') closeVideo(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeVideo(); });

    var player = $('#modal-video');
    if (player) {
      player.addEventListener('error', function () {
        if (state.current && player.src !== state.current.rawUrl) {
          player.src = state.current.rawUrl;
          player.load();
        }
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    $$('.reveal').forEach(function (el) { observer.observe(el); });

    // Active nav link on scroll
    var sections = $$('main section[id]');
    window.addEventListener('scroll', function () {
      var y = window.scrollY + 140;
      var active = '';
      sections.forEach(function (s) { if (s.offsetTop <= y) active = s.id; });
      $$('#nav-links a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + active); });
    }, { passive: true });
  }

  /* ---------- Boot ---------- */
  fetch('assets/data/videos.json')
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (data) {
      state.videos = data.videos || [];
      renderFeatured();
      renderGallery();
      updateChipCounts();
      bindCardClicks($('#featured-grid'));
      bindCardClicks($('#video-grid'));

      // Fill stats from real data when elements opt in
      var map = {
        statVideos: data.stats.videoCount,
        statEpisodes: data.stats.episodes,
        statMinutes: data.stats.totalMinutes,
        statGB: data.stats.totalGB
      };
      Object.keys(map).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.textContent = map[id];
      });
    })
    .catch(function (err) {
      console.error('Could not load video catalogue:', err);
      var host = $('#video-grid');
      if (host) host.innerHTML = '<div class="empty">The video catalogue could not be loaded. Please refresh the page.</div>';
    });

  bindUI();
})();
