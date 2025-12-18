import { applyAffiliate } from '../utils/affiliateLinks.js';

const statusDiv = document.getElementById('status');
const generalList = document.getElementById('generalCoupons');
const productList = document.getElementById('productCoupons');
const activateBtn = document.getElementById('activate');

// Atualiza popup com dados do content script
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      // Retorna status, cupons gerais e de produto
      return new Promise(resolve => {
        const generalCoupons = window.generalCoupons || [];
        const productCoupons = window.productCoupons || [];
        const active = !!(generalCoupons.length || productCoupons.length);
        resolve({ active, generalCoupons, productCoupons });
      });
    }
  }).then(results => {
    const data = results[0].result;

    statusDiv.textContent = data.active
      ? "Cashback e afiliado ATIVO ✅"
      : "Não detectado no site ❌";

    // Popula listas de cupons
    generalList.innerHTML = data.generalCoupons.length
      ? data.generalCoupons.map(c => `<li>${c}</li>`).join("")
      : "<li>Nenhum cupom encontrado</li>";

    productList.innerHTML = data.productCoupons.length
      ? data.productCoupons.map(c => `<li>${c}</li>`).join("")
      : "<li>Nenhum cupom específico encontrado</li>";
  });
});

// Botão para aplicar cupons e links afiliados
activateBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      // Aplica links de afiliado em todos os links da página
      document.querySelectorAll("a").forEach(a => {
        a.href = window.applyAffiliate ? window.applyAffiliate(a.href) : a.href;
      });

      // Exibe alert pro usuário
      alert("Cupons e links de afiliado aplicados com sucesso! ✅");
      console.log("Cupons aplicados, links atualizados.");
    }
  });
});
