/**
 * Tata letak Editorial Paper. Asimetris dengan sengaja: kolom teks di kiri,
 * jendela footage di kanan (landscape) — bukan semuanya di tengah.
 */

export type Layout = {
  vertical: boolean;
  safe: number;
  /** jeda pita subtitle dari atas kanvas */
  subTop: number;
  subLeft: number;
  subMaxWidth: number;
  subSize: number;
  titleSize: number;
  lineSize: number;
  motifSize: number;
  /** tinggi kotak panel termasuk keterangan foto */
  panelHeight: number;
};

export const layoutFor = (width: number, height: number): Layout => {
  const vertical = height > width;
  if (vertical) {
    return {
      vertical,
      safe: 150,
      subTop: 1560,
      subLeft: 150,
      subMaxWidth: 780,
      subSize: 42,
      titleSize: 82,
      lineSize: 40,
      motifSize: 132,
      panelHeight: 740,
    };
  }
  return {
    vertical,
    safe: 96,
    subTop: 878,
    subLeft: 96,
    subMaxWidth: 1330,
    subSize: 34,
    titleSize: 82,
    lineSize: 38,
    motifSize: 156,
    panelHeight: 600,
  };
};

export const splitEmphasis = (text: string, emphasis?: string) => {
  if (!emphasis) return [{text, mark: false}];
  const idx = text.toLowerCase().indexOf(emphasis.toLowerCase());
  if (idx < 0) return [{text, mark: false}];
  return [
    {text: text.slice(0, idx), mark: false},
    {text: text.slice(idx, idx + emphasis.length), mark: true},
    {text: text.slice(idx + emphasis.length), mark: false},
  ].filter((p) => p.text.length > 0);
};

