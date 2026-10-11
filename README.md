# WhatsNext

## About

WhatsNext is a mobile-only productivity app for iOS and Android, developed for INFT2051 Mobile App Programming. It aims to help users focus on one task at a time, finish unfinished tasks, and reduce the effort of deciding what to work on next.

## Current Status

**Prototype Development – In Progress**

Task creation and viewing are implemented. Tasks are currently held in memory and are lost when the app reloads or restarts.

## Current Features

- Dark-mode interface.
- Navigation between Home, Tasks, Create Task, Task Details, and an Events placeholder screen.
- Create tasks with a required name, Low/Normal/High importance, and optional deadline, estimated duration, and notes.
- Validate task names, deadline dates (`YYYY-MM-DD`), and estimated durations in whole minutes.
- View created tasks in the active task list and open their details.
- Select available time on Home; **DECIDE FOR ME** currently displays a placeholder message.

## In Progress / Planned Features

- **In Progress:** task recommendations, focus timing, task completion, and editing currently have placeholder buttons only.
- **In Progress:** the Events screen exists, but event creation and scheduled reminders are not implemented.
- **Planned:** task deletion.
- **Planned:** a count-up focus timer that accumulates time invested in each task. Time invested currently remains at `0m`, and tasks start as incomplete.
- **Planned native features:** local persistent storage and local notifications.

## Recommendation Concept

The planned recommendation system will use the user's available time to suggest one task, considering:

- Task importance.
- Deadline urgency.
- Optional estimated duration and how well it fits the available time.

Estimated duration will remain optional. Scheduled events will serve as reminders and will not be included in task recommendations. The recommendation algorithm is not implemented yet.

## Technology

- React Native
- JavaScript
- Expo SDK 57
- Expo Go
- Expo Router

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
- `src/context/`: temporary shared task state.
- `src/utils/`: task input validation.

## Development Notes

This repository represents an in-progress prototype. Additional functionality will be developed during later course stages. The current implementation demonstrates task creation, shared state, and navigation; planned functionality should not be treated as complete.
