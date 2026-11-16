import { priceLabel,eventCallout } from "@/lib/catalog-info";
import Image from "next/image";
import type { DiscoveryItem } from "@/data/demo";
import { Icon } from "./icon";

type Props = {
  item: DiscoveryItem;
  saved: boolean;
  isEvent?: boolean;
  community?: boolean;
  onSave: () => void;
  onDetails: () => void;
};
export function DiscoveryCard({item, saved, isEvent = false, community = false, onSave, onDetails}: Props) {
  return <article className="discovery-card"><button type="button" className="card-hit-target" onClick={onDetails} aria-label={"Ver detalhes de " + item.title}/>
    <div className={community ? "card-photo community-photo" : "card-photo"}>
      <Image src={item.image} alt={item.alt} fill unoptimized sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw" />
      <span className="category">{item.category}</span>
      <button className={saved ? "save-button is-saved" : "save-button"} aria-pressed={saved}
        aria-label={(saved ? "Remover dos favoritos: " : "Salvar nos favoritos: ") + item.title} onClick={onSave}>
        <Icon name={saved ? "check" : "bookmark"} size={19}/>
      </button>
    </div>
    <div className="card-content">
      <span className="demo-label">{isEvent ? (item.isDemo ? "Evento demonstrativo" : "Evento em BH") : community ? "Dica da comunidade" : "Descubra BH"}</span>
      {item.kind!=="suggestion"&&<span className={"price-badge "+(item.info?.price||"unknown")}>{item.info?.price==="free"?"✓ ":item.info?.price==="paid"?"$ ":"? "}{priceLabel(item.info)}</span>}
      {isEvent&&<p className="event-callout">{eventCallout(item.startsAt,item.endsAt,item.info)}</p>}
      <h3>{item.title}</h3>
      <p><Icon name="pin" size={15}/>{item.location}</p>
      {!!item.favoriteCount&&<small>♡ {item.favoriteCount} {item.favoriteCount===1?'pessoa salvou':'pessoas salvaram'}</small>}
      <div className="card-bottom">
        <span>{item.date ? <><Icon name="calendar" size={15}/>{item.date}</> : "Bora conhecer?"}</span>
        <span className="card-details" aria-hidden="true"><Icon name="arrow" size={20}/></span>
      </div>
    </div>
  </article>;
}
