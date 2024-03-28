import * as cheerio from "cheerio";
import axios from "axios";

let scrapper: cheerio.CheerioAPI | null = null;

export function getDomain(url: string) {
  let regex: RegExp = /(?:(?:https?|ftp):\/\/)?(?:www\.)?([^\/?#\s]+)/;
  let domain = url.match(regex);
  if (!domain) return "não foi possivel encontrar dominio";
  return domain[1];
}

export function getTitle() {
  if (!scrapper) throw new Error("");
  return scrapper("title").text();
}

function getFavIcons() {
  if (!scrapper) throw new Error("");
  let iconUrls: string[] = [];

  scrapper("link[rel=icon]").each((_, element) => {
    if (element.attributes.length > 0) {
      for (let attr of element.attributes) {
        if (attr.name === "href" && attr.value) {
          iconUrls.push(attr.value);
        }
      }
    }
  });
  return iconUrls;
}

export async function getLinkPreview(url: string) {
  try {
    const response = await axios.get(url);
    scrapper = cheerio.load(response.data);
    return {
      name: getDomain(url),
      title: getTitle(),
      icons: getFavIcons(),
    };
  } catch (error) {
    throw error;
  }
}
