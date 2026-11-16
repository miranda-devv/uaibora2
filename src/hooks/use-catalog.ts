"use client";
import { useCallback, useEffect, useState } from 'react';
import { normalizeInfo } from "@/lib/catalog-info";
import type { DiscoveryItem } from '@/data/demo';
import type { PlaceRow, EventRow } from '@/lib/supabase/catalog';
const safeImage = (path: string | null, fallback: string) => path && ((path.startsWith('/images/') || path.startsWith('/uploads/')) || path.startsWith('https://')) ? path : fallback;
export function useCatalog() {
    const [places, setPlaces] = useState<DiscoveryItem[]>([]);
    const [events, setEvents] = useState<DiscoveryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const refresh = useCallback(async () => { setLoading(true); setError(''); try {
        const responses = await Promise.all([fetch('/api/lugares', { cache: 'no-store' }), fetch('/api/eventos', { cache: 'no-store' })]);
        const [p, e] = await Promise.all(responses.map(r => r.json()));
        if (!responses.every(r => r.ok))
            throw Error();
        setPlaces(p.data.map((row: PlaceRow) => ({ id: 'place:' + row.id, recordId: row.id, kind: 'place', title: row.title, category: row.category, location: row.location, description: row.description, image: safeImage(row.image_path, '/images/pampulha.jpg'), alt: row.title, info: normalizeInfo(row.info) })));
        setEvents(e.data.map((row: EventRow) => ({ id: 'event:' + row.id, recordId: row.id, placeId: row.place_id, kind: 'event', title: row.title, category: row.category, location: row.location, description: row.description, image: safeImage(row.image_path, row.category === 'Gastronomia' ? '/images/gastronomia.jpg' : '/images/show.jpg'), alt: row.title, date: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date(row.starts_at)), startsAt: row.starts_at, isDemo: row.is_demo, endsAt: row.ends_at ?? undefined, info: normalizeInfo(row.info) })));
    }
    catch {
        setError('Não conseguimos carregar o catálogo. Tente atualizar.');
    }
    finally {
        setLoading(false);
    } }, []);
    useEffect(() => { void refresh(); }, [refresh]);
    return { places, events, loading, error, refresh };
}
