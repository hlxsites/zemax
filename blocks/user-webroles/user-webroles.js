import getEnvironmentConfig from '../../scripts/zemax-config.js';
import {
  li, ul, h3, p, a,
} from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  // TODO move to placeholder
  const dataMapping = {
    'Temp Supported Users': {
      heading: 'You have temporary supported access',
      description:
        'This means you have full access to our Knowledgebase articles and Zemax community forums for a limited time only. You can discuss options for longer term supported access with your account manager.',
    },
    'Supported Users ZOS': {
      heading: 'You are an End User of a supported OpticStudio license',
      description:
        'This means you have full access to OpticStudio Knowledgebase articles, Zemax community forums, and can open new tickets against your supported OpticStudio licenses.',
    },

    'Supported Users ZOV': {
      heading: 'You are an End User of a supported OpticsViewer license',
      description: 'This means you have full access to the Zemax community forums and all OpticsViewer Knowledgebase articles.',
    },

    'Customer Self Service Admin': {
      heading: 'You are a License Administrator',
      description:
        'This means you can add new colleagues to your account, you can deactivate the records of former colleagues, you can see which licenses are in use and add or remove colleagues as End Users of licenses. You may create new tickets against any of your supported licenses.',
    },

    'Content Author': {
      heading: 'Content Author',
      description: '',
    },

    Administrators: {
      heading: 'Administrators',
      description: '',
    },
    'Super Admin': {
      heading: 'You are a Super Administrator',
      description: 'This means you can manage all Users and licenses within your organization.',
    },
    Educator: {
      heading: 'You are an Educator',
      description: 'This means you can view students at your institution.',
    },
    'Student Supported Access': {
      heading: 'You are a student with a Global Academic Program License',
      description:
        'This means you have full access to our Knowledgebase articles and may participate in the Zemax community forums, but you may not use your Global Academic Program license to raise support tickets with our engineers. If you need help with our software, you should speak to your tutor or ask the Zemax community.',
    },
    Unsupported: {
      heading: 'You are unsupported',
      description:
        'This means you have limited access to our Knowledgebase articles and Zemax community forums and will not be able to open new tickets. To become a supported customer, you must either extend the support contract or subscription period of a license for which you are the License Administrator or End User or you need to be added as an End User of an existing supported license.',
    },
  };

  const userId = localStorage.getItem('auth0_id');
  const accessToken = localStorage.getItem('accessToken');
  const DYNAMIC_365_DOMAIN = getEnvironmentConfig('dev').profile.dynamic365domain;

  if (userId == null || userId === undefined || accessToken == null || accessToken === undefined) {
    window.location.assign(`${window.location.origin}`);
  } else {
    await fetch(`${DYNAMIC_365_DOMAIN}dynamics_get_webrole?auth0_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `bearer ${accessToken}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();
        const { webroles } = data;

        // TODO handle cases where there is no response on webroles
        if (localStorage.getItem('contactid') === null || localStorage.getItem('contactid') === undefined) {
          localStorage.setItem('contactid', data.zemax_zendeskid);
        }
        if (webroles !== undefined) {
          localStorage.setItem('webroles', JSON.stringify(webroles));
        }

        block.appendChild(
          ul(
            { class: 'webroles-container' },
            ...webroles.map((webrole) => li(
              { class: 'webrole' },
              h3(dataMapping[webrole.adx_name].heading),
              p({ class: 'webrole-description' }, dataMapping[webrole.adx_name].description),
            )),
          ),
        );

        block.appendChild(
          a(
            {
              href: 'https://support.zemax.com/hc/en-us/sections/1500001481281',
              'aria-label': 'More information about access',
              class: 'more-info-access',
              target: '_blank',
            },
            'More information about access',
          ),
        );
      })
      .catch((err) => {
        // There was an error
        console.warn('Something went wrong.', err);
      });
  }
}
