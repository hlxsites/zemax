import { getEnvironmentConfig } from '../../scripts/zemax-config.js';
import {
  div,li, ul, h3,p,a
} from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  var userId = localStorage.getItem("auth0_id");
  var accessToken = localStorage.getItem("accessToken");
  var contactid = localStorage.getItem("contactid");
  var userEmail = localStorage.getItem("email");
  var webroles = JSON.parse(localStorage.getItem("webroles"));
  var DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;

  if( userId == null || userId == undefined || accessToken == null || accessToken == undefined){
    window.location.assign(`${window.location.origin}`)
  } else{
    await fetch(DYNAMIC_365_DOMAIN + "zendesk_tickets_by_id?auth0_id="+userId+ "&user_email=" + userEmail + "&zemax_zendeskid=" + contactid, {
      method: "GET",
      headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "bearer " + accessToken
      },
    }).then(async function(response){
      let data = await response.json();

      let allButtonAccess = false;
      let allButtonWebroles = ['Supported Users ZOS', 'Supported Users ZOV', 'Customer Self Service Admin', 'Content Author',
      'Administrators', 'Super Admin', 'Educator'];
      webroles.forEach(function(webrole){
        if(allButtonWebroles.includes(webrole.adx_name)){
          console.log(webrole.adx_name)
          allButtonAccess = true;
          return;
        }
      });

      if(allButtonAccess){
      block.appendChild(
        a({ 
            href: 'https://support.zemax.com/hc/requests/new',
            'aria-label': 'Open a New Ticket',
             class: 'open-ticket button primary',
             'target':'_blank'},
            'Open a New Ticket'
            )
      );

      block.appendChild(
        a({ 
            href: 'https://support.zemax.com/hc/requests/new?scheduled-calls=true',
            'aria-label': 'Schedule a Call',
             class: 'schedule-call button primary',
             'target':'_blank'},
            'Schedule a Call'
            )
      );
     }

      block.appendChild(
        a({ 
            href: 'https://community.zemax.com/ssoproxy/login?ssoType=openidconnect',
            'aria-label': 'Ask the Community',
             class: 'more-info-access button secondary',
             'target':'_blank'},
            'Ask the Community'
            )
      );

      if(data.length >0){
      let tableElement = document.createElement('table');

      let tableHeadingCaseNumber = document.createElement('th');
      tableHeadingCaseNumber.innerHTML = 'Case Number';
      tableElement.appendChild(tableHeadingCaseNumber);

      let tableHeadingCaseTitle = document.createElement('th');
      tableHeadingCaseTitle.innerHTML = 'Case Title';
      tableElement.appendChild(tableHeadingCaseTitle);

      let tableHeadingStatus = document.createElement('th');
      tableHeadingStatus.innerHTML = 'Status';
      tableElement.appendChild(tableHeadingStatus);

      let tableHeadingCreated = document.createElement('th');
      tableHeadingCreated.innerHTML = 'Created';
      tableElement.appendChild(tableHeadingCreated);

      let tableHeadingLastUpdated = document.createElement('th');
      tableHeadingLastUpdated.innerHTML = 'Last Updated';
      tableElement.appendChild(tableHeadingLastUpdated);

      data.forEach(function(ticket){
        let tr = document.createElement('tr');
        let tdCaseNumber = document.createElement('td');
        let caseLink = document.createElement('a');
        caseLink.setAttribute('href', ticket.url);
        var caseIdText = document.createTextNode(ticket.id);
        caseLink.appendChild(caseIdText);
        tdCaseNumber.appendChild(caseLink);
        tr.appendChild(tdCaseNumber);
        

        let tdCaseTitle = document.createElement('td');
        tdCaseTitle.innerText = ticket.raw_subject;
        tr.appendChild(tdCaseTitle);
        

        let tdCaseStatus = document.createElement('td');
        tdCaseStatus.innerText = ticket.status;
        tr.appendChild(tdCaseStatus);
       
        
        const dateString = ticket.created_at;
        const date = new Date(dateString);

        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        let tdCaseCreated = document.createElement('td');
        tdCaseCreated.innerText = formattedDate;
        tr.appendChild(tdCaseCreated);
        

        const dateString1 = ticket.created_at;
        const date1 = new Date(dateString);
        const options1 = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate1 = date1.toLocaleDateString('en-US', options);
        let tdCaseLastUpdated = document.createElement('td');
        tdCaseLastUpdated.innerText = formattedDate1;
        tr.appendChild(tdCaseLastUpdated);
        tableElement.appendChild(tr)
      });
  
      
      block.append(tableElement)
    }else{
      //TODO placeholder
      block.append(p({ class: 'no-tickets' }, 'There are currently no Support Tickets associated with this account.'))
    }
      
     // console.log(data)
     
    }).catch(function(err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
}
}
