export function capitalize(words, ...exemptions) {
  let capitalized = words.toLowerCase().trim();
   capitalized = words.includes(' ') 
    ? capitalized.split(' ')
      .map(word => !exemptions.includes(word) 
        ? word[0].toUpperCase() + word.slice(1) 
        : word).join(' ') 
    : capitalized[0].toUpperCase() + capitalized.slice(1);
   return capitalized; 
}


export function pluralize(item, word='') {
  /** arg: item.length or number */
  return item > 1 ? `${word}s` : `${word}`
}
