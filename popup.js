document.addEventListener("DOMContentLoaded", () => {
  const profileSelector = document.getElementById("profileSelector");

  // Load saved profiles from storage
  chrome.storage.local.get("profiles", ({ profiles }) => {
    if (profiles) {
      for (const profileName in profiles) {
        const option = document.createElement("option");
        option.value = profileName;
        option.textContent = profileName;
        profileSelector.appendChild(option);
      }
    }
  });

  profileSelector.addEventListener("change", (e) => {
    const selectedProfile = e.target.value;
    loadUserDetails(selectedProfile);
  });

  // Event listener for Details button
  document.getElementById("btnDetails").addEventListener("click", () => {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("detailsSection").style.display = "block";
  });

  // Go back to Main Menu
  document.getElementById("btnBack").addEventListener("click", () => {
    document.getElementById("detailsSection").style.display = "none";
    document.getElementById("mainMenu").style.display = "block";
  });

  // Save user details
  document.getElementById("userDetailsForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedProfile = profileSelector.value;

    const userDetails = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      username: document.getElementById("username").value,
      phone: document.getElementById("phone").value,
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

    // Save the user details under the selected profile
    chrome.storage.local.get("profiles", ({ profiles }) => {
      if (!profiles) {
        profiles = {};
      }

      profiles[selectedProfile] = userDetails;
      chrome.storage.local.set({ profiles }, () => {
        alert(`Details saved for profile: ${selectedProfile}`);
      });
    });
  });

  // Autofill event
  document.getElementById("btnAutofill").addEventListener("click", () => {
    const selectedProfile = profileSelector.value;

    chrome.storage.local.get("profiles", ({ profiles }) => {
      if (profiles && profiles[selectedProfile]) {
        autofillDetails(profiles[selectedProfile]);
      } else {
        alert("No details found. Please save a profile first.");
      }
    });
  });
});

// Load user details based on selected profile
function loadUserDetails(selectedProfile) {
  chrome.storage.local.get("profiles", ({ profiles }) => {
    if (profiles && profiles[selectedProfile]) {
      const userDetails = profiles[selectedProfile];
      document.getElementById("firstName").value = userDetails.firstName || "";
      document.getElementById("lastName").value = userDetails.lastName || "";
      document.getElementById("username").value = userDetails.username || "";
      document.getElementById("phone").value = userDetails.phone || "";
      document.getElementById("email").value = userDetails.email || "";
      document.getElementById("password").value = userDetails.password || "";
      document.getElementById("confirmAddress").value = userDetails.confirmAddress || "";
      document.getElementById("companyName").value = userDetails.companyName || "";
      document.getElementById("companyURL").value = userDetails.companyURL || "";
      document.getElementById("instagramLink").value = userDetails.instagramLink || "";
      document.getElementById("twitterLink").value = userDetails.twitterLink || "";
      document.getElementById("youtubeLink").value = userDetails.youtubeLink || "";
      document.getElementById("linkedinLink").value = userDetails.linkedinLink || "";
    } else {
      alert("No profile found.");
    }
  });
}

// Autofill function
function autofillDetails(userDetails) {
  document.querySelectorAll("input, textarea, select").forEach((field) => {
    const fieldIdentifier = (field.name || field.id || field.placeholder || "").toLowerCase();

    for (const [key, aliases] of Object.entries(fieldMappings)) {
      if (aliases.some(alias => fieldIdentifier.includes(alias))) {
        field.value = userDetails[key] || "";
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
        field.dispatchEvent(new Event("blur", { bubbles: true }));
        break;
      }
    }
  });
}

document.getElementById("loadDynamicDataBtn").addEventListener("click", () => {
  fetch("https://api.example.com/user-details")
    .then(response => response.json())
    .then(data => {
      const selectedProfile = profileSelector.value;
      chrome.storage.local.set({ [selectedProfile]: data }, () => {
        alert("Dynamic data loaded and saved!");
        loadUserDetails(selectedProfile);
      });
    })
    .catch(error => console.error("Error fetching dynamic data:", error));
});


// document.addEventListener("DOMContentLoaded", () => {
//   const mainMenu = document.getElementById("mainMenu");
//   const detailsSection = document.getElementById("detailsSection");

//   const btnDetails = document.getElementById("btnDetails");
//   const btnAutofill = document.getElementById("btnAutofill");
//   const btnBack = document.getElementById("btnBack");

