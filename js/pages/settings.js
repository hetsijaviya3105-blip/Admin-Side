document.addEventListener('DOMContentLoaded', function(){
    AdminAuth.requireAuth();
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn){ logoutBtn.addEventListener('click', AdminAuth.logout); }

    function load(){
        const s = Storage.get(Storage.keys.settings, {});
        document.getElementById('siteName').value = s.siteName||'';
        document.getElementById('aboutUs').value = s.aboutUs||'';
        document.getElementById('contactEmail').value = s.contactEmail||'';
        const social = s.social||{};
        document.getElementById('facebook').value = social.facebook||'';
        document.getElementById('instagram').value = social.instagram||'';
        document.getElementById('twitter').value = social.twitter||'';
        document.getElementById('youtube').value = social.youtube||'';

        const api = Storage.get(Storage.keys.api, {});
        document.getElementById('mealDbBase').value = api.mealDbBase||'';
        document.getElementById('youtubeApiKey').value = api.youtubeApiKey||'';
    }

    function saveSite(){
        const payload = {
            siteName: document.getElementById('siteName').value.trim(),
            aboutUs: document.getElementById('aboutUs').value.trim(),
            contactEmail: document.getElementById('contactEmail').value.trim(),
            social: {
                facebook: document.getElementById('facebook').value.trim(),
                instagram: document.getElementById('instagram').value.trim(),
                twitter: document.getElementById('twitter').value.trim(),
                youtube: document.getElementById('youtube').value.trim()
            }
        };
        Storage.set(Storage.keys.settings, payload);
        alert('Saved');
    }

    function saveApi(){
        const api = {
            mealDbBase: document.getElementById('mealDbBase').value.trim()||'https://www.themealdb.com/api/json/v1/1/',
            youtubeApiKey: document.getElementById('youtubeApiKey').value.trim()
        };
        Storage.set(Storage.keys.api, api);
        alert('API settings saved');
    }

    document.getElementById('saveSiteBtn').addEventListener('click', saveSite);
    document.getElementById('saveApiBtn').addEventListener('click', saveApi);
    load();
});


