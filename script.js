// Global variables
let allJobs = [];
let selectedCountries = new Set(); // Хранит выбранные страны
let selectedStatuses = new Set(['В работе', 'Срочно']); // Хранит выбранные статусы, по умолчанию "В работе" и "Срочно"

// API URL
const API_URL = 'https://willi-work.emale.uno/job-matcher/all-data';
// Если возникнут проблемы с CORS, используй прокси:
// const API_URL = 'https://cors-anywhere.herokuapp.com/https://willi-work.emale.uno/job-matcher/all-data';

document.addEventListener('DOMContentLoaded', function() {
    loadJobs();
    setupCountryFilter();
    setupStatusFilter();
});

// Load jobs from API
async function loadJobs() {
    try {
        showLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allJobs = extractJobsFromData(data);
        updateCountryFilter();
        updateStatusFilter();
        filterJobs();
        showLoading(false);
    } catch (error) {
        console.error('Error loading jobs:', error);
        showLoading(false);
        showNoData();
    }
}

// Extract jobs from the complex API data structure
function extractJobsFromData(data) {
    const jobs = [];
    data.forEach(company => {
        if (company.employers) {
            company.employers.forEach(employer => {
                if (employer.countries) {
                    employer.countries.forEach(country => {
                        if (country.vacancies) {
                            country.vacancies.forEach(vacancy => {
                                if (vacancy.name) {
                                    // Проверяем, есть ли описание и статус не "Не указан"
                                    const hasDescription = vacancy.requirements || vacancy.comment || vacancy.exclusiveRequirements;
                                    const hasValidStatus = vacancy.status && vacancy.status !== 'Не указан';
                                    
                                    // Показываем только если есть описание ИЛИ статус не "Не указан"
                                    // И статус не "Выполнено"
                                    if ((hasDescription || hasValidStatus) && vacancy.status !== 'Выполнено') {
                                        jobs.push({
                                            // employer: employer.name || 'Не указан',
                                            jobName: vacancy.name,
                                            country: country.name,
                                            neto: vacancy.neto || '-',
                                            accommodation: vacancy.accommodation || '-',
                                            necessary: vacancy.necessary || '0',
                                            status: vacancy.status || 'Не указан',
                                            // details
                                            bruto: vacancy.bruto || '-',
                                            comment: vacancy.comment || '',
                                            requirements: vacancy.requirements || '',
                                            clothing: vacancy.clothing || '',
                                            accommodationPrice: vacancy.accommodationPrice || '',
                                            hoursPerMonth: vacancy.hoursPerMonth || '',
                                            exclusiveRequirements: vacancy.exclusiveRequirements || '',
                                            curator: vacancy.curator || '',
                                            homeAddr: vacancy.homeAddr || '',
                                            workAddr: vacancy.workAddr || ''
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    });
    return jobs;
}

// Setup country filter functionality
function setupCountryFilter() {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownContent = document.getElementById('dropdownContent');
    const selectAllCheckbox = document.getElementById('selectAllCountries');
    
    // Toggle dropdown
    dropdownButton.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
        dropdownButton.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdownContent.classList.remove('show');
        dropdownButton.classList.remove('active');
    });
    
    // Prevent dropdown from closing when clicking inside
    dropdownContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Select all functionality
    selectAllCheckbox.addEventListener('change', function() {
        const countryCheckboxes = document.querySelectorAll('.country-checkbox');
        countryCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
            if (this.checked) {
                selectedCountries.add(checkbox.value);
            } else {
                selectedCountries.delete(checkbox.value);
            }
        });
        updateSelectedCountriesText();
        filterJobs();
    });
}

// Setup status filter functionality
function setupStatusFilter() {
    const dropdownButton = document.getElementById('statusDropdownButton');
    const dropdownContent = document.getElementById('statusDropdownContent');
    const selectAllCheckbox = document.getElementById('selectAllStatuses');
    
    // Toggle dropdown
    dropdownButton.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
        dropdownButton.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdownContent.classList.remove('show');
        dropdownButton.classList.remove('active');
    });
    
    // Prevent dropdown from closing when clicking inside
    dropdownContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Select all functionality
    selectAllCheckbox.addEventListener('change', function() {
        const statusCheckboxes = document.querySelectorAll('.status-checkbox');
        statusCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
            if (this.checked) {
                selectedStatuses.add(checkbox.value);
            } else {
                selectedStatuses.delete(checkbox.value);
            }
        });
        updateSelectedStatusesText();
        filterJobs();
    });
}

// Update country filter with new countries from API
function updateCountryFilter() {
    const countries = [...new Set(allJobs.map(job => job.country))].sort();
    const countriesList = document.getElementById('countriesList');
    const selectAllCheckbox = document.getElementById('selectAllCountries');
    
    // Clear existing countries
    countriesList.innerHTML = '';
    
    // Add new countries
    countries.forEach(country => {
        const countryItem = document.createElement('label');
        countryItem.className = 'checkbox-container';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'country-checkbox';
        checkbox.value = country;
        checkbox.checked = selectedCountries.has(country) || selectedCountries.size === 0;
        
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        
        const countryText = document.createTextNode(country);
        
        countryItem.appendChild(checkbox);
        countryItem.appendChild(checkmark);
        countryItem.appendChild(countryText);
        
        // Add event listener
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedCountries.add(this.value);
            } else {
                selectedCountries.delete(this.value);
            }
            
            // Update select all checkbox
            const allCountryCheckboxes = document.querySelectorAll('.country-checkbox');
            const checkedCount = document.querySelectorAll('.country-checkbox:checked').length;
            selectAllCheckbox.checked = checkedCount === allCountryCheckboxes.length;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < allCountryCheckboxes.length;
            
            updateSelectedCountriesText();
            filterJobs();
        });
        
        countriesList.appendChild(countryItem);
    });
    
    // Initialize selected countries if empty
    if (selectedCountries.size === 0) {
        countries.forEach(country => selectedCountries.add(country));
        selectAllCheckbox.checked = true;
    }
    
    updateSelectedCountriesText();
}

// Update status filter with new statuses from API
function updateStatusFilter() {
    const statuses = [...new Set(allJobs.map(job => job.status))].sort();
    const statusesList = document.getElementById('statusesList');
    const selectAllCheckbox = document.getElementById('selectAllStatuses');
    
    // Clear existing statuses
    statusesList.innerHTML = '';
    
    // Add new statuses
    statuses.forEach(status => {
        const statusItem = document.createElement('label');
        statusItem.className = 'checkbox-container';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'status-checkbox';
        checkbox.value = status;
        checkbox.checked = selectedStatuses.has(status);
        
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        
        const statusText = document.createTextNode(status);
        
        statusItem.appendChild(checkbox);
        statusItem.appendChild(checkmark);
        statusItem.appendChild(statusText);
        
        // Add event listener
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedStatuses.add(this.value);
            } else {
                selectedStatuses.delete(this.value);
            }
            
            // Update select all checkbox
            const allStatusCheckboxes = document.querySelectorAll('.status-checkbox');
            const checkedCount = document.querySelectorAll('.status-checkbox:checked').length;
            selectAllCheckbox.checked = checkedCount === allStatusCheckboxes.length;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < allStatusCheckboxes.length;
            
            updateSelectedStatusesText();
            filterJobs();
        });
        
        statusesList.appendChild(statusItem);
    });
    
    // Update select all checkbox state
    const allStatusCheckboxes = document.querySelectorAll('.status-checkbox');
    const checkedCount = document.querySelectorAll('.status-checkbox:checked').length;
    selectAllCheckbox.checked = checkedCount === allStatusCheckboxes.length;
    selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < allStatusCheckboxes.length;
    
    updateSelectedStatusesText();
}

