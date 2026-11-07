const paths = {
  radiation: '<circle cx="12" cy="12" r="2"/><path d="M10 8.4 7.1 3.5A9.9 9.9 0 0 0 2 12h5.6M14 8.4l2.9-4.9A9.9 9.9 0 0 1 22 12h-5.6M9.9 15.5 7 20.4a10 10 0 0 0 10 0l-2.9-4.9"/>',
  skull: '<path d="M7 17H5l1-5a7 7 0 1 1 12 0l1 5h-2v4H7z"/><circle cx="9" cy="11" r="1.5"/><circle cx="15" cy="11" r="1.5"/><path d="m11 15 1-2 1 2m-3 3v3m4-3v3"/>',
  snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M3.6 10l4.1-1.1-1.1-4.1M20.4 14l-4.1 1.1 1.1 4.1M6.6 19.2l1.1-4.1-4.1-1.1M17.4 4.8l-1.1 4.1 4.1 1.1"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  arrowLeft: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  volume: '<path d="M11 4 6 8H3v8h3l5 4zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  mute: '<path d="M11 4 6 8H3v8h3l5 4zM16 9l6 6m0-6-6 6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.2 8.6a2.8 2.8 0 1 1 4.2 2.4c-1.4.8-1.4 1.2-1.4 2.5m0 3h.01"/>',
  pause: '<path d="M7 4h3v16H7zm7 0h3v16h-3z"/>',
  play: '<path d="m8 4 12 8L8 20z"/>',
  close: '<path d="m5 5 14 14M19 5 5 19"/>',
  backpack: '<path d="M7 7V5a5 5 0 0 1 10 0v2M5 7h14l2 14H3z"/><rect x="7" y="12" width="10" height="6" rx="1"/><path d="M9 7v3m6-3v3M3.8 13H2v6h1.3M20.2 13H22v6h-1.3"/>',
  water: '<path d="M12 2S4 10.2 4 15a8 8 0 0 0 16 0c0-4.8-8-13-8-13zM8 15a4 4 0 0 0 4 4"/>',
  food: '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v14c0 4 14 4 14 0V5M5 10h14M8 14h8m-8 3h6"/>',
  medicine: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 5V2h8v3m-4 6v6m-3-3h6"/>',
  mask: '<path d="M5 8a22 22 0 0 0 14 0v8a7 7 0 0 1-14 0zM5 10H2v6h3m14-6h3v6h-3M8 12h8m-8 3h8"/>',
  radio: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="m6 8 12-6M6 12h12"/><circle cx="9" cy="17" r="2"/><path d="M15 16h3m-3 3h3"/>',
  tools: '<path d="m14.5 7.5 3 3a6 6 0 0 1-6.2 1.3L4.5 19a2 2 0 0 1-3-3l7.2-6.8A6 6 0 0 1 16.3 2l-3.4 3.4zM18 15l4 4-3 3-4-4M4 2l5 5-2 2-5-5z"/>',
  wood: '<path d="m5 4 15 10-4 7L1 11zM5 4l4-2 15 10-4 2M16 21l6-3 2-6"/><ellipse cx="6" cy="10" rx="2" ry="3" transform="rotate(-35 6 10)"/><path d="m11 9 7 5M10 14l5 3"/>',
  blanket: '<path d="M4 3h15v18H4c-3 0-3-5 0-5h15M4 3c-3 0-3 5 0 5h15M4 16c2 0 2 5 0 5M7 9v5m4-5v5m4-5v5"/>',
  weapon: '<path d="m3 19 4 2 4-8h5l6-6-2-2-6 5H9L7 8 4 9l2 4zM13 10V8h5M10 13l4 3 2-3"/>',
  battery: '<rect x="2" y="6" width="18" height="12" rx="2"/><path d="M20 10h2v4h-2M6 12h4m-2-2v4m6-2h3"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  heart: '<path d="m12 21-8-8a5.6 5.6 0 0 1 8-8 5.6 5.6 0 0 1 8 8z"/>',
  flame: '<path d="M14 2c1 7-5 7-3 12 2-1 3-3 3-5 7 6 6 13-2 13S1 15 5 9c0 4 2 5 3 4C5 7 12 7 14 2z"/>',
  book: '<path d="M12 5C8 2 4 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1zm0 0v16M5 7h4m-4 4h4m6-4h4m-4 4h4"/>',
  home: '<path d="m2 11 10-9 10 9M5 9v13h14V9M9 22v-8h6v8"/>',
  flag: '<path d="M4 22V3c6-4 10 4 16 0v12c-6 4-10-4-16 0"/>',
  moon: '<path d="M21 14a9 9 0 1 1-11-11 8 8 0 0 0 11 11z"/>',
  warning: '<path d="m12 2 11 19H1zM12 8v6m0 3h.01"/>',
  person: '<circle cx="12" cy="6" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3z"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
  minus: '<path d="M4 12h16"/>',
  door: '<path d="M3 22h18M5 22V3h14v19M8 22V6l8-2v18M12 13h.01"/>',
  bolt: '<path d="m14 1-11 13h8l-1 9 11-14h-8z"/>',
  bomb: '<path d="m14 7 4-5 2 2-3 4M16 7l5 2-1 3-5-1M10 7a7 7 0 1 0 7 7 7 7 0 0 0-7-7zM6 12l3-2"/>',
  zombie: '<path d="M5 10a7 7 0 0 1 14 0v7l-3 4h-6l-5-4zM5 10 2 9v5l3 1m14-5 3-1v5l-3 1M7 3l4 4 2-2 4 3M8 11l3 2m-3 0 3-2M16 11h.01M9 18h7m-5-2v3m3-3v3"/>',
  shield: '<path d="M12 2 3 6v6c0 6 9 10 9 10s9-4 9-10V6z"/><path d="m7 12 3 3 7-7"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16 7-3 6-6 4 4-7z"/>'
};
export function icon(name, className='') { return `<svg class="icon ${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.warning}</svg>`; }

