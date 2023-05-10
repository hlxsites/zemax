import { getEnvironmentConfig } from '../../scripts/zemax-config.js';
import { createTag } from '../../scripts/scripts.js';

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
      let tabDiv = createTag('div', {class: 'tabs'});
      let tabListUl = createTag('ul', {class: 'tabs-nav', role:'tablist'});


      //Render tab headings
      licenseTableHeadingMapping.forEach(function(heading, index){
        if(index === 0){
          tabListUl.append(createTabLi('active', `tab${index + 1}`, 'false', heading.split('|')[0]));
        }else{
          tabListUl.append(createTabLi('', `tab${index + 1}`, 'true', heading.split('|')[0]));
        }
      });

      tabDiv.appendChild(tabListUl);
      //Render tab content
      licenseTableHeadingMapping.forEach(function(heading, index){
        if(index === 0){
          tabDiv.append(createContentDiv(`tab${index + 1}`, `tab${index + 1}`, false, createLicencesTable(data[heading.split('|')[1]]).outerHTML));
        } else{
          tabDiv.append(createContentDiv(`tab${index + 1}`, `tab${index + 1}`, true, createLicencesTable(data[heading.split('|')[1]]).outerHTML));
        }
      });
      
      block.append(tabDiv);
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

  function createTabLi(active, ariaControls, isSelected, tabText){
      let li = document.createElement('li');

      let tabLink = createTag('a', {href: `#${ariaControls}` , class:`tab-link ${active}`, role:'tab', 'aria-selected':isSelected, 'aria-controls':ariaControls},tabText );
      li.appendChild(tabLink)

      return li;
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

      let tableHeadings = ['','Status', 'Support Expiry', 'License #', 'Nickname', 'Product', 'License Type', 'Seat Count'
      ,'End User Count', 'Administrator'];

      tableHeadings.forEach((tableHeading) => {
          let tableHeadingElement = document.createElement('th');
          let button = document.createElement('button');
          button.innerHTML = tableHeading;
          tableHeadingElement.appendChild(button);
          tr.appendChild(tableHeadingElement);
      });

      thead.appendChild(tr);
      tableElement.appendChild(thead);

      let tbody = document.createElement('tbody');
      rows.forEach(function(row){
        let tr = document.createElement('tr');

        //TODO add logic for manage or view
        let tdManageOrView = document.createElement('td');
        let manageOrViewButton = document.createElement('button');
        manageOrViewButton.classList.add('manage-view-license');
        manageOrViewButton.innerText = 'Manage';
        manageOrViewButton.setAttribute('type', 'button');
        tdManageOrView.appendChild(manageOrViewButton);
        tr.appendChild(tdManageOrView);

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

        let headingValueMapping = [licenseActive, supportExpiryDate, row.new_licenseid, row.zemax_nickname, 
          row['_new_product_value@OData.Community.Display.V1.FormattedValue'], 
          row['zemax_seattype@OData.Community.Display.V1.FormattedValue'], row.new_usercount, row.new_endusercount,
          row['_new_registereduser_value@OData.Community.Display.V1.FormattedValue']
        ];

        headingValueMapping.forEach((headingValue)=>{
          let td = document.createElement('td');
          td.innerText = (headingValue != undefined) ? headingValue : '';
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
        
      });

      tableElement.appendChild(tbody);
      return tableElement;
  }

  function addTabFeature()
  {
// Get all tab links and tab content elements
const tabLinks = document.querySelectorAll('.tab-link');

// Handle click event for each tab link
tabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Get the ID of the clicked tab link
    const tabId = link.getAttribute('href').substring(1);

    activateTab(tabId);
  });

  // Handle keydown event for each tab link
  link.addEventListener('keydown', (e) => {
    let index = Array.from(tabLinks).indexOf(e.target);

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        index = index > 0 ? index - 1 : tabLinks.length - 1;
        tabLinks[index].focus();
        break;
      case 'ArrowRight':
        e.preventDefault();
        index = index < tabLinks.length - 1 ? index + 1 : 0;
        tabLinks[index].focus();
        break;
      case 'Home':
        e.preventDefault();
        tabLinks[0].focus();
        break;
      case 'End':
        e.preventDefault();
        tabLinks[tabLinks.length - 1].focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        activateTab(e.target.getAttribute('href').substring(1));
        break;
    }
  });
});

  }
 

// Activate a tab by ID
function activateTab(tabId) {

const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

  tabLinks.forEach(link => {
    link.classList.remove('active');
    link.setAttribute('aria-selected', 'false');
    link.setAttribute('tabindex', '-1');
  });

  // Hide all tab content elements
  tabContents.forEach(content => {
    content.classList.remove('active');
    content.classList.remove('show');
    content.setAttribute('aria-hidden', 'true');
    content.setAttribute('hidden', '');
    debugger;
  });

  // Activate the selected tab link
  const tabLink = document.querySelector(`.tab-link[href="#${tabId}"]`);
  tabLink.classList.add('active');
  tabLink.setAttribute('aria-selected', 'true');
  tabLink.setAttribute('tabindex', '0');

  // Show the associated tab content element
  const tabContent = document.getElementById(tabId);
  tabContent.classList.add('active');
  tabContent.classList.add('show');
  tabContent.setAttribute('aria-hidden', 'false');
}
}


