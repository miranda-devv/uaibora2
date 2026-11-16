"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EventArtwork } from "./event-artwork";
import { Reviews } from "./reviews";
import { priceLabel, interests, eventCallout, isHappeningToday } from "@/lib/catalog-info";
import { Icon, type IconName } from "./icon";
import { Brand, OfficialMascot } from "./brand";
import { DiscoveryCard } from "./discovery-card";
import { BhMap } from "./bh-map";
import { Modal } from "./modal";
import { CatalogForm } from "./catalog-form";
import { MyEntries } from "./my-entries";
import { AccountForm } from "./account-form";
import { SuggestionForm } from "./suggestion-form";
import { AdminPanel } from "./admin-panel";
import { useCatalog } from "@/hooks/use-catalog";
import { useCommunity } from "@/hooks/use-community";
import { matchesSearch, mapsUrl, suggestionItem } from "@/lib/discovery";
import { type DiscoveryItem } from "@/data/demo";

type Filter = "Todos" | "Eventos" | "Lugares" | "Sugestões" | "Favoritos";
type Panel = "account" | "suggest" | "admin" | "place" | "event" | "entries" | null;
const tabs: [Filter, IconName][] = [["Todos", "grid"], ["Eventos", "calendar"], ["Lugares", "pin"], ["Sugestões", "bulb"]];

function SectionHeading({title, subtitle, icon, action, onAction}: {
  title: string; subtitle: string; icon: IconName; action?: string; onAction?: () => void;
}) {
  return <div className="section-heading"><div>
    <h2><Icon name={icon}/>{title}</h2><p className="section-note">{subtitle}</p>
  </div>{action && <button className="text-link" onClick={onAction}>{action}<Icon name="arrow" size={16}/></button>}</div>;
}

