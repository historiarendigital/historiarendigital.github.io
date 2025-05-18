let idx = null;
let documents = [];

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
  });

document.getElementById('searchBox').addEventListener('input', function () {
  const query = this.value;
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
});
