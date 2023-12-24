# toggl-to-google-calendar-sync

Simple synchronization from Toggl to Google Calendar. Using Google Script

# How to install and run

1. Create [Google Script project.](https://script.google.com/home/https://script.google.com/home)

2. Paste code from `main.gs` to `App.gs`.

3. Change first variables:

- `TOGGL_API_KEY` — your Toggl API key in profile,
- `CALENDAR_NAME` — your Google Calendar name, default is your gmail,
- `UPDATE_IN_MINUTES` — sync time in minutes.

4. Save project by save button.

5. Select "Install" in list of functions.

6. Click "Run".

Congratilations! Now every `UPDATE_IN_MINUTES` minutes the script will synchronize the time.

# To do

- [ ] Better sync when change Toggl times
- [ ] Add property for remember last success sync time
- [ ] Toggl project tags to description event
- [ ] Toggl project color to event color
