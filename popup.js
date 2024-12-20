document.addEventListener("DOMContentLoaded", () => {
  const mainMenu = document.getElementById("mainMenu");
  const detailsSection = document.getElementById("detailsSection");
  const btnDetails = document.getElementById("btnDetails");
  const btnAutofill = document.getElementById("btnAutofill");
  const btnBack = document.getElementById("btnBack");
  const userDetailsForm = document.getElementById("userDetailsForm");
  const profileSelector = document.getElementById("profileSelector");
  const btnAddProfile = document.getElementById("btnAddProfile");
  const btnDeleteProfile = document.getElementById("btnDeleteProfile");

  let currentProfile = null;

  // Load profiles and populate dropdown
  function loadProfiles() {
    chrome.storage.local.get("profiles", ({ profiles }) => {
      profiles = profiles || {};
      profileSelector.innerHTML = "";

      // Populate dropdown
      Object.keys(profiles).forEach((profileName) => {
        const option = document.createElement("option");
        option.value = profileName;
        option.textContent = profileName;
        profileSelector.appendChild(option);
      });

      // Set current profile to the first profile
      if (Object.keys(profiles).length > 0) {
        currentProfile = profileSelector.value;
        populateFormDetails(); // Populate form for the current profile
      }
    });
  }

  // Populate form with details of the current profile
  function populateFormDetails() {
    if (!currentProfile) return;

    chrome.storage.local.get("profiles", ({ profiles }) => {
      const userDetails = profiles[currentProfile] || {};

      // Update form fields with userDetails
      document.getElementById("firstName").value = userDetails.firstName || "";
      document.getElementById("lastName").value = userDetails.lastName || "";
      document.getElementById("username").value = userDetails.username || "";
      document.getElementById("email").value = userDetails.email || "";
      document.getElementById("phone").value = userDetails.phone || "";
      document.getElementById("password").value = userDetails.password || "";
      document.getElementById("confirmAddress").value =
        userDetails.confirmAddress || "";
      document.getElementById("companyName").value =
        userDetails.companyName || "";
      document.getElementById("companyURL").value = userDetails.companyURL || "";
      document.getElementById("instagramLink").value =
        userDetails.instagramLink || "";
      document.getElementById("twitterLink").value =
        userDetails.twitterLink || "";
      document.getElementById("youtubeLink").value =
        userDetails.youtubeLink || "";
      document.getElementById("facebookLink").value =
        userDetails.facebookLink || "";
      document.getElementById("linkedinLink").value =
        userDetails.linkedinLink || "";
    });
  }

  // Add a new profile
  btnAddProfile.addEventListener("click", () => {
    const profileName = prompt("Enter new profile name:");
    if (!profileName) return;

    chrome.storage.local.get("profiles", ({ profiles }) => {
      profiles = profiles || {};

      if (profiles[profileName]) {
        alert("Profile name already exists!");
        return;
      }

      profiles[profileName] = {}; // Initialize profile
      chrome.storage.local.set({ profiles }, () => {
        alert("Profile added successfully!");
        loadProfiles();
      });
    });
  });

  // Delete the selected profile
  btnDeleteProfile.addEventListener("click", () => {
    if (!currentProfile) {
      alert("No profile selected!");
      return;
    }

    if (!confirm(`Are you sure you want to delete profile "${currentProfile}"?`))
      return;

    chrome.storage.local.get("profiles", ({ profiles }) => {
      delete profiles[currentProfile];
      chrome.storage.local.set({ profiles }, () => {
        alert("Profile deleted successfully!");
        loadProfiles();
      });
    });
  });

  // Save user details for the selected profile
  userDetailsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!currentProfile) {
      alert("No profile selected!");
      return;
    }

    const userDetails = {
      fullName: document.getElementById("fullName").value.trim(),
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      username: document.getElementById("username").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      password: document.getElementById("password").value.trim(),
      confirmPassword: document.getElementById("confirmPassword").value.trim(),
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city").value.trim(),
      country: document.getElementById("country").value.trim(),
      companyName: document.getElementById("companyName").value.trim(),
      companyURL: document.getElementById("companyURL").value.trim(),
      instagramLink: document.getElementById("instagramLink").value.trim(),
      twitterLink: document.getElementById("twitterLink").value.trim(),
      youtubeLink: document.getElementById("youtubeLink").value.trim(),
      facebookLink: document.getElementById("facebookLink").value.trim(),
      linkedinLink: document.getElementById("linkedinLink").value.trim(),
    };

    chrome.storage.local.get("profiles", ({ profiles }) => {
      profiles = profiles || {};
      profiles[currentProfile] = userDetails;

      chrome.storage.local.set({ profiles }, () => {
        alert("Details saved successfully for profile: " + currentProfile);
      });
    });
  });

  // Autofill details for the selected profile
  btnAutofill.addEventListener("click", () => {
    if (!currentProfile) {
      alert("No profile selected!");
      return;
    }
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: autofillDetails,
        args: [currentProfile], // Pass the selected profile to the injected script
      });
    });
  });


  function autofillDetails(profileName) {

    const fieldMappings = {
      firstName: ["first_name", "fname", "firstname", "givenname", "logusr", "reg_first_name"],
      lastName: ["last_name", "lname", "lastname", "surname", "reg_last_name"],
      username: ["username", "user_name", "uname", "reg_username", "reg_nickname", "nickname"],
      email: ["email", "email_address", "user_email", "reg_email"],
      phone: ["phone", "phone_number", "contact_number", "number"],
      password: ["password", "password1", "passwd", "user_password", "logpwd", "reg_password", "pass1"],
      confirmPassword: ["pass2", "confirm_password", "conf_pass", "user_confirm_password", "password2"],
      address: ["address", "user_address", "confirm_address"],
      companyName: ["company", "company_name", "org_name"],
      companyURL: ["website", "site_url", "company_url", "reg_website"],
      instagramLink: ["instagram", "instagram_link", "ig_link"],
      twitterLink: ["twitter", "twitter_link", "tw_link"],
      youtubeLink: ["youtube", "youtube_link", "yt_link"],
      facebookLink: ["facebook", "fb_link", "facebook_link", "fb"],
      linkedinLink: ["linkedin", "linkedin_link", "li_link"],
    };
  
    chrome.storage.local.get("profiles", ({ profiles }) => {
      const userDetails = profiles[profileName];
  
      if (!userDetails) {
        alert(`No details found for profile "${profileName}". Please save them first.`);
        return;
      }
  
      document.querySelectorAll("input, textarea").forEach((field) => {
        const fieldIdentifier = (field.name || field.id || field.placeholder || "").toLowerCase();
  
        for (const [key, aliases] of Object.entries(fieldMappings)) {
          if (aliases.includes(fieldIdentifier)) {
            field.value = userDetails[key] || "";
  
            // Trigger input events to ensure forms detect the change
            field.dispatchEvent(new Event("input", { bubbles: true }));
            field.dispatchEvent(new Event("change", { bubbles: true }));
            field.dispatchEvent(new Event("blur", { bubbles: true }));
            break;
          }
        }
      });
    });
  }

  // Update current profile and populate form on dropdown change
  profileSelector.addEventListener("change", () => {
    currentProfile = profileSelector.value;
    populateFormDetails();
  });

  // Show Details section and populate form
  btnDetails.addEventListener("click", () => {
    if (!currentProfile) {
      alert("No profile selected!");
      return;
    }

    mainMenu.style.display = "none";
    detailsSection.style.display = "block";
    populateFormDetails();
  });

  // Back button functionality
  btnBack.addEventListener("click", () => {
    mainMenu.style.display = "block";
    detailsSection.style.display = "none";
  });

  // Initial load
  loadProfiles();
});
