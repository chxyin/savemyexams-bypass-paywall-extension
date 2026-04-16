const blockedKeys = [
  "SME.topic-question-part-solution-views",
  "SME.revision-note-views"
];

// 1. Intercept all attempts the website makes to read/write to storage
const originalGetItem = Storage.prototype.getItem;
const originalSetItem = Storage.prototype.setItem;

Storage.prototype.getItem = function(key) {
  if (blockedKeys.includes(key)) {
    return null; // Pretend the user has never viewed anything
  }
  return originalGetItem.apply(this, arguments);
};

Storage.prototype.setItem = function(key, value) {
  if (blockedKeys.includes(key)) {
    return; // Block the website from saving new views completely
  }
  return originalSetItem.apply(this, arguments);
};

// 2. Clear any existing data in both local and session storage instantly
blockedKeys.forEach(key => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
});

// 3. Keep an aggressive backup intervals just in case they bypass the interceptor
setInterval(() => {
  blockedKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}, 50);