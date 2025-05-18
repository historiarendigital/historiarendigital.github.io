document.addEventListener('DOMContentLoaded', () => {
  let idx = null;
  let documents = [];

  // Cargar el índice desde buscador.json
  fetch("buscador.json")
    .then(response => response.json())
    .then(data => {
      documents = data;

      idx = lunr(function () {
        this.ref('id');
        this.field('title');
        this.field('content');

        documents.forEach((doc, i) => {
          doc.id = i;
          this.add(doc);
        });
      });

      // Si hay un parámetro ?query en la URL, hacer la búsqueda automáticamente
      const params = new URLSearchParams(window.location.search);
      const initialQuery = params.get("query");

      const input = document.getElementById('searchBox');
      const resultBox = document.getElementById('searchResults');

      if (initialQuery) {
        input.value = initialQuery;
        runSearch(initialQuery);
      }

      // Escuchar mientras se escribe
      input.addEventListener('input', function () {
        runSearch(this.value);
      });
    });

  // Función de búsqueda reutilizable
  function runSearch(query) {
    const results = idx.search(query);
    const resultBox = document.getElementById('searchResults');
    resultBox.innerHTML = '';

    results.forEach(result => {
      const item = documents[result.ref];
      const li = document.createElement('li');
      li.innerHTML = `<strong><a href="${item.url}">${item.title}</a></strong><br><small>${item.content.slice(0, 100)}...</small>`;
      resultBox.appendChild(li);
    });

    if (results.length === 0 && query.length > 2) {
      resultBox.innerHTML = '<li>No se encontraron resultados.</li>';
    }
  }
});


