(function(){
    const STORAGE_KEYS = {
        admins: 'rf_admins',
        session: 'rf_admin_session',
        recipes: 'rf_recipes',
        categories: 'rf_categories',
        users: 'rf_users',
        analytics: 'rf_analytics',
        settings: 'rf_settings',
        api: 'rf_api'
    };

    function getItem(key, fallback){
        try{
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        }catch(e){
            return fallback;
        }
    }
    function setItem(key, value){
        localStorage.setItem(key, JSON.stringify(value));
    }

    function seedIfNeeded(){
        if(!getItem(STORAGE_KEYS.admins)){
            setItem(STORAGE_KEYS.admins, [
                { id:'admin-1', name:'Admin', email:'admin@example.com', password:'admin123' }
            ]);
        }
        if(!getItem(STORAGE_KEYS.categories)){
            setItem(STORAGE_KEYS.categories, [
                { id:'cat-1', name:'Breakfast' },
                { id:'cat-2', name:'Lunch' },
                { id:'cat-3', name:'Dinner' }
            ]);
        }
        if(!getItem(STORAGE_KEYS.recipes)){
            setItem(STORAGE_KEYS.recipes, [
                { id:'rec-1', name:'Pancakes', categoryId:'cat-1', ingredients:['Flour','Milk','Eggs'], instructions:'Mix and cook on skillet.', image:'', video:'', updatedAt: Date.now(), favorites: 12, searches: 20 },
                { id:'rec-2', name:'Grilled Sandwich', categoryId:'cat-2', ingredients:['Bread','Cheese','Tomato'], instructions:'Grill until golden.', image:'', video:'', updatedAt: Date.now(), favorites: 8, searches: 15 }
            ]);
        }
        if(!getItem(STORAGE_KEYS.users)){
            setItem(STORAGE_KEYS.users, [
                { id:'user-1', name:'Alice', email:'alice@example.com', status:'active', favorites:['rec-1'] },
                { id:'user-2', name:'Bob', email:'bob@example.com', status:'blocked', favorites:[] }
            ]);
        }
        if(!getItem(STORAGE_KEYS.analytics)){
            setItem(STORAGE_KEYS.analytics, {
                ingredientSearchCounts: { flour:5, chicken:9, cheese:7 }
            });
        }
        if(!getItem(STORAGE_KEYS.settings)){
            setItem(STORAGE_KEYS.settings, {
                siteName:'Recipe Finder', aboutUs:'Discover and save recipes you love.', contactEmail:'contact@example.com',
                social:{ facebook:'', instagram:'', twitter:'', youtube:'' }
            });
        }
        if(!getItem(STORAGE_KEYS.api)){
            setItem(STORAGE_KEYS.api, { mealDbBase:'https://www.themealdb.com/api/json/v1/1/', youtubeApiKey:'' });
        }
    }

    function generateId(prefix){
        return `${prefix}-${Math.random().toString(36).slice(2,8)}-${Date.now().toString(36)}`;
    }

    const Storage = {
        keys: STORAGE_KEYS,
        get: getItem,
        set: setItem,
        id: generateId,
        seedIfNeeded
    };

    window.Storage = Storage;
    seedIfNeeded();
})();


