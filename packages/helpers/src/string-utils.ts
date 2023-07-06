import _ from "lodash";

// PascalCase is defined as camelCase with the first letter capitalized
// https://en.wikipedia.org/wiki/Camel_case
export function toPascalCase(str: string) {
  return _.upperFirst(_.camelCase(str));
}

export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}
