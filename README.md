# WhatsNext

## About

WhatsNext is a mobile-only productivity app for iOS and Android, developed for INFT2051 Mobile App Programming. It aims to help users focus on one task at a time, finish unfinished tasks, and reduce the effort of deciding what to work on next.

## Current Status

**Prototype Development – In Progress**

Task creation, viewing, editing, completion, and deletion are implemented. Events support creation, viewing, editing, deletion, persistent local storage, and local reminders. Tasks and Events persist locally in separate tables within the same SQLite database.

## Current Features

- Dark-mode interface.
- Navigation between Home, Tasks, Create Task, Task Details, and Events screens.
- Create tasks with a required name, Low/Normal/High importance, and optional deadline, estimated duration, and notes.
- Choose optional task deadlines with native date/time pickers; date-only deadlines are also supported.
- View active and completed tasks, open their details, edit them, mark them complete/incomplete, and delete them after confirmation.
- Select available time on Home; **DECIDE FOR ME** currently displays a placeholder message.

- Create, edit, and delete events using native date/time pickers.
- View upcoming events in chronological order and access past events.
- Keep events in SQLite after the app closes or restarts.
- Schedule local event reminders, subject to notification permission; default to 15 minutes before, with preset and custom options.

## In Progress / Planned Features

- **In Progress:** task recommendations and focus timing currently have placeholder buttons only.
- **Planned:** a count-up focus timer that accumulates time invested in each task. Time invested currently remains at `0m`, and tasks start as incomplete.

## Recommendation Concept

The planned recommendation system will use the user's available time to suggest one task, considering:

- Task importance.
- Deadline urgency.
- Optional estimated duration and how well it fits the available time.

Estimated duration will remain optional. Scheduled events serve as reminders and are separate from task recommendations. The recommendation algorithm is not implemented yet.

## Technology

- React Native
- JavaScript
- Expo SDK 57
- Expo Go
- Expo Router
- Expo SQLite and Expo Notifications
- Community DateTimePicker

## Running the Project

1. Clone or download the repository and open a terminal in the project directory.
2. Install dependencies:

   ```sh
   npm install
   ```

3. Start Expo:

   ```sh
   npx expo start
   ```

4. Open the project in Expo Go on an iOS or Android device using the displayed QR code. Use an Expo Go version compatible with SDK 57 and connect the device and computer to the same Wi-Fi network.

The project is intended to remain compatible with Expo Go and does not require a development build, Android Studio, or Xcode.

## Project Structure

- `src/app/`: screens and Expo Router navigation.
- `src/components/`: shared interface components and styles.
- `src/context/`: shared task and event state.
- `src/services/`: shared SQLite database, task/event queries, and event reminders.
- `src/utils/`: input validation and date/time helpers.


## Development Notes

This repository represents an in-progress prototype. Additional functionality will be developed during later course stages. The current implementation demonstrates task creation, event management, local storage, local notifications, and navigation; planned functionality should not be treated as complete.
