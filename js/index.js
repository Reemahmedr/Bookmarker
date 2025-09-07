let siteName = document.getElementById("siteName");
let siteUrl = document.getElementById("siteUrl");
let submitBtn = document.getElementById("submitBtn");
let myModal = new bootstrap.Modal(document.getElementById("myModal"));
let updateBtn = document.getElementById("updateBtn");
let oldIndex;
let dark = document.getElementById("dark");
let light = document.getElementById("light");
let htmlTag = document.documentElement;

let siteRegex = {
  nameRegex: /^.{3,}$/,
  urlRegex: /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/,
};

let webSiteArray = [];
if (localStorage.getItem("webSite") != null) {
  webSiteArray = JSON.parse(localStorage.getItem("webSite"));
  display(webSiteArray);
}
submitBtn.addEventListener("click", function () {
  if (
    validateAllInputs(siteRegex.nameRegex, siteName) &&
    validateAllInputs(siteRegex.urlRegex, siteUrl)
  ) {
    let webSiteObj = {
      name: siteName.value.trim(),
      urlValue: siteUrl.value.trim(),
      isFavorite: false,
    };
    webSiteArray.push(webSiteObj);
    // console.log(webSiteArray);
    resetInputs();
    localStorage.setItem("webSite", JSON.stringify(webSiteArray));
    display(webSiteArray);
    Swal.fire({
      title: "Good job!",
      text: "Your website details have been added successfully",
      icon: "success",
    });
  } else {
    myModal.show();
  }
});

function resetInputs() {
  siteName.value = "";
  siteUrl.value = "";
  siteName.classList.remove("is-valid", "is-invalid");
  siteUrl.classList.remove("is-valid", "is-invalid");
}

function display(target) {
  let update = "";
  for (let i = 0; i < target.length; i++) {
    let isFavClass = target[i].isFavorite ? "d-none" : "";
    let isNotFavClass = target[i].isFavorite ? "" : "d-none";
    let domain = getDomain(target[i].urlValue);
    let favicon = `https://www.google.com/s2/favicons?domain=${domain}`;
    let currentIndex = webSiteArray.findIndex((item) => item === target[i]);
    update += `<tr>
        <td>
          ${i + 1}
          <i class="fa-regular fa-heart fav-icon ${isFavClass}" id="beforeClick-${currentIndex}" onclick="favouriteItem(${currentIndex})"></i>
          <i class="fa-solid fa-heart fav-icon ${isNotFavClass}" id="afterClick-${currentIndex}" onclick="favouriteItem(${currentIndex})"></i>
        </td>
        <td>
          <img class="me-2" src="${favicon}" alt="icon" width="20" height="20">
          ${target[i].name}
        </td>
        <td>
          <a class="btn text-light visit px-2" href="${
            target[i].urlValue
          }" target="_blank">
            <i class="fa-solid fa-eye"></i> Visit
          </a>
        </td>
        <td>
          <button class="btn text-light delete btn-warning px-2" onclick="updateInputs(${currentIndex})">
            <i class="fa-solid fa-repeat"></i> Update
          </button>
        </td>
        <td>
        <button class="btn text-light delete btn-danger px-2" onclick="deleteInputs(${currentIndex})">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </td>
      </tr>`;
  }

  document.getElementById("row").innerHTML = update;
}

function deleteInputs(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      webSiteArray.splice(index, 1);
      display(webSiteArray);
      localStorage.setItem("webSite", JSON.stringify(webSiteArray));
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}

// function validateNameInput() {
//   let nameValue = siteName.value.trim();
//   if (nameValue === "") {
//     siteName.classList.remove("is-valid", "is-invalid");
//     return false;
//   }
//   if (nameValue.length <= 2) {
//     siteName.classList.remove("is-valid");
//     siteName.classList.add("is-invalid");
//     return false;
//   } else {
//     siteName.classList.remove("is-invalid");
//     siteName.classList.add("is-valid");
//     return true;
//   }
// }
// function validateUrlInput() {
//   let urlValue = siteUrl.value.trim();
//   if (urlValue.trim() === "") {
//     siteUrl.classList.remove("is-valid", "is-invalid");
//     return false;
//   }
//   if (!regex.test(urlValue)) {
//     siteUrl.classList.remove("is-valid");
//     siteUrl.classList.add("is-invalid");
//     return false;
//   } else {
//     siteUrl.classList.remove("is-invalid");
//     siteUrl.classList.add("is-valid");
//     return true;
//   }
// }
function validateAllInputs(regex, input) {
  if(input.value==""){
    input.classList.remove("is-valid");
    input.classList.remove("is-invalid");
    return false;
  }
  if (regex.test(input.value.trim())) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    return false;
  }
}

function favouriteItem(index) {
  webSiteArray[index].isFavorite = !webSiteArray[index].isFavorite;
  let beforeClick = document.getElementById(`beforeClick-${index}`);
  let afterClick = document.getElementById(`afterClick-${index}`);
  if (webSiteArray[index].isFavorite) {
    beforeClick.classList.add("d-none");
    afterClick.classList.remove("d-none");
  } else {
    beforeClick.classList.remove("d-none");
    afterClick.classList.add("d-none");
  }
  localStorage.setItem("webSite", JSON.stringify(webSiteArray));
}

function filterFavorite() {
  let filtered = webSiteArray.filter((item) => item.isFavorite);
  display(filtered);
}

function showAll() {
  display(webSiteArray);
}

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function updateInputs(index) {
  siteName.value = webSiteArray[index].name;
  siteUrl.value = webSiteArray[index].urlValue;
  // console.log("hello");
  updateBtn.classList.remove("d-none");
  submitBtn.classList.add("d-none");
  oldIndex = index;
}

updateBtn.addEventListener("click", function () {
  if (
    validateAllInputs(siteRegex.nameRegex, siteName) &&
    validateAllInputs(siteRegex.urlRegex, siteUrl)
  ) {
    webSiteArray[oldIndex].name = siteName.value.trim();
    webSiteArray[oldIndex].urlValue = siteUrl.value.trim();
    display(webSiteArray);
    localStorage.setItem("webSite", JSON.stringify(webSiteArray));
    resetInputs();
    updateBtn.classList.add("d-none");
    submitBtn.classList.remove("d-none");
    Swal.fire({
      title: "Good job!",
      text: "Your website details have been updated successfully",
      icon: "success",
    });
  } else {
    myModal.show();
  }
});

function searchItems() {
  let value = document.getElementById("search").value.toLowerCase();
  let result = [];
  for (let i = 0; i < webSiteArray.length; i++) {
    if (webSiteArray[i].name.toLowerCase().includes(value)) {
      result.push(webSiteArray[i]);
    }
  }
  display(result);
}

dark.addEventListener("click", function () {
  htmlTag.setAttribute("data-theme", "dark");
  dark.classList.add("d-none");
  light.classList.remove("d-none");
  localStorage.setItem("theme", "dark");
});

light.addEventListener("click", function () {
  htmlTag.setAttribute("data-theme", "light");
  dark.classList.remove("d-none");
  light.classList.add("d-none");
  localStorage.setItem("theme", "light");
});

onload = function () {
  let savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    dark.classList.add("d-none");
    light.classList.remove("d-none");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    light.classList.add("d-none");
    dark.classList.remove("d-none");
  }
};
