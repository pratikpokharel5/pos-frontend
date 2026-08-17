const readableIdCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function randomReadableId(prefix: string, length = 8) {
  let value = prefix;

  for (let index = 0; index < length; index += 1) {
    value += readableIdCharacters[Math.floor(Math.random() * readableIdCharacters.length)];
  }

  return value;
}
