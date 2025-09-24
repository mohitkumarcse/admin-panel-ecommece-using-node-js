
// Helper to toggle collapse icon plus/dash
const toggleCollapseIcon = (collapseId, iconId) => {
  const collapseEl = document.getElementById(collapseId);
  const iconEl = document.getElementById(iconId);

  collapseEl.addEventListener("show.bs.collapse", () => {
    iconEl.classList.remove("bi-plus-square-fill");
    iconEl.classList.add("bi-dash-square-fill");
  });

  collapseEl.addEventListener("hide.bs.collapse", () => {
    iconEl.classList.remove("bi-dash-square-fill");
    iconEl.classList.add("bi-plus-square-fill");
  });
};

toggleCollapseIcon("account-collapse", "accountIcon");
toggleCollapseIcon("user-collapse", "userIcon");
