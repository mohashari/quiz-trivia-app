// Open Trivia DB returns HTML-encoded strings — decode common entities safely
const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': "'",
  '&ldquo;': '\u201C',
  '&rdquo;': '\u201D',
  '&lsquo;': '\u2018',
  '&rsquo;': '\u2019',
  '&ndash;': '\u2013',
  '&mdash;': '\u2014',
  '&hellip;': '\u2026',
  '&eacute;': '\u00E9',
  '&egrave;': '\u00E8',
  '&ecirc;': '\u00EA',
  '&ouml;': '\u00F6',
  '&uuml;': '\u00FC',
  '&auml;': '\u00E4',
  '&ntilde;': '\u00F1',
  '&ccedil;': '\u00E7',
}

export function decode(str: string): string {
  return str
    .replace(/&[a-z]+;|&#\d+;/gi, (entity) => {
      if (entity in ENTITIES) return ENTITIES[entity]
      // numeric entities like &#039;
      const match = entity.match(/^&#(\d+);$/)
      if (match) return String.fromCharCode(parseInt(match[1], 10))
      return entity
    })
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
