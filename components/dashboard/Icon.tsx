'use client';

export type IconName =
  | 'gauge' | 'layers' | 'bars' | 'doc' | 'settings' | 'help'
  | 'check' | 'save' | 'share' | 'reset' | 'pin' | 'building'
  | 'car' | 'infra' | 'leaf' | 'bulb' | 'sun' | 'globe'
  | 'chevron-down' | 'chevron-up' | 'chevron-right'
  | 'arrow-down' | 'arrow-up' | 'edit' | 'plus';

type Props = { name: IconName; size?: number; stroke?: number; color?: string };

export default function Icon({ name, size = 16, stroke = 1.6, color = 'currentColor' }: Props) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'gauge':       return <svg {...p}><path d="M12 14l4-4"/><circle cx="12" cy="14" r="0.8" fill={color}/><path d="M4 16a8 8 0 0 1 16 0"/></svg>;
    case 'layers':      return <svg {...p}><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>;
    case 'bars':        return <svg {...p}><path d="M5 20V10M12 20V4M19 20v-7"/></svg>;
    case 'doc':         return <svg {...p}><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M9 13h7M9 17h7"/></svg>;
    case 'settings':    return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3.1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.6.2 1.1.5 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case 'help':        return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4"/><circle cx="12" cy="17" r="0.5" fill={color} stroke={color}/></svg>;
    case 'check':       return <svg {...p}><path d="M5 12l4 4L19 7"/></svg>;
    case 'save':        return <svg {...p}><path d="M5 4h11l3 3v13H5z"/><path d="M8 4v6h8V4M8 20v-6h8v6"/></svg>;
    case 'share':       return <svg {...p}><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 11l8-4M8 13l8 4"/></svg>;
    case 'reset':       return <svg {...p}><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>;
    case 'pin':         return <svg {...p}><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case 'building':    return <svg {...p}><path d="M5 21V5l7-2v18M19 21V11l-7-2"/><path d="M9 8h0M9 12h0M9 16h0M15 14h0M15 18h0"/></svg>;
    case 'car':         return <svg {...p}><path d="M4 16v-3l2-5a2 2 0 0 1 2-1.4h8a2 2 0 0 1 2 1.4l2 5v3"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/><path d="M4 13h16"/></svg>;
    case 'infra':       return <svg {...p}><path d="M3 20l9-15 9 15M7 20l5-9 5 9M10 20v-3h4v3"/></svg>;
    case 'leaf':        return <svg {...p}><path d="M5 19c8 0 14-6 14-14 0 0-6 0-10 4s-4 10-4 10z"/><path d="M5 19c2-3 5-6 9-8"/></svg>;
    case 'bulb':        return <svg {...p}><path d="M9 18h6M10 21h4M9 14a5 5 0 1 1 6 0c-1 .6-1.5 1.5-1.5 2.5h-3c0-1-.5-1.9-1.5-2.5z"/></svg>;
    case 'sun':         return <svg {...p}><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>;
    case 'globe':       return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case 'chevron-down':  return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>;
    case 'chevron-up':    return <svg {...p}><path d="M18 15l-6-6-6 6"/></svg>;
    case 'chevron-right': return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case 'arrow-down':  return <svg {...p}><path d="M12 5v14M6 13l6 6 6-6"/></svg>;
    case 'arrow-up':    return <svg {...p}><path d="M12 19V5M6 11l6-6 6 6"/></svg>;
    case 'edit':        return <svg {...p}><path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M14 6l4 4"/></svg>;
    case 'plus':        return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    default:            return null;
  }
}