export default function DiscoveryHome({view="home"}:{view?:"home"|"events"|"places"|"map"}) {
  const router=useRouter();
  const [fee,setFee]=useState("all"),[audience,setAudience]=useState(""),[when,setWhen]=useState("all"),[sort,setSort]=useState("popular");
  const [counts,setCounts]=useState<Record<string,number>>({});
  const community = useCommunity();
  const catalog = useCatalog();
  const events = catalog.events;
  const places = catalog.places;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(view==="events"?"Eventos":view==="places"?"Lugares":"Todos");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [details, setDetails] = useState<DiscoveryItem | null>(null);
  const [toast, setToast] = useState("");
  const [accountError, setAccountError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const search = useRef<HTMLInputElement>(null);
  const userName = typeof community.user?.user_metadata.display_name === "string"
    ? community.user.user_metadata.display_name : typeof community.user?.user_metadata.full_name === "string" ? community.user.user_metadata.full_name : "Ô, de casa!";

  useEffect(() => {
    const url = new URL(window.location.href);
    const auth = url.searchParams.get("auth");
    if (!auth) return;
    if (auth === "recovery") { community.setRecovery(true); setPanel("account"); }
    else setToast(auth === "error" ? "O link de acesso expirou ou não é válido. Solicite um novo." : "E-mail confirmado. Bem-vindo ao Uai Bora!");
    url.searchParams.delete("auth");
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
  }, [community.setRecovery]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 6000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!mobileMenu) return;
    function close(event: KeyboardEvent) { if (event.key === "Escape") setMobileMenu(false); }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [mobileMenu]);

  useEffect(()=>{if(!community.loadingUser&&!community.user&&view==='home'&&!sessionStorage.getItem('uaibora-visitor')&&!new URLSearchParams(location.search).has('auth'))router.replace('/entrar');},[community.loadingUser,community.user,view,router]);
  useEffect(()=>{if(community.client)community.client.rpc('uaibora_counts').then(({data})=>{if(data)setCounts(data.favorites||{});});},[community.client,community.saved]);
  useEffect(()=>{const id=new URLSearchParams(window.location.search).get('item');if(id){const item=[...events,...places].find(i=>i.id===id);if(item)setDetails(item);}},[events,places]);
  const preferred: string[]=Array.isArray(community.user?.user_metadata.interests)?community.user.user_metadata.interests:[];
  const compare=(a:DiscoveryItem,b:DiscoveryItem)=>{if(sort==='date')return (a.startsAt||'').localeCompare(b.startsAt||'');const popularity=(counts[b.id]||0)-(counts[a.id]||0);if(popularity)return popularity;return (b.info?.tags?.filter(t=>preferred.includes(t)).length||0)-(a.info?.tags?.filter(t=>preferred.includes(t)).length||0);};
  const communityItems = community.suggestions.map(suggestionItem);
  const visible = (item: DiscoveryItem) => matchesSearch(item, query) && (fee==="all"||item.info?.price===fee) && (!audience||item.info?.tags?.includes(audience)) && (item.kind!=="event" || (!item.isDemo && (!item.endsAt || new Date(item.endsAt).getTime()>=Date.now()) && (when!=="today" || (item.startsAt && new Date(item.startsAt).toLocaleDateString("pt-BR",{timeZone:"America/Sao_Paulo"})===new Date().toLocaleDateString("pt-BR",{timeZone:"America/Sao_Paulo"}))))) && (filter !== "Favoritos" || community.saved.includes(item.id));
  const eventItems = events.filter(visible).map(i=>({...i,favoriteCount:counts[i.id]||0})).sort(compare);
  const todayEvents=eventItems.filter(i=>isHappeningToday(i.startsAt,i.endsAt,i.info)).sort((a,b)=>(counts[b.id]||0)-(counts[a.id]||0));
  const spotlight=todayEvents[0]||eventItems[0];
  const placeItems = places.filter(visible).sort(compare);
  const suggestionItems = communityItems.filter(visible);
  const showEvents = ["home","events"].includes(view) && ["Todos", "Eventos", "Favoritos"].includes(filter);
  const showPlaces = ["home","places"].includes(view) && ["Todos", "Lugares", "Favoritos"].includes(filter);
  const showSuggestions = view==="home" && ["Todos", "Sugestões", "Favoritos"].includes(filter);
  const resultCount = (showEvents ? eventItems.length : 0) + (showPlaces ? placeItems.length : 0) + (showSuggestions ? suggestionItems.length : 0);
  const showMap = view === "map";

  function goTo(id: string) {
    if(id==="mapa"){router.push("/mapa");return;}
    if(view!=="home"){router.push("/");return;}
    setMobileMenu(false); setFilter("Todos"); setQuery("");
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({behavior: "smooth"}));
  }
  function chooseFilter(next: Filter) { if(next==="Eventos"){router.push("/eventos");return;} if(next==="Lugares"){router.push("/lugares");return;}setFilter(next); setMobileMenu(false); }
  function openPanel(next: Panel) { if(next==="admin"){router.push("/admin");return;}if(next==="account"&&community.user){router.push("/perfil");return;} setDetails(null); setPanel(next); setMobileMenu(false); setAccountError(""); }
  async function save(item: DiscoveryItem) {
    if (!community.user) { openPanel("account"); return; }
    try {
      const alreadySaved = community.saved.includes(item.id);
      const error = await community.toggleFavorite(item.id);
      setToast(error || (alreadySaved ? "Removido dos seus favoritos." : "Salvo na sua conta. Bora depois?"));
    } catch { setToast("Não conseguimos salvar agora. Tente novamente."); }
  }
  function cards(items: DiscoveryItem[], isEvent = false, isCommunity = false) {
    return <div className={view === "home" ? "card-rail" : items.length === 2 ? "card-grid two-columns" : "card-grid"} id={isEvent?"event-rail":isCommunity?"community-rail":"place-rail"}>
      {items.map(item => <DiscoveryCard key={item.id} item={item} isEvent={isEvent} community={isCommunity}
        saved={community.saved.includes(item.id)} onSave={() => void save(item)} onDetails={() => setDetails(item)}/>)}
    </div>;
  }
  function accountComplete() {
    community.setRecovery(false); setPanel(null); setToast("Tudo certo com sua conta. Bora descobrir BH!");
  }
  async function signOut() {
    if (!community.client) return;
    const {error} = await community.client.auth.signOut();
    if (error) setAccountError("Não foi possível sair. Tente novamente.");
    else { setPanel(null); setFilter("Todos"); setToast("Você saiu da sua conta."); }
  }
  const selectedSuggestion = details ? community.suggestions.find(row => "community:" + row.id === details.id) : null;

  return <div className="app-shell drawer-layout">
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    {mobileMenu && <button className="mobile-backdrop" aria-label="Fechar menu" onClick={() => setMobileMenu(false)}/>}
    <aside inert={!mobileMenu} className={mobileMenu ? "sidebar mobile-open" : "sidebar"}>
      <Brand/>
      <nav aria-label="Menu principal">
        <button className={filter === "Todos" ? "nav-item active" : "nav-item"} onClick={() => goTo("inicio")}><Icon name="home"/>Início</button>
        <button className="nav-item" onClick={() => goTo("mapa")}><Icon name="pin"/>Mapa</button>
        <button className={filter === "Eventos" ? "nav-item active" : "nav-item"} onClick={() => { chooseFilter("Eventos"); requestAnimationFrame(() => document.getElementById("eventos")?.scrollIntoView({behavior:"smooth"})); }}><Icon name="calendar"/>Eventos</button>
        <button className="nav-item" onClick={()=>chooseFilter("Lugares")}><Icon name="pin"/>Lugares</button>
        <button className="nav-item" onClick={() => openPanel("suggest")}><Icon name="bulb"/>Sugerir Local</button>
        <button className="nav-item" onClick={() => openPanel("account")}><Icon name="user"/>Meu Perfil</button>
        <button className="nav-item admin" onClick={() => openPanel("admin")}><Icon name="crown"/>Área Admin</button>
      </nav>
      <div className="sidebar-bottom"><p><Icon name="pin" size={17}/>Belo Horizonte · MG</p><span>Feito com um tiquinho de mineiridade.</span></div>
    </aside>
    <div className="main-shell" id="inicio">
      <header className="topbar">
        <button className="icon-button mobile-toggle drawer-toggle" aria-label={mobileMenu ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)}><Icon name={mobileMenu ? "close" : "menu"}/></button>
        <label className="search-box"><Icon name="search" size={21}/>
          <input ref={search} type="search" aria-label="Buscar eventos, lugares e sugestões" placeholder="Qual vai ser o rolê de hoje?" value={query} onChange={event => setQuery(event.target.value)}/>
          {query && <button aria-label="Limpar busca" onClick={() => { setQuery(""); search.current?.focus(); }}><Icon name="close" size={16}/></button>}
        </label>
        <div className="topbar-actions">
          <button className="icon-button topbar-favorite" aria-label="Ver meus favoritos" onClick={() => { if (!community.user) openPanel("account"); else chooseFilter("Favoritos"); }}><Icon name="bookmark" size={20}/>{community.saved.length > 0 && <span className="favorite-count">{community.saved.length}</span>}</button>
          <button className="profile-button" onClick={() => openPanel("account")} aria-label={community.user ? "Abrir meu perfil" : "Entrar na minha conta"}><span className="avatar"><Icon name="user" size={19}/></span><span>{community.loadingUser ? "Aguarde…" : community.user ? userName.split(" ")[0] : "Entrar"}</span></button>
        </div>
      </header>
      <main id="conteudo">
        {view!=="home"&&<div className={view==="events"?"browse-intro events-intro":"browse-intro"}><Link href="/" className="text-link">← Voltar ao início</Link><span className="eyebrow">SEU PRÓXIMO ROLÊ TÁ AQUI</span><h1>{view==="events"?"Mais eventos. Mais BH.":view==="places"?"Explore cada cantinho.":"Perto de você."}</h1><p>{view==="events"?"Programação real, cultura e encontros para todos os gostos.":view==="places"?"Praças, parques e espaços culturais. Descubra o lugar e os eventos que acontecem por lá.":"Encontre lugares em BH e escolha o caminho para sua próxima descoberta."}</p>{view==="events"&&<EventArtwork/>}</div>}
        {view==="home"&&<>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy"><span className="eyebrow">BH É BOA DEMAIS PRA FICAR EM CASA</span>
            <h1 id="hero-title">Uai <span>Bora?</span></h1>
            <p className="hero-subtitle">Descubra eventos, explore lugares<br/> e viva o melhor de <strong>BH!</strong></p>
            <button className="primary-button" onClick={() => goTo("mapa")}><Icon name="pin" size={19}/>Explorar Mapa<Icon name="arrow" size={17}/></button>
          </div>
          <div className="hero-visual"><Image className="hero-photo" src="/images/pampulha.jpg" alt="Igreja de São Francisco de Assis, na Pampulha, em Belo Horizonte" width={800} height={600} priority/>
            <span className="photo-caption"><Icon name="pin" size={12}/>Pampulha, BH</span>
            <div className="hero-mascot-wrap"><OfficialMascot/></div>
            <span className="hero-crown" aria-hidden="true">♛</span>
          </div>
          <div className="quick-panel"><h2>O que você procura?</h2><div className="quick-grid">{tabs.map(([label,icon])=><button key={label} aria-pressed={filter===label} onClick={()=>chooseFilter(label)}><Icon name={icon} size={19}/>{label}</button>)}</div></div>
          <svg className="hero-wave" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70Q240 80 410 50T740 65T1200 0V80H0Z" fill="#b73c25"/><path d="M0 78Q200 40 460 70T930 45T1200 60V80H0Z" fill="#541c15"/></svg>
        </section></>}
        {view!=="map"&&<div className="explore-nav"><Link href="/eventos">Mais eventos ↗</Link><Link href="/lugares">Explorar lugares ↗</Link><Link href="/mapa">⌖ Perto de você</Link><button onClick={()=>{if(!community.user)openPanel("account");else setToast("A IA do Uai Bora está em desenvolvimento. Por enquanto, personalize seus interesses no perfil.");}}>✦ Meu guia com IA <small>em breve</small></button></div>}
        {(view==="events"||view==="places")&&<div className="catalog-filters"><label>Entrada<select value={fee} onChange={e=>setFee(e.target.value)}><option value="all">Todas</option><option value="free">✓ Gratuito</option><option value="paid">$ Pago</option></select></label><label>Seu tipo de rolê<select value={audience} onChange={e=>setAudience(e.target.value)}><option value="">Todos os públicos</option>{interests.map(t=><option key={t}>{t}</option>)}</select></label>{view==="events"&&<label>Quando<select value={when} onChange={e=>setWhen(e.target.value)}><option value="all">Toda a programação</option><option value="today">Começa hoje</option></select></label>}<label>Ordenar<select value={sort} onChange={e=>setSort(e.target.value)}><option value="popular">Mais favoritados</option><option value="date">Data de início</option></select></label><button className="text-link" onClick={()=>{setFee("all");setAudience("");setWhen("all");setQuery("");}}>Limpar filtros</button></div>}
        <div className="discovery-toolbar"><span className="toolbar-caption"><Icon name="pin" size={14}/>Belo Horizonte · MG <span>Encontre seu próximo rolê.</span></span><button className="text-link" onClick={()=>void catalog.refresh()} disabled={catalog.loading}>{catalog.loading?'Carregando…':'Atualizar catálogo'}</button></div>
        {catalog.error&&<p className="form-error" role="alert">{catalog.error}</p>}
        {(query || filter === "Favoritos") && <div className="search-summary" role="status"><span>{query ? "Resultados para “" + query + "”" : "Seus favoritos"} · {resultCount} {resultCount === 1 ? "resultado" : "resultados"}</span><button onClick={() => { setQuery(""); setFilter("Todos"); }}>Limpar filtros</button></div>}
        {filter === "Favoritos" && community.favoritesError && <p role="alert" className="form-error">{community.favoritesError}</p>}
        {showEvents && (eventItems.length > 0 || filter === "Eventos") && <section className="section" id="eventos">
          <SectionHeading icon="calendar" title={view==="home"?"Bora? A cidade tá acontecendo.":"Eventos em BH"} subtitle={community.user&&preferred.length?"Mais favoritados primeiro, com os seus interesses no desempate.":"Mais favoritados pela comunidade. De graça é ainda melhor."} action={filter !== "Eventos" ? "Mais eventos" : undefined} onAction={() => chooseFilter("Eventos")}/>
          {view==="home"&&spotlight&&<button className="today-feature" onClick={()=>setDetails(spotlight)}><Image src={spotlight.image} alt="" fill unoptimized sizes="100vw"/><div className="today-feature-copy"><span className="live-label">● {todayEvents.length?'É HOJE, UAI!':'BORA PLANEJAR O PRÓXIMO ROLÊ?'}</span><h3>{spotlight.title}</h3><p>{eventCallout(spotlight.startsAt,spotlight.endsAt,spotlight.info)} · {spotlight.location}</p><span className="feature-cta">Quero conhecer esse rolê <Icon name="arrow" size={22}/></span>{!!counts[spotlight.id]&&<small>♡ {counts[spotlight.id]} {counts[spotlight.id]===1?'pessoa salvou':'pessoas salvaram'}{todayEvents.length?' · mais favoritado entre os eventos de hoje':''}</small>}</div></button>}
          {view==="home"&&<div className="rail-controls"><button aria-label="Eventos anteriores" onClick={()=>document.getElementById("event-rail")?.scrollBy({left:-360,behavior:"smooth"})}>←</button><button aria-label="Próximos eventos" onClick={()=>document.getElementById("event-rail")?.scrollBy({left:360,behavior:"smooth"})}>→</button></div>}
          {eventItems.length ? cards(eventItems, true) : <div className="empty-state">Nenhum evento encontrado. Tente buscar outra categoria.</div>}
        </section>}
        {showPlaces && (placeItems.length > 0 || filter === "Lugares") && <section className="section" id="lugares">
          <SectionHeading icon="pin" title="BH merece ser descoberta" subtitle="Lugares reais para ver a cidade com outros olhos." action={filter !== "Lugares" ? "Explorar lugares" : undefined} onAction={() => chooseFilter("Lugares")}/>
          {view==="home"&&<div className="rail-controls"><button aria-label="Lugares anteriores" onClick={()=>document.getElementById("place-rail")?.scrollBy({left:-360,behavior:"smooth"})}>←</button><button aria-label="Próximos lugares" onClick={()=>document.getElementById("place-rail")?.scrollBy({left:360,behavior:"smooth"})}>→</button></div>}{placeItems.length ? cards(placeItems) : <div className="empty-state">Nenhum lugar encontrado. Tente buscar por Pampulha ou Liberdade.</div>}
        </section>}
        {showMap && <BhMap/>}
        {showSuggestions && (!query || suggestionItems.length>0 || filter==="Sugestões") && <section className="section" id="comunidade">
          <SectionHeading icon="bulb" title="Sugestões da comunidade" subtitle="A melhor dica de BH pode vir de você." action={community.configured ? "Atualizar" : undefined} onAction={() => void community.refreshSuggestions()}/>
          {community.loadingSuggestions && <p className="section-note" role="status">Buscando dicas da comunidade…</p>}
          {community.communityError && <p role="alert" className="form-error">{community.communityError}</p>}
          {suggestionItems.length > 0 && <div className="community-items">{cards(suggestionItems, false, true)}</div>}
          {query && !suggestionItems.length && <p className="section-note">Nenhuma sugestão corresponde a essa busca.</p>}
          <div className="community-invite"><OfficialMascot pose="point" className="community-mascot"/>
            <div><span className="eyebrow">QUEM É DE BH SABE.</span><h3>Tem um cantinho especial?</h3><p>Aquele café, a vista bonita, o passeio que pouca gente conhece.<br/>Compartilhe sua descoberta com a comunidade.</p></div>
            <button className="primary-button" onClick={() => openPanel("suggest")}>Sugerir um lugar<Icon name="arrow" size={17}/></button>
          </div>
        </section>}
        {resultCount === 0 && (query || filter === "Favoritos") && <div className="empty-state section"><OfficialMascot pose="explore" className="empty-mascot"/><h3>{filter === "Favoritos" ? "Seu próximo rolê merece um lugar aqui." : "Ainda não encontramos esse rolê."}</h3><p>{filter === "Favoritos" ? "Toque no marcador de um card para guardar na sua conta." : "Experimente outra palavra ou limpe os filtros."}</p><button className="secondary-button" onClick={() => { setQuery(""); setFilter("Todos"); }}>Explorar tudo</button></div>}
        <footer className="footer"><span><strong>Uai Bora?</strong> · BH é boa demais pra ficar em casa.</span><details><summary>Sobre esta prévia e créditos</summary><p>Eventos com selo “Demonstrativo” são fictícios, sem ingressos ou datas confirmadas. Fotografias ilustrativas dos eventos: Unsplash. Pampulha: <a href="https://commons.wikimedia.org/wiki/File:IgrejaPampulha.jpg" target="_blank" rel="noreferrer">Bernardo Gouvêa</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>. Praça da Liberdade: <a href="https://commons.wikimedia.org/wiki/File:Praça_da_Liberdade_em_BH.jpg" target="_blank" rel="noreferrer">Frederico Banana</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>. Enquadramento via CSS. Mascotes e logo oficiais fornecidos pela criadora.</p></details></footer>
      </main>
    </div>
    {(panel === "place" || panel === "event" || panel === "entries") && <Modal title={panel === "entries" ? "Meus cadastros" : panel === "place" ? "Um novo lugar para descobrir." : "Um novo evento em BH."} onClose={() => setPanel(null)}>
      {community.loadingUser ? <p role="status">Conferindo seu acesso…</p> : !community.user ? <><p>Entre na sua conta para cadastrar e acompanhar seus lugares e eventos.</p><button className="primary-button" onClick={() => openPanel("account")}>Entrar na minha conta</button></> : panel === "entries" ? <MyEntries onNew={kind => openPanel(kind === "places" ? "place" : "event")}/> : <CatalogForm key={panel} kind={panel === "place" ? "places" : "events"} onComplete={() => { setPanel("entries"); setToast("Cadastro enviado para análise da equipe."); }}/>} 
    </Modal>}
    {panel === "admin" && <Modal title="Área Admin" wide onClose={()=>setPanel(null)}><AdminPanel onChange={()=>{void catalog.refresh();void community.refreshSuggestions();}}/></Modal>}
    {panel === "account" && <Modal wide title={community.recovery ? "Vamos renovar sua senha?" : community.user ? "Ô, " + userName + "!" : "Seu cantinho no Uai Bora."} onClose={() => { setPanel(null); community.setRecovery(false); }}>
      {community.loadingUser ? <p role="status">Conferindo seu acesso…</p> : !community.user || community.recovery ? <AccountForm client={community.client} recovery={community.recovery} onComplete={accountComplete}/> : <>
        <p>{community.user.email}</p><p>Seus favoritos ficam na sua conta e suas sugestões podem ser vistas pela comunidade.</p>
        <div className="modal-actions"><button className="primary-button" onClick={() => { setPanel(null); chooseFilter("Favoritos"); }}>Meus favoritos ({community.saved.length})</button><button className="secondary-button" onClick={() => openPanel("suggest")}>Sugerir lugar</button></div>
        <div className="modal-actions"><button className="secondary-button" onClick={() => openPanel("place")}>Cadastrar lugar</button><button className="secondary-button" onClick={() => openPanel("event")}>Cadastrar evento</button><button className="text-link" onClick={() => openPanel("entries")}>Meus cadastros</button></div>
        {accountError && <p className="form-error" role="alert">{accountError}</p>}
        <button className="text-link" onClick={() => void signOut()}>Sair da conta</button>
      </>}
    </Modal>}
    {panel === "suggest" && <Modal title="Qual cantinho merece um bora?" onClose={() => setPanel(null)}>
      {community.user ? <SuggestionForm onPublish={community.publishSuggestion} onComplete={() => { setPanel(null); setFilter("Sugestões"); setQuery(""); setToast("Sua dica foi enviada para análise. Valeu demais!"); }}/>
        : community.configured ? <><p>Entre na sua conta para compartilhar seu lugar favorito com a comunidade.</p><button className="primary-button" onClick={() => openPanel("account")}>Entrar ou criar conta</button></> : <AccountForm client={null} onComplete={accountComplete}/>}
    </Modal>}
    {details && <Modal title={details.title} onClose={() => setDetails(null)}>
      <div className="modal-photo"><Image src={details.image} alt={details.alt} fill unoptimized sizes="450px"/></div>
      <span className="demo-label">{details.kind==="event" ? (details.isDemo ? "Evento demonstrativo · sem programação real" : "Programação em Belo Horizonte") : selectedSuggestion ? "Compartilhado pela comunidade" : "Lugar real · seleção do Uai Bora"}</span>
      <div className="detail-facts"><span className={"price-badge "+(details.info?.price||"unknown")}>{details.info?.price==="free"?"✓ ":details.info?.price==="paid"?"$ ":"? "}{priceLabel(details.info)}</span>{details.info?.tags?.map(t=><span className="tag-badge" key={t}>{t}</span>)}</div><p>{details.description}</p>{details.info?.hours&&<div className="detail-info"><h3>Horários e funcionamento</h3><p>{details.info.hours}</p></div>}{details.info?.priceNote&&<p><strong>Entrada:</strong> {details.info.priceNote}</p>}{details.info?.bookingUrl&&<a className="secondary-button" href={details.info.bookingUrl} target="_blank" rel="noreferrer">Ingresso / agendamento oficial ↗</a>}{details.info?.sourceUrl&&<p className="source-note"><a href={details.info.sourceUrl} target="_blank" rel="noreferrer">Conferir fonte oficial ↗</a>{details.info.checkedAt&&" · Conferido em "+details.info.checkedAt}<br/>Horários e programação podem mudar. Confira antes de sair.</p>}{details.info?.photoCredit&&<small className="source-note">Foto: {details.info.photoCredit}</small>}<p className="metadata"><Icon name="pin" size={17}/>{details.location}</p>
      {details.date && <p className="metadata"><Icon name="calendar" size={17}/>{details.date}{details.isDemo ? " · data fictícia" : " · horário de BH"}</p>}
      {details.kind==='place'&&<section className="place-events"><h3><Icon name="calendar" size={20}/>Próximos eventos neste local</h3>{events.filter(event=>event.placeId===details.recordId&&(!event.startsAt||new Date(event.endsAt||event.startsAt).getTime()>=Date.now())).length ? <div className="related-events">{events.filter(event=>event.placeId===details.recordId&&(!event.startsAt||new Date(event.endsAt||event.startsAt).getTime()>=Date.now())).map(event=><button key={event.id} onClick={()=>setDetails(event)}><Image src={event.image} alt="" width={72} height={58} unoptimized/><span><strong>{event.title}</strong><small>{event.date}{event.isDemo?' · demonstração':''}</small></span><Icon name="arrow" size={17}/></button>)}</div>:<p>Ainda não há eventos futuros publicados para este local.</p>}</section>}
      {details.kind==='event'&&details.placeId&&places.some(place=>place.recordId===details.placeId)&&<button className="secondary-button" onClick={()=>setDetails(places.find(place=>place.recordId===details.placeId)||null)}><Icon name="pin" size={17}/>Conhecer o local deste evento</button>}
      <div className="modal-actions"><button className="primary-button" onClick={() => void save(details)}><Icon name="bookmark" size={16}/>{community.saved.includes(details.id) ? "Remover dos favoritos" : "Salvar na minha conta"}</button>
        {<a className="secondary-button" href={mapsUrl(details.location)} target="_blank" rel="noreferrer">Ver no mapa<Icon name="arrow" size={16}/></a>}
      </div>
      {details.kind!=="suggestion"&&<Reviews key={details.id} itemId={details.id} client={community.client} user={community.user} onLogin={()=>openPanel("account")}/>}
      {selectedSuggestion && selectedSuggestion.user_id === community.user?.id && <button className="text-link" disabled={deleting} onClick={async () => {
        if (!selectedSuggestion || deleting) return;
        setDeleting(true);
        try { const error = await community.removeSuggestion(selectedSuggestion.id); if (!error) setDetails(null); setToast(error || "Sua sugestão foi removida."); }
        catch { setToast("Não foi possível remover agora."); }
        finally { setDeleting(false); }
      }}>{deleting ? "Removendo…" : "Remover minha sugestão"}</button>}
    </Modal>}
    {toast && <div className="toast" role="status"><span>{toast}</span><button aria-label="Fechar aviso" onClick={() => setToast("")}><Icon name="close" size={17}/></button></div>}
  </div>;
}
