// Constants
const API_URL =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
const ROWS_PER_PAGE = 10;

// Variables
let users = [];
let currentPage = 1;
let selectedUsers = [];

// DOM Elements
const userList = document.getElementById("userList");
const searchInput = document.getElementById("search");
const selectAllCheckbox = document.getElementById("selectAll");
const deleteSelectedButton = document.getElementById("deleteSelected");
const pagination = document.querySelector(".pagination");

// Fetch user data from the API
async function fetchUsers() {
  try {
    const response = await fetch(API_URL);
    users = await response.json();
    renderTable(currentPage);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Render the table with pagination
function renderTable(page) {
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const displayedUsers = users.slice(startIndex, endIndex);

  userList.innerHTML = "";

  displayedUsers.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td><input type="checkbox" class="selectUser" data-id="${user.id}"></td>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="editUser" data-id="${user.id}">Edit</button>
                <button class="deleteUser" data-id="${user.id}">Delete</button>
            </td>
        `;
    userList.appendChild(row);
  });

  renderPagination();
}

// Render pagination buttons
function renderPagination() {
  const totalPages = Math.ceil(users.length / ROWS_PER_PAGE);

  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderTable(currentPage);
    });
    pagination.appendChild(pageButton);
  }
}

// Search/filter users based on input
function searchUsers(query) {
  const filteredUsers = users.filter((user) => {
    return (
      user.id.includes(query) ||
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.role.toLowerCase().includes(query.toLowerCase())
    );
  });
  currentPage = 1; // Reset to first page after filtering
  renderTable(currentPage);
}

// Event listeners
searchInput.addEventListener("input", () => {
  searchUsers(searchInput.value);
});

selectAllCheckbox.addEventListener("change", () => {
  const selectUserCheckboxes = document.querySelectorAll(".selectUser");
  selectUserCheckboxes.forEach((checkbox) => {
    checkbox.checked = selectAllCheckbox.checked;
  });
  updateSelectedUsers();
});

userList.addEventListener("change", (event) => {
  if (event.target.classList.contains("selectUser")) {
    updateSelectedUsers();
  }
});

deleteSelectedButton.addEventListener("click", () => {
  deleteSelectedUsers();
});

// Update the selected users array based on checkboxes
function updateSelectedUsers() {
  selectedUsers = [];
  const selectUserCheckboxes = document.querySelectorAll(".selectUser");
  selectUserCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const userId = checkbox.getAttribute("data-id");
      selectedUsers.push(userId);
    }
  });
}

// Delete selected users
function deleteSelectedUsers() {
  users = users.filter((user) => !selectedUsers.includes(user.id));
  currentPage = 1; // Reset to first page after deleting
  renderTable(currentPage);
  clearSelection();
}

// Clear selection (uncheck checkboxes)
function clearSelection() {
  const selectUserCheckboxes = document.querySelectorAll(".selectUser");
  selectUserCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  selectAllCheckbox.checked = false;
  selectedUsers = [];
}

// Initialize the app
fetchUsers();
