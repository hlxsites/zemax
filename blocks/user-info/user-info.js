import { getEnvironmentConfig } from '../../scripts/zemax-config.js';
import { createTag } from '../../scripts/scripts.js';

export default async function decorate(block) {

  var userId = localStorage.getItem("auth0_id");
  var accessToken = localStorage.getItem("accessToken");
  var fullName = localStorage.getItem("fullname");
  var userEmail = localStorage.getItem("email");
  var DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;

  //TODO move to template logic
  if( userId == null || userId == undefined || accessToken == null || accessToken == undefined){
    window.location.assign(`${window.location.origin}`)
  } else{
    await fetch(DYNAMIC_365_DOMAIN + "insided_get_user_link?auth0_id=" + userId, {
      method: "GET",
      headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "bearer " + accessToken
      },
    }).then(async function(response){
      let data = await response.json();

      //Paragraph tag for user's full name
      let pName = createTag('p', { class: 'users-fullname' }, fullName);
      block.append(pName);

      //Paragraph tag for user's email
      let pEmail = createTag('p', { class: 'users-email' }, userEmail);
      block.append(pEmail);

      //Link URL for user's community profile
      let userLink = (data.link == '' || data.link == undefined) ? 'https://community.zemax.com/ssoproxy/setUsernameForm':data.link;


      console.log(userLink)
      // Use placeholder
      let anchor = createTag('a', {class: 'button primary', href: userLink, target: '_blank'}, 'Forum Profile & Activity');
      block.append(anchor);
    }).catch(function(err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
  }
}
