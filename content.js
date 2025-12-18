import { affiliates } from './utils/affiliateLinks.js';

// Detecta qual site
function detectSite(url) {
  if (url.includes("amazon.com")) return "amazon";
  if (url.includes("aliexpress.com")) return "aliexpress";
  if (url.includes("ebay.com")) return "ebay";
  if (url.includes("shein.com")) return "shein";
  if (url.includes("temu.com")) return "temu";
  if (url.includes("jumia.co.mz")) return "jumia";
  return null;
}

// Aplica links de afiliado
function applyAffiliateLinks(site) {
  if (!site) return;
  document.querySelectorAll("a").forEach(a => {
    if (a.href.includes(site)) {
      a.href = affiliates[site].apply(a.href);
      console.log("Link atualizado:", a.href);
    }
  });
}

// Busca cupons na página inteira
function findCoupons(site) {
  const coupons = [];
  const regex = /(\bSAVE\d+\b|\b\d+OFF\b|\bCUPOM\b)/gi; // Exemplo de regex para cupons
  document.querySelectorAll("body *").forEach(el => {
    if (el.children.length === 0 && regex.test(el.innerText)) {
      coupons.push(el.innerText.trim());
    }
  });
  return [...new Set(coupons)]; // Remove duplicados
}

// Busca cupons relacionados ao produto
function findProductCoupons(site) {
  const productCoupons = [];
  const productTitle = document.querySelector("title")?.innerText || "";
  const regex = /(\bSAVE\d+\b|\b\d+OFF\b|\bCUPOM\b)/gi;
  document.querySelectorAll("body *").forEach(el => {
    if (el.children.length === 0 && regex.test(el.innerText)) {
      if (el.innerText.toLowerCase().includes(productTitle.toLowerCase().slice(0,10))) {
        productCoupons.push(el.innerText.trim());
      }
    }
  });
  return [...new Set(productCoupons)];
}

// SPA + scroll infinito
const observer = new MutationObserver(() => {
  const site = detectSite(window.location.href);
  applyAffiliateLinks(site);
  const coupons = findCoupons(site);
  const productCoupons = findProductCoupons(site);
  chrome.runtime.sendMessage({ type: "statusUpdate", active: true, coupons, productCoupons });
});

observer.observe(document.body, { childList: true, subtree: true });

// Primeira execução
const site = detectSite(window.location.href);
applyAffiliateLinks(site);
const coupons = findCoupons(site);
const productCoupons = findProductCoupons(site);
chrome.runtime.sendMessage({ type: "statusUpdate", active: true, coupons, productCoupons });