export function portrait(id) {
  const faces = {
    father: `<path d="M14 64V49c3-5 11-7 18-7s16 2 18 7v15" fill="#48716d"/><path d="m24 44 8 8 8-8M32 52v12" fill="none"/><path d="M21 21c0-10 22-11 22 1v11c0 9-5 14-11 14s-11-5-11-14z" fill="#dcb987"/><path d="M19 25c-4-15 5-21 14-21 12 0 15 10 12 21l-4-11-8 3-11-1z" fill="#343d38"/><path d="M21 28h22M29 29h6"/><rect x="20" y="26" width="10" height="7" rx="2" fill="#eee5cc"/><rect x="34" y="26" width="10" height="7" rx="2" fill="#eee5cc"/><circle cx="25" cy="29" r="1" fill="#283b38"/><circle cx="39" cy="29" r="1" fill="#283b38"/><path d="m32 31-2 5h4M28 40h8" fill="none"/>`,
    mother: `<path d="M13 64V50c4-6 12-8 19-8s16 3 19 8v14" fill="#b48244"/><path d="M18 37C10 13 21 4 33 4c15 0 20 12 14 34l-5 11H20z" fill="#3d4135"/><path d="M21 20c2-4 5-8 10-9 3 5 8 6 12 7v16c0 9-5 14-11 14s-11-5-11-14z" fill="#dcb987"/><path d="M25 28h3m9 0h3m-9 5-1 3h3m-6 4c3 2 6 2 9 0" fill="none"/><path d="m20 43 12 5 12-5-2 10-10-2-5 13h-7l5-14z" fill="#a6513c"/>`,
    daughter: `<path d="M12 64V50c4-6 12-9 20-9s17 3 20 9v14" fill="#587c75"/><path d="M17 40V21c0-12 6-18 15-18s16 6 16 18v21l-9 2H24z" fill="#343d38"/><path d="M21 22c0-5 4-11 11-11s11 6 11 11v13c0 9-5 14-11 14s-11-5-11-14z" fill="#ddb78a"/><path d="m20 22 1-9 8-4 11 2 5 11-13-4-3 5z" fill="#343d38"/><path d="M25 29h3m9 0h3m-9 5-1 3h3m-6 4c3 2 6 2 9 0M26 49l6 6 6-6M32 55v9" fill="none"/><path d="m20 20 2-6" stroke="#caa153" stroke-width="3"/>`,
    son: `<path d="M13 64V52c3-7 11-9 19-9s16 2 19 9v12" fill="#b89a55"/><path d="M21 23c0-12 22-12 22 0v12c0 9-5 14-11 14s-11-5-11-14z" fill="#dcb987"/><path d="M19 25V15c0-9 6-13 15-13 10 0 14 6 14 17l-6 5-1-10-18 5z" fill="#456c66"/><path d="M15 20c9-2 22-7 36-1l-1 4H15z" fill="#64857a"/><path d="M25 30h3m9 0h3m-9 5-1 3h3m-6 4c3 2 6 2 9 0M24 49l8 5 8-5M26 57h12" fill="none"/>`
  };
  return `<svg class="portrait" width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#303b34" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="幸存者肖像"><defs><clipPath id="face-${id}"><circle cx="32" cy="32" r="31"/></clipPath></defs><circle cx="32" cy="32" r="31" fill="#ded5b9" stroke="#b5b195"/><g clip-path="url(#face-${id})">${faces[id] || faces.son}</g></svg>`;
}
