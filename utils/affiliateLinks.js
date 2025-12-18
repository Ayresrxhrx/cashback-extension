// Lista de afiliados com StoreID / Tracking ID reais (substitui pelos teus IDs)
export const affiliates = {
  amazon: {
    storeID: "SEU_AMAZON_STORE_ID",
    apply: url => {
      try {
        const newUrl = new URL(url);
        newUrl.searchParams.set("tag", "SEU_AMAZON_STORE_ID"); // Coloca teu StoreID real
        return newUrl.toString();
      } catch (err) {
        console.error("Erro ao aplicar link Amazon:", err, url);
        return url;
      }
    }
  },

  aliexpress: {
    storeID: "SEU_ALI_STORE_ID",
    apply: url => {
      // Adiciona código de afiliado da AliExpress
      return url.includes("?") ? `${url}&aff_fcid=SEU_ID` : `${url}?aff_fcid=SEU_ID`;
    }
  },

  ebay: {
    storeID: "SEU_EBAY_ID",
    apply: url => {
      return url.includes("?") ? `${url}&campid=SEU_ID` : `${url}?campid=SEU_ID`;
    }
  },

  shein: {
    storeID: "SEU_SHEIN_ID",
    apply: url => {
      return url.includes("?") ? `${url}&aff_fcid=SEU_ID` : `${url}?aff_fcid=SEU_ID`;
    }
  },

  temu: {
    storeID: "SEU_TEMU_ID",
    apply: url => {
      return url.includes("?") ? `${url}&aff_fcid=SEU_ID` : `${url}?aff_fcid=SEU_ID`;
    }
  },

  jumia: {
    storeID: "SEU_JUMIA_ID",
    apply: url => {
      return url.includes("?") ? `${url}&aff_fcid=SEU_ID` : `${url}?aff_fcid=SEU_ID`;
    }
  }
};

// Função auxiliar pra detectar o site pelo hostname
export function detectSiteByURL(url) {
  const hostname = new URL(url).hostname;
  if (hostname.includes("amazon.com")) return "amazon";
  if (hostname.includes("aliexpress.com")) return "aliexpress";
  if (hostname.includes("ebay.com")) return "ebay";
  if (hostname.includes("shein.com")) return "shein";
  if (hostname.includes("temu.com")) return "temu";
  if (hostname.includes("jumia.co.mz")) return "jumia";
  return null;
}

// Função para aplicar o afiliado automaticamente
export function applyAffiliate(url) {
  const site = detectSiteByURL(url);
  if (site && affiliates[site]) {
    return affiliates[site].apply(url);
  }
  return url; // Retorna o original se não for site suportado
}