// Update the text showing selected countries
function updateSelectedCountriesText() {
    const selectedCountriesText = document.getElementById('selectedCountries');
    const countries = Array.from(selectedCountries);
    
    if (countries.length === 0) {
        selectedCountriesText.textContent = 'Нет выбранных стран';
    } else if (countries.length === 1) {
        selectedCountriesText.textContent = countries[0];
    } else if (countries.length <= 3) {
        selectedCountriesText.textContent = countries.join(', ');
    } else {
        selectedCountriesText.textContent = `${countries.length} стран выбрано`;
    }
}

// Update the text showing selected statuses
function updateSelectedStatusesText() {
    const selectedStatusesText = document.getElementById('selectedStatuses');
    const statuses = Array.from(selectedStatuses);
    
    if (statuses.length === 0) {
        selectedStatusesText.textContent = 'Нет выбранных статусов';
    } else if (statuses.length === 1) {
        selectedStatusesText.textContent = statuses[0];
    } else if (statuses.length <= 3) {
        selectedStatusesText.textContent = statuses.join(', ');
    } else {
        selectedStatusesText.textContent = `${statuses.length} статусов выбрано`;
    }
}

// Filter jobs based on selected countries and statuses
function filterJobs() {
    let filteredJobs = allJobs;
    
    // Filter by countries
    if (selectedCountries.size > 0) {
        filteredJobs = filteredJobs.filter(job => selectedCountries.has(job.country));
    }
    
    // Filter by statuses
    if (selectedStatuses.size > 0) {
        filteredJobs = filteredJobs.filter(job => selectedStatuses.has(job.status));
    }
    
    displayJobs(filteredJobs);
}

