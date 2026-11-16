"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./icon";

export function Modal({ title, children, onClose, wide=false }: {
  wide?: boolean; title: string; children: ReactNode; onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return <dialog ref={ref} className={wide ? "modal modal-wide" : "modal"} aria-labelledby="modal-title" onCancel={onClose}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="modal-heading"><span className="eyebrow">UAI BORA · BH</span>
      <button className="icon-button" aria-label="Fechar janela" onClick={onClose}><Icon name="close" /></button>
    </div>
    <h2 id="modal-title">{title}</h2>
    {children}
  </dialog>;
}
