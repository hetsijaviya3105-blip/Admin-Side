document.addEventListener('DOMContentLoaded', function(){
    AdminAuth.requireAuth();
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn){ logoutBtn.addEventListener('click', AdminAuth.logout); }

    const tbody = document.querySelector('#usersTable tbody');
    const searchInput = document.getElementById('userSearch');
    const clearBtn = document.getElementById('clearUserSearch');

    function filterUsers(users){
        const q = (searchInput.value||'').trim().toLowerCase();
        if(!q) return users;
        return users.filter(u => (u.name||'').toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q));
    }

    function render(){
        const users = Storage.get(Storage.keys.users, []);
        tbody.innerHTML = filterUsers(users).map(u=>`
            <tr>
                <td>${u.name||'-'}</td>
                <td>${u.email||'-'}</td>
                <td><span class="badge ${u.status==='blocked'?'text-bg-danger':'text-bg-success'}">${u.status||'active'}</span></td>
                <td>${(u.favorites||[]).length}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-secondary me-2" data-action="toggle" data-id="${u.id}">${u.status==='blocked'?'Unblock':'Block'}</button>
                    <button class="btn btn-sm btn-outline-danger" data-action="remove" data-id="${u.id}">Remove</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="text-center text-muted">No users found.</td></tr>';
    }

    function toggleUser(id){
        const users = Storage.get(Storage.keys.users, []);
        const idx = users.findIndex(u=>u.id===id);
        if(idx>-1){
            users[idx].status = users[idx].status==='blocked' ? 'active' : 'blocked';
            Storage.set(Storage.keys.users, users);
            render();
        }
    }

    function removeUser(id){
        if(!confirm('Remove this user?')) return;
        const users = Storage.get(Storage.keys.users, []);
        Storage.set(Storage.keys.users, users.filter(u=>u.id!==id));
        render();
    }

    tbody.addEventListener('click', function(e){
        const btn = e.target.closest('button[data-action]');
        if(!btn) return;
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        if(action==='toggle'){ toggleUser(id); }
        if(action==='remove'){ removeUser(id); }
    });

    searchInput.addEventListener('input', render);
    clearBtn.addEventListener('click', function(){ searchInput.value=''; render(); });
    render();
});


