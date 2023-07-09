let myLeads = [];
const inputEl = node("#input-el");
const ulEl = node("#ul-el");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

/* eventListener */
node("#color-hex-btn").addEventListener("click", (e) => {
  const value = node("#color-picker").value;
  colorProcess(value, e.target);
});
node("#color-rgb-btn").addEventListener("click", (e) => {
  const hexValue = node("#color-picker").value;
  const r = parseInt(hexValue.slice(1, 3), 16);
  const g = parseInt(hexValue.slice(3, 5), 16);
  const b = parseInt(hexValue.slice(5, 7), 16);
  const rgbValue = `rgba(${r}, ${g}, ${b}, 1)`;
  colorProcess(rgbValue, e.target);
});

node("#tab-btn").addEventListener("click", () => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      myLeads.push(tabs[0].url);
      save("myLeads", myLeads);
      render(myLeads);
    }
  );
});
node("#delete-btn").addEventListener("dblclick", () => {
  localStorage.clear();
  myLeads = [];
  render(myLeads);
});
node("#input-btn").addEventListener("click", () => {
  process();
  save("myLeads", myLeads);
  render(myLeads);
});
inputEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    save("myLeads", myLeads);
    process();
    save("myLeads", myLeads);
    render(myLeads);
  }
});
ulEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("url-delete-btn")) {
    ulEl.removeChild(e.target.parentElement);
    const itemIndex = e.target.dataset.index;
    myLeads.splice(itemIndex, 1);
    save("myLeads", myLeads);
    render(myLeads);
  }
});

/* functions */
function node(str) {
  return document.querySelector(str);
}
function colorProcess(value, target) {
  navigator.clipboard.writeText(value + ";");
  target.style.background = value;
  setTimeout(() => (target.style.background = "transparent"), 300);
}
function process() {
  if (inputEl.value) {
    myLeads.push(inputEl.value);
    inputEl.value = "";
  }
}
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function render(leads) {
  let listItems = "";
  leads.forEach((lead, i) => {
    const isAddress = lead.indexOf("://");
    listItems += `
            <li>
                <button class="url-delete-btn" data-index=${i}> X </button>
                ${
                  isAddress !== -1
                    ? `<a target='_blank' href=${lead}>${lead}</a>`
                    : `<a>${lead}</a>`
                }
               
            </li>
        `;
  });
  ulEl.innerHTML = listItems;
}
