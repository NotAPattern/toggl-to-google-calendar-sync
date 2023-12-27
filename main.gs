/*
 * Simple synchronization from Toggl to Google Calendar. Using Google Script
 * Author: Nikita Karatsev <nikita.karatsev@gmail.com>
 * License: MIT
 */

const TOGGL_API_KEY = ""; // paste your API key from Toggl profile
const CALENDAR_NAME = ""; // paste your Google Calendar name, default is your gmail
const UPDATE_IN_MINUTES = 10; // sync time in minutes

// Don't change this constants
const LAST_SUCCESS_RUN_TIME_KEY = "lastSuccessRunTimeKey";

function Install() {
  // ClearCache();
  ScriptApp.newTrigger("main")
    .timeBased()
    .everyMinutes(UPDATE_IN_MINUTES)
    .create();
}

function main() {
  const togglTimesEntries = getTogglTimesEntries();
  const calendar = getCalendar();
  Logger.log("Times entries and calendar received");

  for (const time of togglTimesEntries) {
    const startTime = new Date(time.start);
    const endTime = time.stop !== null ? new Date(time.stop) : null;

    if (endTime !== null) {
      const existEvents = CalendarApp.getDefaultCalendar().getEvents(
        startTime,
        endTime
      );
      const isExistEvent = existEvents.find(
        (event) => event.getTag("togglId") == time.id
      );
      if (!isExistEvent) {
        const event = calendar.createEvent(
          time.description,
          startTime,
          endTime
        );
        event.setDescription(`Toggl id: ${time.id}`);
        event.setTag("togglId", time.id);
        Logger.log(`Event created: ${event.getTitle()}`);
      }
    }
  }
  // const props = PropertiesService.getUserProperties();
  // const lastSuccessRunTime = getLastSuccessRunTime(props);
  // if(lastSuccessRunTime) {
  // setLastSuccessRunTime(props);
  // } else {
  // Logger.log('Update not need (it\'s not time yet)');
  // }
}

// const getLastSuccessRunTime = (props) => {
//   let lastSuccessRunTime = props.getProperty(LAST_SUCCESS_RUN_TIME_KEY);
//   lastSuccessRunTime = lastSuccessRunTime ? new Date(lastSuccessRunTime) : null;

//   return lastSuccessRunTime;
// };

// const isNeedUpdate = (lastSuccessRunTime) => {

//   return lastSuccessRunTime !== null ? false : true;
// }

// const setLastSuccessRunTime = (props) => {
//   props.setProperty(LAST_SUCCESS_RUN_TIME_KEY, Date.now().toISOString());
// };

const getTogglTimesEntries = () => {
  const togglAuthKey = `${TOGGL_API_KEY}:api_token`;

  const url = "https://api.track.toggl.com/api/v9/me/time_entries";
  const params = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Utilities.base64Encode(togglAuthKey)}`,
    },
  };

  const response = UrlFetchApp.fetch(url, params);

  return JSON.parse(response.getContentText());
};

const getCalendar = () => {
  return CalendarApp.getCalendarsByName(CALENDAR_NAME)[0];
};
