# Weather App Frontend

## :star2: About the Project

This is the frontend of the Weather App, a modern weather dashboard built with Next.js, React, and TypeScript. It provides a responsive user interface to search for weather information by city, view current weather conditions, a 3-day forecast, and detailed weather metrics like wind speed and humidity.

## :space_invader: Tech Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS 4
- rippleui
- PostCSS

## :dart: Features

- Search weather by city name
- Display current weather with icon, temperature, and condition
- Toggle temperature units between Celsius and Fahrenheit with localStorage persistence
- Show 3-day weather forecast with daily temperature and icons
- Display wind speed and humidity details
- Responsive and modern UI design

## :key: Environment Variables

To run this project, you may need to add environment variables for API keys if applicable (e.g., weather API key). Check your `.env.local` file for configuration.

## :toolbox: Getting Started

### :bangbang: Prerequisites

- Node.js (version 16 or higher recommended)
- Yarn package manager

Install Yarn globally if you don't have it:

```bash
npm install --global yarn
```

### :gear: Installation

Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

Install dependencies:

```bash
yarn install
```

### :test_tube: Running Tests

Run linting to check code quality:

```bash
yarn lint
```

### :running: Run Locally

Start the development server:

```bash
yarn dev
```

Open http://localhost:3000 in your browser to view the app.

### :triangular_flag_on_post: Deployment

Build the production version:

```bash
yarn build
```

Start the production server:

```bash
yarn start
```

## :eyes: Usage

Use the search bar to enter a city name and view the current weather conditions. Toggle between Celsius and Fahrenheit units. View the 3-day forecast and detailed weather metrics like wind speed and humidity.

## :compass: Roadmap

- [x] Implement city search and current weather display
- [x] Add temperature unit toggle
- [x] Show 3-day weather forecast
- [x] Display wind and humidity details
- [ ] Add user preferences and settings
- [ ] Improve accessibility and internationalization

## :wave: Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## :scroll: Code of Conduct

Please adhere to the [Code of Conduct](https://github.com/vercel/next.js/blob/canary/code-of-conduct.md) when contributing.

## :grey_question: FAQ

**Q:** What weather API does this app use?  
**A:** The app fetches weather data from an external API (check the services/weatherService.ts for details).

**Q:** How do I change the temperature unit?  
**A:** Use the toggle buttons on the UI to switch between Celsius and Fahrenheit.

## :warning: License

This project is licensed under the MIT License.

## :handshake: Contact

Project Maintainer - email@example.com

## :gem: Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [rippleui](https://rippleui.com/)
- [OpenWeather](https://openweathermap.org/)
