const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const initMenu = () => {
  const header = qs("[data-header]");
  const toggle = qs("[data-menu-toggle]");
  const nav = qs("[data-nav]");

  if (!header || !toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.dataset.open = open ? "true" : "false";
  };

  setOpen(false);

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setOpen(open);
  });

  nav.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.tagName.toLowerCase() !== "a") return;
    setOpen(false);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (header.contains(target)) return;
    setOpen(false);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setOpen(false);
  });
};

const initYear = () => {
  const year = qs("[data-year]");
  if (!year) return;
  year.textContent = String(new Date().getFullYear());
};

const initContactForm = () => {
  const form = qs("[data-contact-form]");
  if (!(form instanceof HTMLFormElement)) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fd = new FormData(form);
    const nome = String(fd.get("nome") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const telefone = String(fd.get("telefone") || "").trim();
    const mensagem = String(fd.get("mensagem") || "").trim();

    const to = "contabil@msousacontabil.com.br";
    const subject = encodeURIComponent(`Contato pelo site — ${nome || "Sem nome"}`);
    const body = encodeURIComponent(
      [
        `Nome: ${nome}`,
        `E-mail: ${email}`,
        telefone ? `Telefone: ${telefone}` : null,
        "",
        "Mensagem:",
        mensagem,
      ]
        .filter(Boolean)
        .join("\n")
    );

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
};

const initConsultaSearch = () => {
  const input = qs("[data-consulta-search]");
  const grid = qs("[data-consulta-grid]");
  if (!(input instanceof HTMLInputElement) || !(grid instanceof HTMLElement)) return;

  const items = qsa("li", grid);

  const normalize = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const render = () => {
    const term = normalize(input.value);
    const showAll = term.length === 0;

    items.forEach((li) => {
      const text = normalize(li.textContent || "");
      const visible = showAll ? true : text.includes(term);
      li.style.display = visible ? "" : "none";
    });

    qsa("article", grid).forEach((article) => {
      const anyVisible = qsa("li", article).some((li) => li.style.display !== "none");
      article.style.display = anyVisible ? "" : "none";
    });
  };

  input.addEventListener("input", render);
};

const initActiveNav = () => {
  const nav = qs("[data-nav]");
  if (!nav) return;

  const currentFile = (() => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const last = parts.at(-1) || "";
    return last === "" ? "index.html" : last;
  })();

  qsa("a", nav).forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }

    const cleanHref = href.split("?")[0].split("#")[0].replace(/^\.\//, "");
    const isHomeHref = cleanHref === "" || cleanHref === "index.html";
    const isCurrent = isHomeHref ? currentFile === "index.html" : cleanHref === currentFile;

    if (isCurrent) {
      a.setAttribute("aria-current", "page");
    } else {
      a.removeAttribute("aria-current");
    }
  });
};

initMenu();
initYear();
initContactForm();
initConsultaSearch();
initActiveNav();
