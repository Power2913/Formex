document.addEventListener("DOMContentLoaded", () => {
  const mainMenu = document.getElementById("mainMenu");
  const detailsSection = document.getElementById("detailsSection");

  const btnDetails = document.getElementById("btnDetails");
  const btnAutofill = document.getElementById("btnAutofill");
  const btnBack = document.getElementById("btnBack");

  // Show Details section
  btnDetails.addEventListener("click", () => {
    mainMenu.style.display = "none";
    detailsSection.style.display = "block";
    loadUserDetails();
  });

  // Go back to Main Menu
  btnBack.addEventListener("click", () => {
    detailsSection.style.display = "none";
    mainMenu.style.display = "block";
  });

  // Save user details
  document.getElementById("userDetailsForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const userDetails = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      confirmAddress: document.getElementById("confirmAddress").value,
      companyName: document.getElementById("companyName").value,
      companyURL: document.getElementById("companyURL").value,
      instagramLink: document.getElementById("instagramLink").value,
      twitterLink: document.getElementById("twitterLink").value,
      youtubeLink: document.getElementById("youtubeLink").value,
      linkedinLink: document.getElementById("linkedinLink").value,
    };

    chrome.storage.local.set({ userDetails }, () => {
      alert("Details saved!");
    });
  });

  // Autofill Details button functionality
  btnAutofill.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: autofillDetails,
      });
    });
  });

  // Load saved user details into the form
  function loadUserDetails() {
    chrome.storage.local.get("userDetails", ({ userDetails }) => {
      if (userDetails) {
        document.getElementById("firstName").value = userDetails.firstName || "";
        document.getElementById("lastName").value = userDetails.lastName || "";
        document.getElementById("email").value = userDetails.email || "";
        document.getElementById("password").value = userDetails.password || "";
        document.getElementById("confirmAddress").value = userDetails.confirmAddress || "";
        document.getElementById("companyName").value = userDetails.companyName || "";
        document.getElementById("companyURL").value = userDetails.companyURL || "";
        document.getElementById("instagramLink").value = userDetails.instagramLink || "";
        document.getElementById("twitterLink").value = userDetails.twitterLink || "";
        document.getElementById("youtubeLink").value = userDetails.youtubeLink || "";
        document.getElementById("linkedinLink").value = userDetails.linkedinLink || "";
      }
    });
  }
});

// Autofill script injected into the active tab
function autofillDetails() {
  chrome.storage.local.get("userDetails", ({ userDetails }) => {
    if (userDetails) {
      document.querySelectorAll("input, textarea").forEach((field) => {
        if (userDetails[field.name]) {
          field.value = userDetails[field.name];
        }
      });
    } else {
      alert("No details found. Please save them first.");
    }
  });
}
