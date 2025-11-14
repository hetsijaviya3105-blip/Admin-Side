document.addEventListener('DOMContentLoaded', function(){
    AdminAuth.requireAuth();
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn){ logoutBtn.addEventListener('click', AdminAuth.logout); }

    const recipes = Storage.get(Storage.keys.recipes, []);
    const users = Storage.get(Storage.keys.users, []);
    const analytics = Storage.get(Storage.keys.analytics, { ingredientSearchCounts:{} });

    const totalRecipes = recipes.length;
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status !== 'blocked').length;
    const totalFavorites = recipes.reduce((sum, r) => sum + (r.favorites || 0), 0);

    const statCards = document.getElementById('statCards');
    if(statCards){
        statCards.innerHTML = `
            <div class="col-6 col-lg-3">
                <div class="card text-bg-primary"><div class="card-body"><div class="fw-bold">Total Recipes</div><div class="fs-3">${totalRecipes}</div></div></div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="card text-bg-success"><div class="card-body"><div class="fw-bold">Active Users</div><div class="fs-3">${activeUsers}</div></div></div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="card text-bg-secondary"><div class="card-body"><div class="fw-bold">Total Users</div><div class="fs-3">${totalUsers}</div></div></div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="card text-bg-warning"><div class="card-body"><div class="fw-bold">Favorites</div><div class="fs-3">${totalFavorites}</div></div></div>
            </div>
        `;
    }

    const sortedByFav = [...recipes].sort((a,b)=> (b.favorites||0)-(a.favorites||0)).slice(0,5);
    const ctxPopular = document.getElementById('popularRecipesChart');
    if(ctxPopular){
        new Chart(ctxPopular, {
            type: 'bar',
            data: { labels: sortedByFav.map(r=>r.name), datasets: [{ label:'Favorites', data: sortedByFav.map(r=>r.favorites||0), backgroundColor:'#0d6efd' }] },
            options: { responsive:true, plugins:{ legend:{ display:false } } }
        });
    }

    const ingCounts = analytics.ingredientSearchCounts || {};
    const topIngredients = Object.entries(ingCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const ctxIng = document.getElementById('topIngredientsChart');
    if(ctxIng){
        new Chart(ctxIng, {
            type: 'doughnut',
            data: { labels: topIngredients.map(i=>i[0]), datasets: [{ label:'Searches', data: topIngredients.map(i=>i[1]) }] },
            options: { responsive:true }
        });
    }
});


