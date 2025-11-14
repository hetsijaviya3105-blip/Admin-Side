document.addEventListener('DOMContentLoaded', function(){
    AdminAuth.requireAuth();
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn){ logoutBtn.addEventListener('click', AdminAuth.logout); }

    const tbody = document.querySelector('#categoriesTable tbody');
    const nameInput = document.getElementById('categoryName');
    const addBtn = document.getElementById('addCategoryBtn');

    function render(){
        const categories = Storage.get(Storage.keys.categories, []);
        tbody.innerHTML = categories.map(c=>`
            <tr>
                <td>
                    <input class="form-control form-control-sm" data-id="${c.id}" value="${c.name}">
                </td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${c.id}">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="2" class="text-center text-muted">No categories.</td></tr>';
    }

    function addCategory(){
        const name = (nameInput.value||'').trim();
        if(!name){ return; }
        const categories = Storage.get(Storage.keys.categories, []);
        categories.push({ id: Storage.id('cat'), name });
        Storage.set(Storage.keys.categories, categories);
        nameInput.value = '';
        render();
    }

    function deleteCategory(id){
        if(!confirm('Delete this category? Recipes using it will show blank category.')) return;
        const categories = Storage.get(Storage.keys.categories, []);
        Storage.set(Storage.keys.categories, categories.filter(c=>c.id!==id));
        render();
    }

    tbody.addEventListener('change', function(e){
        const input = e.target.closest('input[data-id]');
        if(!input) return;
        const id = input.getAttribute('data-id');
        const categories = Storage.get(Storage.keys.categories, []);
        const idx = categories.findIndex(c=>c.id===id);
        if(idx>-1){ categories[idx].name = input.value.trim(); Storage.set(Storage.keys.categories, categories); }
    });

    tbody.addEventListener('click', function(e){
        const btn = e.target.closest('button[data-action="delete"]');
        if(!btn) return;
        deleteCategory(btn.getAttribute('data-id'));
    });

    addBtn.addEventListener('click', addCategory);
    render();
});


