const imageSerials = [
  "vmk01", "vmk02", "vmk03", "vmk04", "vmk05", "vmk06", "vmk07", "vmk08", "vmk09",
  "vmk10", "vmk11", "vmk12", "vmk13", "vmk14", "vmk15", "vmk16", "vmk17", "vmk18", "vmk19",
  "vmk101", "vmk102", "vmk103", "vmk104", "vmk105", "vmk106", "vmk107", "vmk108", "vmk109"
];

function normalizeInput(input) {
  let clean = input.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

  // If empty or only 'vmk' or 'vmk0' etc., return as-is for partial search
  if (/^vmk\d{0,2}$/.test(clean)) {
    return clean;
  }

  // Handle just numbers like "1" or "09"
  if (/^\d{1,2}$/.test(clean)) {
    return "vmk" + clean.padStart(2, "0");
  }

  // Handle things like "mk1" => "vmk01"
  if (/^mk\d{1,2}$/.test(clean)) {
    return "v" + clean.padStart(5, "0");
  }

  // Handle things like "vmk101"
  if (/^v?m?k?\d{1,3}$/.test(clean)) {
    const digits = clean.replace(/\D/g, "");
    return "vmk" + digits.padStart(digits.length <= 2 ? 2 : 3, "0");
  }

  return clean;
}

function renderGallery(filter = "") {
  const userInput = normalizeInput(filter);
  const allContainers = document.querySelectorAll(".image-containers");

  allContainers.forEach(container => {
    const serial = container.dataset.serial || "";
    container.style.display = (serial.includes(userInput) || userInput === "") ? "block" : "none";
  });
}

function fillImages() {
  const imageContainer = document.getElementById("imageContainer");

  imageSerials.forEach(serial => {
    const outer = document.createElement("div");
    outer.className = "image-containers";
    outer.dataset.serial = serial;

    const inner = document.createElement("div");
    inner.className = serial;

    const placeholder = document.createElement("div");
    placeholder.className = "placeholder shimmer";

    const img = document.createElement("img");
    img.src = `https://ik.imagekit.io/KrishnanDoors/${serial}.webp`;
    img.srcset = `
      https://ik.imagekit.io/KrishnanDoors/${serial}.webp 480w,
      https://ik.imagekit.io/KrishnanDoors/${serial}.webp 768w,
      https://ik.imagekit.io/KrishnanDoors/${serial}.webp 1280w,
      https://ik.imagekit.io/KrishnanDoors/${serial}.webp 1920w`;
    img.sizes = "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw";
    img.alt = `Product ${serial}`;
    img.className = "rounded-2xl w-100 object-cover hover:brightness-105 transition";
    img.loading = "lazy";
    img.decoding = "async";

    img.addEventListener("load", () => {
      placeholder.remove(); // remove shimmer when image loads
    });

    const link = document.createElement("a");
    link.href = `https://ik.imagekit.io/KrishnanDoors/${serial}.webp`;
    link.target = "_blank";

    link.appendChild(img);
    inner.appendChild(placeholder);
    inner.appendChild(link);
    outer.appendChild(inner);
    imageContainer.appendChild(outer);
  });
}

function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  fillImages();
  renderGallery();

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", debounce(e => renderGallery(e.target.value), 200));
});
