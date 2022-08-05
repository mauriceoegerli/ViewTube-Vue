// eslint-disable-next-line prefer-regex-literals
const urlRegex = new RegExp(
  String.raw`(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])`,
  'ig'
);
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('create-links', {
    created(el) {
      const text = el.textContent.trim();
      const htmlText = text.replace(urlRegex, match => {
        return `<a href="${match}" target="_blank" rel="noreferrer noopener">${match}</a>`;
      });
      el.innerHTML = htmlText;
    }
  });
});