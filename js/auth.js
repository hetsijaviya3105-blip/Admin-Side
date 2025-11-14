(function(){
    const SESSION_KEY = 'rf_admin_session';

    function isAuthenticated(){
        return !!localStorage.getItem(SESSION_KEY);
    }

    function requireAuth(){
        if(!isAuthenticated()){
            window.location.replace('login.html');
        }
    }

    function login(email, password){
        const admins = window.Storage ? Storage.get(Storage.keys.admins, []) : [];
        const match = admins.find(a => a.email === email && a.password === password);
        if(match){
            localStorage.setItem(SESSION_KEY, JSON.stringify({ id: match.id, email: match.email, name: match.name }));
            return true;
        }
        return false;
    }

    function logout(){
        localStorage.removeItem(SESSION_KEY);
        window.location.replace('login.html');
    }

    function currentUser(){
        try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch(e) { return null; }
    }

    window.AdminAuth = { isAuthenticated, requireAuth, login, logout, currentUser };
})();