// Display jobs in the table (no filters, no modal, no employer/found columns, details inline)
function displayJobs(jobs) {
    const tbody = document.getElementById('jobsTableBody');
    tbody.innerHTML = '';
    if (jobs.length === 0) {
        showNoData();
        return;
    }
    jobs.forEach(job => {
        const row = document.createElement('tr');
        const statusClass = getStatusClass(job.status);
        const statusBadge = `<span class="status-badge ${statusClass}">${job.status}</span>`;
        row.innerHTML = `
            <td>${escapeHtml(job.jobName)}</td>
            <td>${escapeHtml(job.country)}</td>
            <td>${escapeHtml(job.neto)}</td>
            <td>${escapeHtml(job.accommodation)}</td>
            <td>${escapeHtml(job.necessary)}</td>
            <td>${statusBadge}</td>
            <td>${renderDetails(job)}</td>
        `;
        tbody.appendChild(row);
    });
    hideNoData();
}

function getStatusClass(status) {
    switch (status) {
        case 'Срочно':
            return 'status-urgent';
        case 'В работе':
            return 'status-working';
        case 'Выполнено':
            return 'status-completed';
        case 'На паузе':
            return 'status-paused';
        default:
            return 'status-default';
    }
}

function renderDetails(job) {
    let html = '';
    if (job.requirements) {
        html += `<div><b>Обязанности:</b> ${escapeHtml(job.requirements)}</div>`;
    }
    if (job.exclusiveRequirements) {
        html += `<div><b>Особые требования:</b> ${escapeHtml(job.exclusiveRequirements)}</div>`;
    }
    if (job.comment) {
        html += `<div><b>Комментарий:</b> ${escapeHtml(job.comment)}</div>`;
    }
    if (job.bruto && job.bruto !== '-') {
        html += `<div><b>Брутто:</b> ${escapeHtml(job.bruto)}</div>`;
    }
    if (job.clothing) {
        html += `<div><b>Одежда:</b> ${escapeHtml(job.clothing)}</div>`;
    }
    if (job.accommodationPrice) {
        html += `<div><b>Стоимость жилья:</b> ${escapeHtml(job.accommodationPrice)}</div>`;
    }
    if (job.hoursPerMonth) {
        html += `<div><b>Часов в месяц:</b> ${escapeHtml(job.hoursPerMonth)}</div>`;
    }
    if (job.homeAddr) {
        html += `<div><b>Домашний адрес:</b> ${escapeHtml(job.homeAddr)}</div>`;
    }
    if (job.workAddr) {
        html += `<div><b>Рабочий адрес:</b> ${escapeHtml(job.workAddr)}</div>`;
    }
    if (!html) {
        html = '<span style="color:#aaa">—</span>';
    }
    return html;
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    const tableContainer = document.querySelector('.table-container');
    if (show) {
        loading.style.display = 'flex';
        tableContainer.style.display = 'none';
    } else {
        loading.style.display = 'none';
        tableContainer.style.display = 'block';
    }
}

function showNoData() {
    const noData = document.getElementById('noData');
    const tableContainer = document.querySelector('.table-container');
    noData.style.display = 'flex';
    tableContainer.style.display = 'none';
}

function hideNoData() {
    const noData = document.getElementById('noData');
    const tableContainer = document.querySelector('.table-container');
    noData.style.display = 'none';
    tableContainer.style.display = 'block';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-refresh data every 5 minutes
setInterval(() => {
    loadJobs();
}, 5 * 60 * 1000); 