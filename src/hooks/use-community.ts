"use client";
import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import { validateSuggestion, type SuggestionDraft, type SuggestionRow } from "@/lib/discovery";

export function authMessage(code?: string) {
  const messages: Record<string, string> = {
    invalid_credentials: "E-mail ou senha incorretos.",
    email_not_confirmed: "Confirme seu e-mail antes de entrar.",
    weak_password: "Use uma senha mais forte, com pelo menos 8 caracteres.",
    over_email_send_rate_limit: "Aguarde alguns minutos antes de solicitar outro e-mail.",
    user_already_exists: "Não foi possível criar essa conta. Tente entrar ou recuperar sua senha.",
  };
  return messages[code || ""] || "Não foi possível concluir. Confira sua conexão e tente novamente.";
}

export function useCommunity() {
  const [client] = useState(getSupabase);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(!!client);
  const [suggestions, setSuggestions] = useState<SuggestionRow[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(!!client);
  const [communityError, setCommunityError] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [favoritesReady, setFavoritesReady] = useState(false);
  const [favoritesError, setFavoritesError] = useState("");
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    if (!client) return;
    let active = true;
    client.auth.getUser().then(({data}) => {
      if (active) { setUser(data.user); setLoadingUser(false); }
    }).catch(() => { if (active) setLoadingUser(false); });
    const {data: {subscription}} = client.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoadingUser(false);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [client]);

  const refreshSuggestions = useCallback(async () => {
    if (!client) return;
    setLoadingSuggestions(true);
    const {data, error} = await client.from("uaibora_suggestions").select("*").eq("moderation_status", "approved").order("created_at", {ascending: false}).limit(100);
    setCommunityError(error ? "Não conseguimos carregar as sugestões agora. Tente novamente." : "");
    if (!error) setSuggestions(data as SuggestionRow[]);
    setLoadingSuggestions(false);
  }, [client]);
  useEffect(() => { void refreshSuggestions(); }, [refreshSuggestions]);

  useEffect(() => {
    let active = true;
    setSaved([]);
    setFavoritesReady(false);
    setFavoritesError("");
    if (!client || !user) return;
    client.from("uaibora_favorites").select("item_id").eq("user_id", user.id).then(({data, error}) => {
      if (!active) return;
      if (error) setFavoritesError("Não foi possível carregar seus favoritos. Recarregue a página para tentar novamente.");
      else { setSaved(data.map(item => item.item_id)); setFavoritesReady(true); }
    });
    return () => { active = false; };
  }, [client, user?.id]);

  async function toggleFavorite(itemId: string) {
    if (!client || !user) return "Entre na sua conta para salvar seus lugares e eventos.";
    if (!favoritesReady) return favoritesError || "Seus favoritos ainda estão carregando. Aguarde um instante.";
    if (savingFavorite) return "Aguarde o salvamento anterior terminar.";
    setSavingFavorite(true);
    try {
      const exists = saved.includes(itemId);
      const result = exists
        ? await client.from("uaibora_favorites").delete().eq("user_id", user.id).eq("item_id", itemId)
        : await client.from("uaibora_favorites").insert({user_id: user.id, item_id: itemId});
      if (result.error) return "Não foi possível atualizar seus favoritos. Tente novamente.";
      setSaved(current => exists ? current.filter(id => id !== itemId) : [...new Set([...current, itemId])]);
      return null;
    } finally { setSavingFavorite(false); }
  }

  async function publishSuggestion(draft: SuggestionDraft) {
    const invalid = validateSuggestion(draft);
    if (invalid) return invalid;
    if (!client || !user) return "Entre na sua conta para compartilhar uma sugestão.";
    const {error} = await client.from("uaibora_suggestions").insert({
      user_id: user.id, title: draft.title.trim(), category: draft.category,
      location: draft.location.trim(), description: draft.description.trim(),
    }).select("*").single();
    if (error) return "Sua sugestão não foi publicada. Confira a conexão e tente novamente.";
    // Pending suggestions enter the public list only after administrative approval.
    return null;
  }

  async function removeSuggestion(id: string) {
    if (!client || !user) return "Entre na sua conta para gerenciar suas sugestões.";
    const {error} = await client.from("uaibora_suggestions").delete().eq("id", id).eq("user_id", user.id);
    if (error) return "Não foi possível remover a sugestão.";
    setSuggestions(current => current.filter(item => item.id !== id));
    return null;
  }
  return {client, configured: !!client, user, loadingUser, suggestions, saved, communityError,
    loadingSuggestions, refreshSuggestions, toggleFavorite, publishSuggestion, removeSuggestion,
    favoritesError, recovery, setRecovery};
}
