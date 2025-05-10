export default function fetchJsonp(url, callbackName) {
  return new Promise((resolve, reject) => {
    // Kreiramo novi <script> element
    const script = document.createElement('script');
    // Sastavljamo pun URL sa JSONP parametrima
    const fullUrl = `${url}&output=jsonp&callback=${callbackName}`;
    script.src = fullUrl;
    script.async = true;

    // Definišemo globalnu JSONP callback funkciju
    window[callbackName] = (data) => {
      resolve(data);                           // Prosleđujemo dobijene podatke
      delete window[callbackName];             // Brišemo callback iz globalnog prostora
      document.body.removeChild(script);       // Uklanjamo <script> iz dokumenta
    };

    // Obrada greške pri učitavanju JSONP zahteva
    script.onerror = () => {
      reject(new Error(`JSONP request to ${fullUrl} failed`));
      delete window[callbackName];             
      document.body.removeChild(script);       
    };

    // Dodajemo <script> u DOM da bi se izvršio JSONP poziv
    document.body.appendChild(script);
  });
}