//   // Show Details section
//   btnDetails.addEventListener("click", () => {
//     mainMenu.style.display = "none";
//     detailsSection.style.display = "block";
//     loadUserDetails();
//   });

//   // Go back to Main Menu
//   btnBack.addEventListener("click", () => {
//     detailsSection.style.display = "none";
//     mainMenu.style.display = "block";
//   });

//   document.getElementById("userDetailsForm").addEventListener("submit", (e) => {
//     e.preventDefault();

//     const userDetails = {
//       firstName: document.getElementById("firstName").value,
//       lastName: document.getElementById("lastName").value,
//       username: document.getElementById("username").value,
//       phone: document.getElementById("phone").value,
//       email: document.getElementById("email").value,
//       password: document.getElementById("password").value,
//       confirmAddress: document.getElementById("confirmAddress").value,
//       companyName: document.getElementById("companyName").value,
//       companyURL: document.getElementById("companyURL").value,
//       instagramLink: document.getElementById("instagramLink").value,
//       twitterLink: document.getElementById("twitterLink").value,
//       youtubeLink: document.getElementById("youtubeLink").value,
//       linkedinLink: document.getElementById("linkedinLink").value,
//     };

//     chrome.storage.local.set({ userDetails }, () => {
//       alert("Details saved!");
//     });
//   });

//   // Autofill Details button functionality
//   btnAutofill.addEventListener("click", () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.scripting.executeScript({
//         target: { tabId: tabs[0].id },
//         function: autofillDetails,
//       });
//     });
//   });

//   // Load saved user details into the form
//   function loadUserDetails() {
//     chrome.storage.local.get("userDetails", ({ userDetails }) => {
//       if (userDetails) {
//         document.getElementById("firstName").value = userDetails.firstName || "";
//         document.getElementById("lastName").value = userDetails.lastName || "";
//         document.getElementById("username").value = userDetails.userName || "";
//         document.getElementById("phone").value = userDetails.phone || "";
//         document.getElementById("email").value = userDetails.email || "";
//         document.getElementById("password").value = userDetails.password || "";
//         document.getElementById("confirmAddress").value = userDetails.confirmAddress || "";
//         document.getElementById("companyName").value = userDetails.companyName || "";
//         document.getElementById("companyURL").value = userDetails.companyURL || "";
//         document.getElementById("instagramLink").value = userDetails.instagramLink || "";
//         document.getElementById("twitterLink").value = userDetails.twitterLink || "";
//         document.getElementById("youtubeLink").value = userDetails.youtubeLink || "";
//         document.getElementById("linkedinLink").value = userDetails.linkedinLink || "";
//       }
//     });
//   }
// });

// function autofillDetails() {
//   const fieldMappings = {
//     fullName: ["full_name", "login", "pw"],
//     firstName: ["first_name", "fname", "firstname", "givenname", "logusr"],
//     lastName: ["last_name", "lname", "lastname", "surname"],
//     username: ["username", "user_name", "uname"],
//     email: ["email", "email_address", "user_email", "new_email"],
//     phone: ["phone", "phone_number", "contact_number"],
//     password: ["password", "passwd", "user_password", "logpwd"],
//     confirmAddress: ["address", "user_address", "confirm_address"],
//     companyName: ["company", "company_name", "org_name"],
//     companyURL: ["website", "site_url", "company_url"],
//     instagramLink: ["instagram", "instagram_link", "ig_link"],
//     twitterLink: ["twitter", "twitter_link", "tw_link"],
//     youtubeLink: ["youtube", "youtube_link", "yt_link"],
//     linkedinLink: ["linkedin", "linkedin_link", "li_link"],
//   };
  
//   chrome.storage.local.get("userDetails", ({ userDetails }) => {
//     if (userDetails) {
//       document.querySelectorAll("input, textarea").forEach((field) => {
//         // Combine name, id, and placeholder for matching
//         const fieldIdentifier = (field.name || field.id || field.placeholder || "").toLowerCase();

//         // Match against defined aliases
//         for (const [key, aliases] of Object.entries(fieldMappings)) {
//           if (aliases.includes(fieldIdentifier)) {
//             field.value = userDetails[key] || "";

//             field.dispatchEvent(new Event("input", {bubbles: true}));
//             field.dispatchEvent(new Event("input", { bubbles: true }));
//             field.dispatchEvent(new Event("change", { bubbles: true }));
//             field.dispatchEvent(new Event("blur", { bubbles: true }));
//             break;
//           }
//         }
//       });
//     } else {
//       alert("No details found. Please save them first.");
//     }
//   });
// }
