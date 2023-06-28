/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable quote-props */
export function getEnvironmentConfig(environment) {
  const envData = {
    dev: {
      profile: {
        dynamic365domain: 'https://zemaxportal.azurewebsites.net/api/',
      },
    },
    prod: {
      profile: {
        dynamic365domain: 'https://zemaxportalfunctions.azurewebsites.net/api/',
      },
    },
  };
  return envData[environment];
}

export function getLocaleConfig(locale, blockName) {
  const config = {
    "en_us": {
      "userWebroles": {
        "roleHeadingDescription": {
          "Temp Supported Users": {
            "heading": "You have temporary supported access",
            "description": "This means you have full access to our Knowledgebase articles and Zemax community forums for a limited time only. You can discuss options for longer term supported access with your account manager."
          },
          "Supported Users ZOS": {
            "heading": "You are an End User of a supported OpticStudio license",
            "description": "This means you have full access to OpticStudio Knowledgebase articles, Zemax community forums, and can open new tickets against your supported OpticStudio licenses."
          },
          "Supported Users ZOV": {
            "heading": "You are an End User of a supported OpticsViewer license",
            "description": "This means you have full access to the Zemax community forums and all OpticsViewer Knowledgebase articles."
          },
          "Customer Self Service Admin": {
            "heading": "You are a License Administrator",
            "description": "This means you can add new colleagues to your account, you can deactivate the records of former colleagues, you can see which licenses are in use and add or remove colleagues as End Users of licenses. You may create new tickets against any of your supported licenses."
          },
          "Content Author": {
            "heading": "Content Author",
            "description": ""
          },
          "Administrators": {
            "heading": "Administrators",
            "description": ""
          },
          "Super Admin": {
            "heading": "You are a Super Administrator",
            "description": "This means you can manage all Users and licenses within your organization."
          },
          "Educator": {
            "heading": "You are an Educator",
            "description": "This means you can view students at your institution."
          },
          "Student Supported Access": {
            "heading": "You are a student with a Global Academic Program License",
            "description": "This means you have full access to our Knowledgebase articles and may participate in the Zemax community forums, but you may not use your Global Academic Program license to raise support tickets with our engineers. If you need help with our software, you should speak to your tutor or ask the Zemax community."
          },
          "Unsupported": {
            "heading": "You are unsupported",
            "description": "This means you have limited access to our Knowledgebase articles and Zemax community forums and will not be able to open new tickets. To become a supported customer, you must either extend the support contract or subscription period of a license for which you are the License Administrator or End User or you need to be added as an End User of an existing supported license."
          }
        },
        "moreInformationAboutAccessButtonText": "More information about access"
      },
      "userTickets": {
        "tableHeadings": ["Case Number", "Case Title", "Status", "Created", "Last Updated"],
        "noTicketDescription": "There are currently no Support Tickets associated with this account.",
        "openANewTicketButtonText": "Open a New Ticket",
        "scheduleACallButtonText": "Schedule a Call",
        "askCommunityButtonText": "Ask the Community"
      },
      "userInfo": {
        "forumProfileActivityButtonText": "Forum Profile & Activity"
      },
      "userLicenses": {
        "tableHeadings": ["", "Status", 'Support Expiry', 'License #', 'Nickname', 'Product', 'License Type', 'Seat Count', 'End User Count', 'Administrator'],
        "allLicenseTabHeadingMapping": ["My Licenses (Admin)", "My Licenses (End User)", "Company Licenses", "Academic Licenses", "Academic ESP Licenses"]
      }
    },
    "ja_jp": {
      "userWebroles": {
        "roleHeadingDescription": {
          "Temp Supported Users": {
            "heading": "一時的にサポートされているアクセスがあります",
            "description": "これは、限られた時間だけ、ナレッジベースの記事と Zemax コミュニティ フォーラムに完全にアクセスできることを意味します。 長期サポート アクセスのオプションについては、アカウント マネージャーと話し合うことができます。"
          },
          "Supported Users ZOS": {
            "heading": "You are an End User of a supported OpticStudio license",
            "description": "This means you have full access to OpticStudio Knowledgebase articles, Zemax community forums, and can open new tickets against your supported OpticStudio licenses."
          },
          "Supported Users ZOV": {
            "heading": "You are an End User of a supported OpticsViewer license",
            "description": "This means you have full access to the Zemax community forums and all OpticsViewer Knowledgebase articles."
          },
          "Customer Self Service Admin": {
            "heading": "You are a License Administrator",
            "description": "This means you can add new colleagues to your account, you can deactivate the records of former colleagues, you can see which licenses are in use and add or remove colleagues as End Users of licenses. You may create new tickets against any of your supported licenses."
          },
          "Content Author": {
            "heading": "Content Author",
            "description": ""
          },
          "Administrators": {
            "heading": "Administrators",
            "description": ""
          },
          "Super Admin": {
            "heading": "You are a Super Administrator",
            "description": "This means you can manage all Users and licenses within your organization."
          },
          "Educator": {
            "heading": "あなたは教育者です",
            "description": "これは、あなたの教育機関の学生を表示できることを意味します。"
          },
          "Student Supported Access": {
            "heading": "You are a student with a Global Academic Program License",
            "description": "This means you have full access to our Knowledgebase articles and may participate in the Zemax community forums, but you may not use your Global Academic Program license to raise support tickets with our engineers. If you need help with our software, you should speak to your tutor or ask the Zemax community."
          },
          "Unsupported": {
            "heading": "You are unsupported",
            "description": "This means you have limited access to our Knowledgebase articles and Zemax community forums and will not be able to open new tickets. To become a supported customer, you must either extend the support contract or subscription period of a license for which you are the License Administrator or End User or you need to be added as an End User of an existing supported license."
          }
        },
        "moreInformationAboutAccessButtonText": "アクセスの詳細"
      },
      "userTickets": {
        "tableHeadings": ['Case Number', 'Case Title', 'Status', 'Created', 'Last Updated'],
        "noTicketDescription": "There are currently no Support Tickets associated with this account.",
        "openANewTicketButtonText": "Open a New Ticket",
        "scheduleACallButtonText": "Schedule a Call",
        "askCommunityButtonText": "Ask the Community"
      },
      "userInfo": {
        "forumProfileActivityButtonText": "Forum Profile & Activity"
      }
    }
  };
  if (blockName === '') {
    return config[locale];
  }
  return config[locale][blockName];
}
