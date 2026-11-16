"use client";
import { useState, type FormEvent } from "react";
import { categories, validateSuggestion, type SuggestionDraft } from "@/lib/discovery";

export function SuggestionForm({onPublish, onComplete}: {
  onPublish: (draft: SuggestionDraft) => Promise<string | null>;
  onComplete: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const draft = {title: String(form.get("title") || ""), category: String(form.get("category") || ""), location: String(form.get("location") || ""), description: String(form.get("description") || "")};
    const invalid = validateSuggestion(draft);
    if (invalid) { setError(invalid); return; }
    setBusy(true); setError("");
    try { const problem = await onPublish(draft); if (problem) setError(problem); else onComplete(); }
    catch { setError("Não conseguimos publicar agora. Sua dica continua no formulário para você tentar novamente."); }
    finally { setBusy(false); }
  }
  return <form className="form-stack" onSubmit={submit}>
    <p>Sua dica será pública. Conte pra gente o que faz esse lugar ser especial!</p>
    <label>Nome do lugar<input name="title" required minLength={3} maxLength={80} disabled={busy}/></label>
    <label>Categoria<select name="category" required disabled={busy}>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
    <label>Onde fica?<input name="location" required minLength={3} maxLength={120} placeholder="Endereço ou bairro em Belo Horizonte" disabled={busy}/></label>
    <label>Por que vale o rolê?<textarea name="description" required minLength={15} maxLength={1000} rows={4} disabled={busy}/></label>
    <small>Compartilhe apenas informações do lugar, sem telefones, e-mails ou outros dados pessoais.</small>
    {error && <p role="alert" className="form-error">{error}</p>}
    <button className="primary-button" disabled={busy}>{busy ? "Publicando…" : "Publicar sugestão"}</button>
  </form>;
}
