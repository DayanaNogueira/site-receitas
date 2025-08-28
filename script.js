const recipes = [
  {
    id: 1,
    name: "Macarrão ao molho branco",
    category: "massas",
    time: 25,
    description: "Cremoso e delicioso",
    image: "https://static.itdg.com.br/images/640-400/bc528efbf3b8577477cc9eda0adf25d7/326681-original.jpg",
    ingredients: ["1 pacote de macarrão","água","sal","óleo","camarão","caldo de camarão","azeite","cebola","alho","leite","cheiro-verde","creme de leite","queijo provolone","salsa"],
    instructions: ["Cozinhe o macarrão","Refogue cebola e alho","Adicione leite e creme","Misture ao macarrão"]
  },
  {
    id: 2,
    name: "Frango Xadrez",
    category: "aves",
    time: 20,
    description: "Saboroso e colorido",
    image: "https://static.itdg.com.br/images/640-400/8785ec793599557587d51a0b7483eb0a/344249-original.jpg",
    ingredients: ["Frango","Pimentão","Molho shoyu"],
    instructions: ["Corte o frango","Refogue legumes","Misture tudo"]
  },
  {
    id: 3,
    name: "Mousse de Limão",
    category: "sobremesa",
    time: 15,
    description: "Fresco e perfeito",
    image: "https://static.itdg.com.br/images/640-400/6316848e0a847c086931db672b45fcb7/shutterstock-1949230144-1-1-.jpg",
    ingredients: ["Leite condensado","Limão","Creme de leite"],
    instructions: ["Bata tudo no liquidificador","Leve à geladeira","Sirva gelado"]
  }
];

const recipeGrid = document.getElementById('recipeGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.getElementById('filterButtons');
const recipeDetailsSection = document.getElementById('recipeDetailsSection');
const detailsContent = document.getElementById('detailsContent');
const backButton = document.getElementById('backButton');
const resultCount = document.getElementById('resultCount');
const sortSelect = document.getElementById('sortSelect');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentFilter = 'all';

function isFavorite(id) { return favorites.includes(id); }

function toggleFavorite(id) {
  if(isFavorite(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayRecipes(filteredAndSortedRecipes());
}

function filteredAndSortedRecipes() {
  let filtered = recipes.filter(r => currentFilter === 'all' || (currentFilter === 'favoritos' ? isFavorite(r.id) : r.category === currentFilter));
  const search = searchInput.value.toLowerCase();
  if(search) filtered = filtered.filter(r => r.name.toLowerCase().includes(search));

  // Ordenação
  const sort = sortSelect.value;
  if(sort === 'name-asc') filtered.sort((a,b) => a.name.localeCompare(b.name));
  else if(sort === 'time-asc') filtered.sort((a,b) => a.time - b.time);
  else if(sort === 'time-desc') filtered.sort((a,b) => b.time - a.time);

  return filtered;
}

function displayRecipes(list) {
  recipeGrid.innerHTML = '';
  if(list.length === 0) {
    recipeGrid.innerHTML = '<p class="no-results">Nenhuma receita encontrada 😢</p>';
    resultCount.textContent = '0 receitas';
    return;
  }
  resultCount.textContent = `${list.length} receita(s)`;
  list.forEach(r => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <img src="${r.image}" alt="${r.name}">
      <div class="recipe-info">
        <h3>${r.name}</h3>
        <p>${r.description}</p>
        <span class="fav-btn" data-id="${r.id}">${isFavorite(r.id) ? "❤️" : "🤍"}</span>
      </div>
    `;
    card.querySelector('.fav-btn').addEventListener('click', e => { 
      e.stopPropagation(); 
      toggleFavorite(r.id); 
    });
    card.addEventListener('click', () => showRecipeDetails(r));
    recipeGrid.appendChild(card);
  });
}

function showRecipeDetails(r) {
  recipeDetailsSection.style.display = 'block';
  recipeGrid.style.display = 'none';

  // Monta lista de ingredientes com input de porções
  detailsContent.innerHTML = `
    <h2>${r.name}</h2>
    <img src="${r.image}" alt="${r.name}">
    <div class="serving-size">
      <label>Porções:</label>
      <input type="number" id="portionInput" value="1" min="1">
    </div>
    <h3>Ingredientes</h3>
    <ul id="ingredientsList">${r.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
    <h3>Modo de preparo</h3>
    <ul>${r.instructions.map(i => `<li>${i}</li>`).join('')}</ul>
  `;

  // Ajusta ingredientes conforme porções
  const portionInput = document.getElementById('portionInput');
  portionInput.addEventListener('input', () => {
    const factor = portionInput.value;
    const ul = document.getElementById('ingredientsList');
    ul.innerHTML = r.ingredients.map(i => `<li>${i} x${factor}</li>`).join('');
  });
}

backButton.addEventListener('click', () => {
  recipeDetailsSection.style.display = 'none';
  recipeGrid.style.display = 'grid';
});

searchInput.addEventListener('input', () => displayRecipes(filteredAndSortedRecipes()));

filterButtons.addEventListener('click', e => {
  if(!e.target.classList.contains('filter-btn')) return;
  currentFilter = e.target.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  displayRecipes(filteredAndSortedRecipes());
});

sortSelect.addEventListener('change', () => displayRecipes(filteredAndSortedRecipes()));

// Compartilhar e imprimir
document.querySelector('.whatsapp').addEventListener('click', () => {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://wa.me/?text=${url}`, '_blank');
});
document.querySelector('.instagram').addEventListener('click', () => {
  alert('Compartilhar no Instagram não é funcional via web direto.');
});
document.querySelector('.print').addEventListener('click', () => window.print());

displayRecipes(recipes);