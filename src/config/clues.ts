import type { ClueDefinition } from '../types/clues';

/**
 * Catalog of discoverable clues within Node 404.
 * Each clue is keyed by a stable unique ID and tied to a physical interactable.
 */
export const CLUE_CATALOG: ClueDefinition[] = [
  {
    id: 'archive-04',
    title: 'ARCHIVE-04',
    summary: 'Recovered incident record',
    category: 'RECOVERED',
    sourceId: 'notes',
    caseFile: 'CASE FILE / 404',
    fullText:
      'A damaged magnetic tape record was recovered from the archival server bay. The decrypted fragment reads: "Main web uplink collapsed. Network disconnect occurred exactly at 04:04. All outer routing tables were severed. Emergency isolation lockdown engaged for Chamber 404."',
  },
  {
    id: 'clock-0404',
    title: '04:04 INCIDENT',
    summary: 'Clock observation',
    category: 'OBSERVATION',
    sourceId: 'clock',
    caseFile: 'TIMESTAMPS / SYNC',
    fullText:
      'The analog wall chronometer was frozen at 04:04, exactly matching the timestamp cited in incident ARCHIVE-04. Manually calibrating the hands to 04:04 synchronizes the internal clockwork with the chamber\'s pneumatic circuit, generating the security override pulse.',
  },
  {
    id: 'unknown-signal',
    title: 'UNKNOWN SIGNAL',
    summary: 'Unverified carrier lead',
    category: 'SIGNAL',
    sourceId: 'computer',
    caseFile: 'NET-CARRIER / 09',
    fullText:
      'The vintage CRT terminal displays faint phosphorescent residual packets from the Great Blackout of October 2004. An isolated terminal prompt awaits operator commands. Passcode records indicate override keyword "NET-404" disengages chamber lockdown.',
  },
  {
    id: 'door-lockdown',
    title: 'AIRLOCK PROTOCOL',
    summary: 'Pneumatic security protocol',
    category: 'PROTOCOL',
    sourceId: 'door',
    caseFile: 'SECURITY / LOCK-01',
    fullText:
      'Heavy reinforced blast airlock sealing Chamber 404 from the exterior. Pneumatic solenoid bolts remain engaged until an authorized security override code (NET-404) is submitted or the chronometer 04:04 pulse fires.',
  },
  {
    id: 'window-skyline',
    title: 'SILENT SKYLINE',
    summary: 'Environmental survey',
    category: 'OBSERVATION',
    sourceId: 'window',
    caseFile: 'OUTER-NET / EXT',
    fullText:
      'Looking out through rain-slicked glass onto the dark monolithic towers of the offline city. No carrier beacons or digital broadcasts are active across the skyline. The outer web has fallen completely silent.',
  },
];
