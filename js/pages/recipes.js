document.addEventListener('DOMContentLoaded', function(){
    AdminAuth.requireAuth();
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn){ logoutBtn.addEventListener('click', AdminAuth.logout); }

    const tableBody = document.querySelector('#recipesTable tbody');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const clearFilters = document.getElementById('clearFilters');
    const addRecipeBtn = document.getElementById('addRecipeBtn');
    const saveRecipeBtn = document.getElementById('saveRecipeBtn');

    const recipeModalEl = document.getElementById('recipeModal');
    const recipeModal = recipeModalEl ? new bootstrap.Modal(recipeModalEl) : null;

    function loadCategories(){
        const cats = Storage.get(Storage.keys.categories, []);
        categoryFilter.innerHTML = '<option value="">All</option>' + cats.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
        const recipeCategory = document.getElementById('recipeCategory');
        if(recipeCategory){ recipeCategory.innerHTML = cats.map(c=>`<option value="${c.id}">${c.name}</option>`).join(''); }
    }

    function getFilters(){
        return { q: (searchInput.value||'').trim().toLowerCase(), cat: categoryFilter.value };
    }

    function filterRecipes(recipes){
        const { q, cat } = getFilters();
        return recipes.filter(r => {
            const matchesCat = !cat || r.categoryId === cat;
            const ingText = (r.ingredients||[]).join(' ').toLowerCase();
            const matchesQ = !q || r.name.toLowerCase().includes(q) || ingText.includes(q);
            return matchesCat && matchesQ;
        });
    }

    function render(){
        const cats = Storage.get(Storage.keys.categories, []);
        const catById = Object.fromEntries(cats.map(c=>[c.id, c.name]));
        const recipes = Storage.get(Storage.keys.recipes, []);
        const rows = filterRecipes(recipes).map(r=>{
            const ingShort = (r.ingredients||[]).slice(0,3).join(', ');
            const updated = new Date(r.updatedAt||Date.now()).toLocaleDateString();
            return `
                <tr>
                    <td>${r.name}</td>
                    <td>${catById[r.categoryId]||'-'}</td>
                    <td title="${(r.ingredients||[]).join(', ')}">${ingShort}${(r.ingredients||[]).length>3?'…':''}</td>
                    <td>${updated}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-2" data-action="edit" data-id="${r.id}">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${r.id}">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
        tableBody.innerHTML = rows || '<tr><td colspan="5" class="text-center text-muted">No recipes found.</td></tr>';
    }

    function clearForm(){
        document.getElementById('recipeId').value = '';
        document.getElementById('recipeName').value = '';
        document.getElementById('recipeCategory').value = '';
        document.getElementById('recipeIngredients').value = '';
        document.getElementById('recipeInstructions').value = '';
        document.getElementById('recipeImage').value = '';
        document.getElementById('recipeVideo').value = '';
        document.getElementById('recipeModalLabel').innerText = 'Add Recipe';
    }

    function openEdit(recipe){
        document.getElementById('recipeId').value = recipe.id;
        document.getElementById('recipeName').value = recipe.name;
        document.getElementById('recipeCategory').value = recipe.categoryId;
        document.getElementById('recipeIngredients').value = (recipe.ingredients||[]).join('\n');
        document.getElementById('recipeInstructions').value = recipe.instructions||'';
        document.getElementById('recipeImage').value = recipe.image||'';
        document.getElementById('recipeVideo').value = recipe.video||'';
        document.getElementById('recipeModalLabel').innerText = 'Edit Recipe';
        recipeModal && recipeModal.show();
    }

    function saveRecipe(){
        const id = document.getElementById('recipeId').value;
        const name = document.getElementById('recipeName').value.trim();
        const categoryId = document.getElementById('recipeCategory').value;
        const ingredients = document.getElementById('recipeIngredients').value.split('\n').map(s=>s.trim()).filter(Boolean);
        const instructions = document.getElementById('recipeInstructions').value.trim();
        const image = document.getElementById('recipeImage').value.trim();
        const video = document.getElementById('recipeVideo').value.trim();
        if(!name || !categoryId || ingredients.length===0 || !instructions){
            alert('Please fill in required fields.');
            return;
        }
        const recipes = Storage.get(Storage.keys.recipes, []);
        if(id){
            const idx = recipes.findIndex(r=>r.id===id);
            if(idx>-1){
                recipes[idx] = { ...recipes[idx], name, categoryId, ingredients, instructions, image, video, updatedAt: Date.now() };
            }
        } else {
            recipes.push({ id: Storage.id('rec'), name, categoryId, ingredients, instructions, image, video, updatedAt: Date.now(), favorites:0, searches:0 });
        }
        Storage.set(Storage.keys.recipes, recipes);
        recipeModal && recipeModal.hide();
        render();
    }

    function deleteRecipe(id){
        if(!confirm('Delete this recipe?')) return;
        const recipes = Storage.get(Storage.keys.recipes, []);
        const next = recipes.filter(r=>r.id!==id);
        Storage.set(Storage.keys.recipes, next);
        render();
    }

    tableBody.addEventListener('click', function(e){
        const btn = e.target.closest('button[data-action]');
        if(!btn) return;
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        const recipes = Storage.get(Storage.keys.recipes, []);
        const recipe = recipes.find(r=>r.id===id);
        if(action==='edit' && recipe){ openEdit(recipe); }
        if(action==='delete' && recipe){ deleteRecipe(recipe.id); }
    });

    addRecipeBtn.addEventListener('click', function(){ clearForm(); });
    saveRecipeBtn.addEventListener('click', saveRecipe);
    searchInput.addEventListener('input', render);
    categoryFilter.addEventListener('change', render);
    clearFilters.addEventListener('click', function(){ searchInput.value=''; categoryFilter.value=''; render(); });

    loadCategories();
    render();
});


