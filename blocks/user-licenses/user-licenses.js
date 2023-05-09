import { getEnvironmentConfig } from '../../scripts/zemax-config.js';

export default async function decorate(block) {
  
  var userId = localStorage.getItem('auth0_id');
  var accessToken = localStorage.getItem('accessToken');
  var DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;

  if( userId == null || userId == undefined || accessToken == null || accessToken == undefined){
    window.location.assign(`${window.location.origin}`)
  } else{
    await fetch(DYNAMIC_365_DOMAIN + 'dynamics_get_licenses_by_auth0id?auth0_id=' + userId, {
      method: 'GET',
      headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "bearer " + accessToken
      },
    }).then(async function(response){
      let data = await response.json();
      let licenseTableHeadingMapping = createTableHeaderMapping(data);

      //Render tab headings
      licenseTableHeadingMapping.forEach(function(heading, index){
        if(index === 0){
           block.append(createTabButton(true, `tab${index + 1}`, 'false', heading.split('|')[0]));
        }else{
          block.append(createTabButton(false, `tab${index + 1}`, 'true', heading.split('|')[0]));
        }
      });

      //Render tab content
      licenseTableHeadingMapping.forEach(function(heading, index){
        if(index === 0){
           block.append(createContentDiv(`tab${index + 1}`, `tab${index + 1}-button`, false, createLicencesTable(data[heading.split('|')[1]]).outerHTML));
        } else{
          block.append(createContentDiv(`tab${index + 1}`, `tab${index + 1}-button`, true, createLicencesTable(data[heading.split('|')[1]]).outerHTML));
        }
      });
      
      addTabFeature();

    }).catch(function(err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
  }

  function createTableHeaderMapping(data){
    let tableHeaderMapping = [];
    
    if(data.my_licenses_admin != undefined && data.my_licenses_admin.length > 0){
      tableHeaderMapping.push('My Licenses (Admin)|my_licenses_admin');
    }

    if(data.my_licenses != undefined && data.my_licenses.length > 0){
      tableHeaderMapping.push('My Licenses (End User)|my_licenses');
    }

    if(data.company_licenses != undefined && data.company_licenses.length > 0){
      tableHeaderMapping.push('Company Licenses|company_licenses');
    }

    if(data.academic_licenses != undefined && data.academic_licenses.length > 0){
      tableHeaderMapping.push('Academic Licenses|academic_licenses');
    }

    if(data.academic_esp_licenses != undefined && data.academic_esp_licenses.length > 0){
      tableHeaderMapping.push('Academic ESP Licenses|academic_esp_licenses');
    }
    return tableHeaderMapping;
  }

  function createTabButton(isActive, ariaControls, isSelected, tabText){
      let button = document.createElement('button');
      button.classList.add('tab-link');
      if(isActive){
        button.classList.add('active');
      }
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', ariaControls);
      button.setAttribute('aria-selected', isSelected);
      button.textContent = tabText;

      return button;
  }

  function createContentDiv(tabId, ariaLabelBy, isHidden, content){
    let div = document.createElement('div');
    div.setAttribute('id', tabId);
    div.classList.add('tab-content');
    div.setAttribute('role', 'tabpanel');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-labelledby', ariaLabelBy);
    div.innerHTML = content;
    if(isHidden){
      div.setAttribute('hidden', '');
    }
   
    return div;
  }

  function createLicencesTable(rows){
      let tableElement = document.createElement('table');
      let thead = document.createElement('thead');
      let tr = document.createElement('tr');

      //TODO add logic
      let manageOrViewHeading = document.createElement('th');
      tr.appendChild(manageOrViewHeading);

      let tableHeadingStatus = document.createElement('th');
      tableHeadingStatus.innerHTML = 'Status';
      tr.appendChild(tableHeadingStatus);

      let tableHeadingSupportExpiry = document.createElement('th');
      tableHeadingSupportExpiry.innerHTML = 'Support Expiry';
      tr.appendChild(tableHeadingSupportExpiry);

      let tableHeadingLicenseId = document.createElement('th');
      tableHeadingLicenseId.innerHTML = 'License #';
      tr.appendChild(tableHeadingLicenseId);

      let tableHeadingNickName = document.createElement('th');
      tableHeadingNickName.innerHTML = 'Nickname';
      tr.appendChild(tableHeadingNickName);

      let tableHeadingProduct = document.createElement('th');
      tableHeadingProduct.innerHTML = 'Product';
      tr.appendChild(tableHeadingProduct);

      let tableHeadingLicenseType = document.createElement('th');
      tableHeadingLicenseType.innerHTML = 'License Type';
      tr.appendChild(tableHeadingLicenseType);

      let tableHeadingSeatCount = document.createElement('th');
      tableHeadingSeatCount.innerHTML = 'Seat Count';
      tr.appendChild(tableHeadingSeatCount);

      let tableHeadingEndUserCount = document.createElement('th');
      tableHeadingEndUserCount.innerHTML = 'End User Count';
      tr.appendChild(tableHeadingEndUserCount);

      let tableHeadingAdmistrator = document.createElement('th');
      tableHeadingAdmistrator.innerHTML = 'Administrator';
      tr.appendChild(tableHeadingAdmistrator);

      thead.appendChild(tr);
      tableElement.appendChild(thead);

      let tbody = document.createElement('tbody');

      rows.forEach(function(row){
        let tr = document.createElement('tr');
        let tdManageOrView = document.createElement('td');
        let manageOrViewButton = document.createElement('button');
        manageOrViewButton.classList.add('manage-view-license');
        manageOrViewButton.innerText = 'Manage';
        manageOrViewButton.setAttribute('type', 'button');
        tdManageOrView.appendChild(manageOrViewButton);
        tr.appendChild(tdManageOrView);

        let tdLicenseStatus = document.createElement('td');
        
        const date = new Date(row.new_supportexpires);

        // subtract one day from the date
        date.setDate(date.getDate() - 1);

        // format the resulting date into the desired string format
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const supportExpiryDate = date.toLocaleDateString('en-US', options);
        let licenseActive = 'Expired';
 
        if(date.getTime() > Date.now()){
          licenseActive = 'Active';
        }
        tdLicenseStatus.innerText = licenseActive;
        tr.appendChild(tdLicenseStatus)

        let tdLicenseSupportExpiry = document.createElement('td');
        tdLicenseSupportExpiry.innerText = supportExpiryDate;
        tr.appendChild(tdLicenseSupportExpiry);

        let tdLicenseId = document.createElement('td');
        tdLicenseId.innerText = row.new_licenseid;
        tr.appendChild(tdLicenseId);

        let tdLicenseNickname = document.createElement('td');
        if(row.zemax_nickname != undefined){
         tdLicenseNickname.innerText = row.zemax_nickname;
        } else{
          tdLicenseNickname.innerText = '';
        }
        tr.appendChild(tdLicenseNickname);

        let tdLicenseProduct = document.createElement('td');
        tdLicenseProduct.innerText = row['_new_product_value@OData.Community.Display.V1.FormattedValue'];
        tr.appendChild(tdLicenseProduct);

        let tdLicenseType = document.createElement('td');
        if(row['zemax_seattype@OData.Community.Display.V1.FormattedValue'] != undefined){
        tdLicenseType.innerText = row['zemax_seattype@OData.Community.Display.V1.FormattedValue'];
        } else{
          tdLicenseType.innerText = '';
        }
        tr.appendChild(tdLicenseType);

        let tdLicenseSeatCount = document.createElement('td');
        tdLicenseSeatCount.innerText = row.new_usercount;
        tr.appendChild(tdLicenseSeatCount);

        let tdLicenseEndUserCount = document.createElement('td');
        tdLicenseEndUserCount.innerText = row.new_endusercount;
        tr.appendChild(tdLicenseEndUserCount);

        let tdLicenseAdministrator = document.createElement('td');
        tdLicenseAdministrator.innerText = row['_new_registereduser_value@OData.Community.Display.V1.FormattedValue'];
        tr.appendChild(tdLicenseAdministrator);

        tbody.appendChild(tr);
       
      });

      tableElement.appendChild(tbody);

      return tableElement;
  }

  function addTabFeature()
  {
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
  const tabPanel = document.querySelector('#' + tab.getAttribute('aria-controls'));

  tab.addEventListener('click', () => {
    activateTab(tab, tabPanel);
  });

  tab.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activateTab(tab, tabPanel);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const previousTab = tab.previousElementSibling || tabs[tabs.length - 1];
      const previousTabPanel = document.querySelector('#' + previousTab.getAttribute('aria-controls'));
      activateTab(previousTab, previousTabPanel);
      previousTab.focus();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextTab = tab.nextElementSibling || tabs[0];
      const nextTabPanel = document.querySelector('#' + nextTab.getAttribute('aria-controls'));
      activateTab(nextTab, nextTabPanel);
      nextTab.focus();
    }
  });
});

function activateTab(tab, tabPanel) {
  tabs.forEach(tab => {
    tab.setAttribute('aria-selected', 'false');
    tab.classList.remove('active');
  });

  tab.setAttribute('aria-selected', 'true');
  tab.classList.add('active');

  tabContents.forEach(tabContent => {
    tabContent.setAttribute('hidden', '');
    tabContent.setAttribute('aria-hidden', 'true');
  });

  tabPanel.removeAttribute('hidden');
  tabPanel.setAttribute('aria-hidden', 'false');
  tabPanel.focus();
}

  }
}


