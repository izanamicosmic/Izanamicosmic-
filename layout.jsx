function AppShell({ children, isLoggedIn, user, navigateTo, onLogout, currentPage,
                    activeLang, langs, switchLang, dir, schema }) {
  const t = {
    root: "min-h-screen bg-background text-text pb-16 md:pb-0",
    header: "fixed inset-x-0 top-0 z-50 transition-all duration-300",
    headerTop: "bg-gradient-to-b from-black/80 to-transparent",
    headerSolid: "yb-solid",
    bar: "mx-auto flex h-16 md:h-20 w-full max-w-[1400px] items-center justify-between gap-4 px-4 md:px-8",
    brand: "flex items-center gap-2.5 shrink-0 rounded-md focus-visible:outline-none",
    wordmark: "font-heading text-[28px] md:text-[34px] leading-none tracking-[0.1em] text-text whitespace-nowrap",
    nav: "hidden md:flex items-center gap-9",
    link: "relative py-2 text-[13px] font-bold uppercase tracking-[0.16em] transition-colors duration-200",
    linkOn: "text-text",
    linkOff: "text-text-secondary hover:text-text",
    underline: "yb-glow absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-accent",
    actions: "flex items-center gap-1.5 md:gap-3",
    iconBtn: "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface-3 hover:text-text",
    badge: "absolute -top-0.5 -end-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-accent-text",
    searchWrapOn: "w-56 opacity-100",
    searchWrapOff: "w-0 opacity-0 pointer-events-none",
    searchWrap: "hidden md:block overflow-hidden transition-all duration-300",
    searchInput: "h-10 w-full rounded-full border border-border bg-surface-2 px-4 text-sm text-text placeholder:text-text-muted focus:border-border-focus focus:outline-none",
    vip: "hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full border border-warning px-4 text-xs font-extrabold uppercase tracking-[0.18em] text-warning transition hover:bg-warning hover:text-secondary-light",
    loginBtn: "hidden md:inline-flex h-10 items-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-accent-text transition hover:bg-accent-hover",
    avatar: "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-accent bg-accent text-sm font-extrabold text-accent-text",
    dropdown: "absolute end-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-shadow-xl",
    dropItem: "flex w-full min-h-11 items-center gap-3 px-5 text-sm font-medium text-text-secondary transition hover:bg-surface-3 hover:text-text",
    burger: "md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full text-text hover:bg-surface-3",
    backdrop: "absolute inset-0 bg-black/75",
    panel: "absolute inset-y-0 end-0 flex w-[88%] max-w-sm flex-col overflow-y-auto border-s border-border bg-surface-2",
    drawerLink: "flex min-h-14 w-full items-center justify-between border-b border-border px-6 font-heading text-3xl tracking-[0.08em] transition",
    drawerOn: "text-accent",
    drawerOff: "text-text hover:text-accent",
    eyebrow: "text-[11px] font-bold uppercase tracking-[0.24em] text-accent",
    chip: "inline-flex min-h-9 items-center rounded-full border border-border px-4 text-xs font-semibold text-text-secondary transition hover:border-accent hover:text-accent",
    tabbar: "yb-solid fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 md:hidden",
    tab: "relative flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition",
    tabOn: "text-accent",
    tabOff: "text-text-muted hover:text-text",
    main: "min-h-screen",
    footer: "relative overflow-hidden bg-secondary-light",
    footTitle: "mb-5 text-[11px] font-bold uppercase tracking-[0.24em] text-accent",
    footLink: "text-sm text-text-secondary transition hover:text-text",
    ticker: "overflow-hidden border-y border-border bg-surface-2 py-3",
    tickerItem: "flex items-center gap-8 pe-8 font-heading text-2xl tracking-[0.22em] text-text-muted whitespace-nowrap"
  };

  const pages = (schema && schema.pages) || [];
  const home = pages.find(p => p.home) || pages[0];
  const homeName = home ? home.name : "Home";
  const isHome = currentPage === homeName;
  const loginPage = pages.find(p => p.type === "login" || p.name === "Login");
  const hiddenNames = ["Login", "Register", "AdminLogin", "ForgotPassword", "ResetPassword"];
  const navPages = pages.filter(p => p.type !== "login" && p.type !== "register" && hiddenNames.indexOf(p.name) < 0 && (isLoggedIn || !p.auth));
  const genres = ["Aksi", "Drama", "Horor", "Komedi", "Romantis", "Thriller", "Animasi", "Fantasi", "Sci-Fi", "Korea"];
  const ticker = ["Streaming", "Download", "Film", "Series", "Member VIP", "Bookmark", "Terakhir Dilihat"];

  const title = (schema && schema.title) || "";
  const m = title.match(/^(.*?)\s*(666)$/);
  const baseName = m ? m[1] : title;
  const tailName = m ? m[2] : "";

  const bmRaw = useAppState("bookmarks", []);
  const bmVal = Array.isArray(bmRaw) && bmRaw.length === 2 && typeof bmRaw[1] === "function" ? bmRaw[0] : bmRaw;
  const bmCount = Array.isArray(bmVal) ? bmVal.length : 0;

  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mSearch, setMSearch] = useState(false);
  const [q, setQ] = useState("");
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (menu || mSearch) ? "hidden" : "";
    const onKey = e => { if (e.key === "Escape") { setMenu(false); setMSearch(false); setUserMenu(false); setSearchOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [menu, mSearch]);

  const closeAll = () => { setMenu(false); setMSearch(false); setUserMenu(false); };
  const go = (name, query) => { closeAll(); navigateTo(name, undefined, undefined, query); };
  const goVip = () => {
    closeAll();
    if (!isHome) navigateTo(homeName);
    setTimeout(() => { const el = document.getElementById("vip"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, isHome ? 0 : 600);
  };
  const submitSearch = e => {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    closeAll();
    setSearchOpen(false);
    navigateTo(homeName, undefined, undefined, { q: v });
  };

  const isVip = user && user.role === 2;
  const solid = scrolled || !isHome || menu;
  const initial = user && user.name ? user.name.charAt(0).toUpperCase() : "?";
  const ChevronEnd = dir === "rtl" ? ChevronLeft : ChevronRight;

  const Brand = (
    <button type="button" onClick={() => go(homeName)} className={t.brand} aria-label={title}>
      {schema && schema.icon ? <img src={schema.icon} alt={title} className="h-8 w-auto" /> : null}
      <span className={t.wordmark}>
        {baseName}{tailName ? <span className="yb-neon ms-2">{tailName}</span> : null}
      </span>
    </button>
  );

  const Avatar = user ? (
    user.avatar_url ? <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" /> : <span>{initial}</span>
  ) : null;

  const LangSwitch = langs && langs.length > 1 ? (
    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
      <Globe size={14} className="text-text-muted" />
      {langs.map(l => (
        <button key={l} type="button" onClick={() => switchLang(l)}
          className={l === activeLang ? "rounded-full bg-accent px-2.5 py-1 text-accent-text" : "rounded-full px-2.5 py-1 text-text-secondary hover:text-text"}>
          {l}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <div dir={dir} className={t.root}>
      <style>{`
        .yb-solid{background:color-mix(in srgb,var(--background) 84%,transparent);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.07)}
        .yb-neon{color:var(--accent);text-shadow:0 0 6px var(--accent),0 0 18px var(--accent),0 0 38px var(--accent-hover)}
        .yb-glow{box-shadow:0 0 12px 1px var(--accent)}
        @keyframes yb-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .yb-marquee{display:flex;width:max-content;animation:yb-marquee 36s linear infinite}
        [dir=rtl] .yb-marquee{animation-direction:reverse}
        @media (prefers-reduced-motion:reduce){.yb-marquee{animation:none}}
      `}</style>

      <header className={t.header + " " + (solid ? t.headerSolid : t.headerTop)}>
        <div className={t.bar}>
          {Brand}

          <nav className={t.nav} aria-label="Navigasi utama">
            {navPages.map(p => (
              <button key={p.name} type="button" onClick={() => go(p.name)}
                className={t.link + " " + (currentPage === p.name ? t.linkOn : t.linkOff)}>
                {p.title}
                {currentPage === p.name ? <span className={t.underline} /> : null}
              </button>
            ))}
          </nav>

          <div className={t.actions}>
            <form onSubmit={submitSearch} className={t.searchWrap + " " + (searchOpen ? t.searchWrapOn : t.searchWrapOff)}>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari judul film atau series…" className={t.searchInput} aria-label="Cari" />
            </form>
            <button type="button" className={t.iconBtn + " hidden md:inline-flex"} aria-label="Cari"
              onClick={() => setSearchOpen(!searchOpen)}>
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            <button type="button" className={t.iconBtn + " hidden md:inline-flex"} aria-label="Bookmark"
              onClick={() => go(homeName, { tab: "bookmark" })}>
              <Bookmark size={20} />
              {bmCount > 0 ? <span className={t.badge}>{bmCount}</span> : null}
            </button>

            <button type="button" onClick={goVip} className={t.vip}>
              <Crown size={14} /> {isVip ? "VIP Aktif" : "VIP"}
            </button>

            {isLoggedIn && user ? (
              <div className="relative hidden md:block">
                <button type="button" className={t.avatar} aria-label="Menu akun" aria-expanded={userMenu}
                  onClick={() => setUserMenu(!userMenu)}>{Avatar}</button>
                {userMenu ? (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                    <div className={t.dropdown + " z-20"}>
                      <div className="border-b border-border px-5 py-4">
                        <p className="truncate font-bold text-text">{user.name}</p>
                        <p className="truncate text-xs text-text-muted">{user.email}</p>
                        <span className={isVip
                          ? "mt-3 inline-flex items-center gap-1 rounded-full border border-warning px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-warning"
                          : "mt-3 inline-flex items-center gap-1 rounded-full border border-border px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-text-secondary"}>
                          {isVip ? <Crown size={11} /> : <User size={11} />}{isVip ? "Member VIP" : "Pengguna"}
                        </span>
                      </div>
                      <button type="button" className={t.dropItem} onClick={() => go(homeName, { tab: "bookmark" })}>
                        <Bookmark size={16} /> Bookmark saya {bmCount > 0 ? "(" + bmCount + ")" : ""}
                      </button>
                      {!isVip ? (
                        <button type="button" className={t.dropItem + " text-warning"} onClick={goVip}>
                          <Crown size={16} /> Gabung member VIP
                        </button>
                      ) : null}
                      <button type="button" className={t.dropItem} onClick={() => { closeAll(); onLogout(); }}>
                        <LogOut size={16} /> Keluar
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            ) : loginPage ? (
              <button type="button" className={t.loginBtn} onClick={() => go(loginPage.name)}>
                <LogIn size={16} /> Masuk
              </button>
            ) : null}

            <button type="button" className={t.iconBtn + " md:hidden"} aria-label="Cari" onClick={() => setMSearch(true)}>
              <Search size={20} />
            </button>
            <button type="button" className={t.burger} aria-label={menu ? "Tutup menu" : "Buka menu"} aria-expanded={menu}
              onClick={() => setMenu(!menu)}>
              {menu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mSearch ? (
          <motion.div key="msearch" className="fixed inset-0 z-[65] md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={t.backdrop} onClick={() => setMSearch(false)} />
            <motion.form onSubmit={submitSearch} className="relative bg-surface-2 p-4 pt-5 border-b border-border"
              initial={{ y: -40 }} animate={{ y: 0 }} exit={{ y: -40 }}>
              <p className={t.eyebrow + " mb-3"}>Cari tontonan</p>
              <div className="flex items-center gap-2">
                <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Judul film atau series…" className={t.searchInput + " h-12"} />
                <button type="submit" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-text" aria-label="Cari">
                  <Search size={20} />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {genres.slice(0, 6).map(g => (
                  <button key={g} type="button" className={t.chip} onClick={() => go(homeName, { genre: g })}>{g}</button>
                ))}
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {menu ? (
          <motion.div key="drawer" className="fixed inset-0 z-[70] md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className={t.backdrop} onClick={() => setMenu(false)} />
            <motion.aside className={t.panel}
              initial={{ x: dir === "rtl" ? "-100%" : "100%" }} animate={{ x: 0 }} exit={{ x: dir === "rtl" ? "-100%" : "100%" }}
              transition={{ type: "tween", duration: 0.28 }}>
              <div className="flex h-16 shrink-0 items-center justify-between px-6">
                <span className={t.eyebrow}>Menu</span>
                <button type="button" onClick={() => setMenu(false)} className={t.iconBtn} aria-label="Tutup menu"><X size={22} /></button>
              </div>

              <div className="px-6 pb-6">
                {isLoggedIn && user ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-3 p-4">
                    <span className={t.avatar + " h-12 w-12 shrink-0"}>{Avatar}</span>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-text">{user.name}</p>
                      <p className={isVip ? "text-xs font-bold uppercase tracking-wider text-warning" : "text-xs text-text-muted"}>
                        {isVip ? "Member VIP" : "Pengguna"}
                      </p>
                    </div>
                  </div>
                ) : loginPage ? (
                  <button type="button" onClick={() => go(loginPage.name)}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-accent-text transition hover:bg-accent-hover">
                    <LogIn size={18} /> Masuk / Daftar
                  </button>
                ) : null}
              </div>

              <nav className="border-t border-border">
                {navPages.map(p => (
                  <button key={p.name} type="button" onClick={() => go(p.name)}
                    className={t.drawerLink + " " + (currentPage === p.name ? t.drawerOn : t.drawerOff)}>
                    <span>{p.title}</span><ChevronEnd size={20} />
                  </button>
                ))}
                <button type="button" onClick={() => go(homeName, { tab: "bookmark" })} className={t.drawerLink + " " + t.drawerOff}>
                  <span>Bookmark{bmCount > 0 ? " (" + bmCount + ")" : ""}</span><Bookmark size={20} />
                </button>
              </nav>

              <div className="px-6 py-6">
                <p className={t.eyebrow + " mb-4"}>Genre</p>
                <div className="flex flex-wrap gap-2">
                  {genres.map(g => (
                    <button key={g} type="button" className={t.chip} onClick={() => go(homeName, { genre: g })}>{g}</button>
                  ))}
                </div>
              </div>

              <div className="mt-auto space-y-4 border-t border-border p-6">
                <button type="button" onClick={goVip}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-warning text-sm font-extrabold uppercase tracking-[0.18em] text-warning transition hover:bg-warning hover:text-secondary-light">
                  <Crown size={16} /> {isVip ? "VIP Aktif" : "Gabung Member VIP"}
                </button>
                {LangSwitch}
                {isLoggedIn ? (
                  <button type="button" onClick={() => { closeAll(); onLogout(); }}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-text-secondary hover:text-text">
                    <LogOut size={16} /> Keluar
                  </button>
                ) : null}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className={t.main + " " + (isHome ? "" : "pt-16 md:pt-20")}>{children}</main>

      <footer className={t.footer}>
        <div className={t.ticker} aria-hidden="true">
          <div className="yb-marquee">
            {[0, 1].map(k => (
              <div key={k} className={t.tickerItem}>
                {ticker.map(w => (
                  <span key={k + w} className="flex items-center gap-8">
                    <span className="uppercase">{w}</span>
                    <Play size={14} className="text-accent" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <img src="https://cdn.yeshbecdn.com/yeshbe/app/743/stock/b70f179e4ec851a337c014e1e4a96c28e2f7d702.jpg" alt=""
          loading="lazy" className="absolute inset-0 -z-0 h-full w-full object-cover opacity-[0.12]" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-light via-transparent to-secondary-light" />

        <div className="relative mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="font-heading text-5xl md:text-6xl leading-none tracking-[0.08em] text-text">
                {baseName}{tailName ? <span className="yb-neon ms-3">{tailName}</span> : null}
              </div>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-secondary">
                Nonton dan download film serta series favoritmu dalam satu tempat. Simpan bookmark, lanjutkan tontonan terakhir, dan buka koleksi eksklusif lewat member VIP.
              </p>
              <button type="button" onClick={goVip}
                className="mt-7 inline-flex h-11 items-center gap-2 rounded-full border border-warning px-6 text-xs font-extrabold uppercase tracking-[0.2em] text-warning transition hover:bg-warning hover:text-secondary-light">
                <Crown size={15} /> Gabung member VIP
              </button>
            </div>

            <div className="md:col-span-3">
              <p className={t.footTitle}>Jelajahi</p>
              <ul className="space-y-3">
                {navPages.map(p => (
                  <li key={p.name}>
                    <button type="button" onClick={() => go(p.name)} className={t.footLink}>{p.title}</button>
                  </li>
                ))}
                {!isLoggedIn && loginPage ? (
                  <li><button type="button" onClick={() => go(loginPage.name)} className={t.footLink}>{loginPage.title}</button></li>
                ) : null}
              </ul>
            </div>

            <div className="md:col-span-4">
              <p className={t.footTitle}>Genre</p>
              <div className="flex flex-wrap gap-2">
                {genres.map(g => (
                  <button key={g} type="button" className={t.chip} onClick={() => go(homeName, { genre: g })}>{g}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-border pt-7 text-xs text-text-muted md:flex-row md:items-start md:justify-between">
            <p className="max-w-xl leading-relaxed">
              Disclaimer: seluruh film dan series adalah milik pemegang hak cipta masing-masing. Situs ini hanya menyediakan tautan dan tidak menyimpan file apa pun di server.
            </p>
            <div className="flex items-center gap-5">
              {LangSwitch}
              <p className="whitespace-nowrap">© {new Date().getFullYear()} {title}</p>
            </div>
          </div>
        </div>
      </footer>

      <nav className={t.tabbar} aria-label="Navigasi bawah">
        <button type="button" onClick={() => go(homeName)} className={t.tab + " " + (isHome ? t.tabOn : t.tabOff)}>
          <Home size={20} /> Beranda
          {isHome ? <span className="yb-glow absolute top-0 h-0.5 w-8 rounded-full bg-accent" /> : null}
        </button>
        <button type="button" onClick={() => { setMenu(false); setMSearch(true); }} className={t.tab + " " + t.tabOff}>
          <Search size={20} /> Cari
        </button>
        <button type="button" onClick={() => go(homeName, { tab: "bookmark" })} className={t.tab + " " + t.tabOff}>
          <span className="relative">
            <Bookmark size={20} />
            {bmCount > 0 ? <span className={t.badge}>{bmCount}</span> : null}
          </span>
          Bookmark
        </button>
        <button type="button"
          onClick={() => { if (isLoggedIn || !loginPage) setMenu(true); else go(loginPage.name); }}
          className={t.tab + " " + (currentPage === (loginPage && loginPage.name) ? t.tabOn : t.tabOff)}>
          {isLoggedIn && user ? <span className={t.avatar + " h-5 w-5 text-[10px] border"}>{Avatar}</span> : <User size={20} />}
          Akun
        </button>
      </nav>
    </div>
  );
}
