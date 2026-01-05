# Sprint Sync - FYP Contribution Log

A comprehensive React-based project management and team collaboration platform designed for tracking Final Year Project (FYP) contributions, sprint progress, and team engagement metrics.

## 🌟 Features

### Project Management
- **Create and manage projects** with detailed descriptions, timelines, and status tracking
- **Role-based access control** with Admin, Overseer, Leader, Contributor, and Viewer roles
- **Project joining system** for team collaboration
- **Project overview dashboard** showing all relevant project information

### Sprint Management
- **Sprint creation and tracking** with defined start and end dates
- **Sprint-based project organization** for agile development methodologies
- **Real-time sprint progress monitoring**

### Team Collaboration
- **Team member management** with role assignments
- **User authentication and authorization** system
- **Team communication tools** and contact management
- **Multi-user workspace** support

### Progress Tracking & Analytics
- **Attendance tracking** for team meetings and sprints
- **Task completion monitoring** with detailed descriptions
- **Engagement metrics** with visual score indicators
- **Performance analytics** and reporting dashboards
- **Data visualization** using charts and tables

### Logging System
- **Detailed project logs** with categorized log types
- **Log creation, editing, and deletion** capabilities
- **Task descriptions** and progress documentation
- **Log history** and audit trails

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Main UI framework
- **React Router DOM 6.27.0** - Client-side routing
- **Material-UI (MUI) 6.4.5** - UI component library
- **Emotion** - CSS-in-JS styling
- **Recharts 2.15.3** - Data visualization and charting
- **SASS 1.80.5** - Enhanced CSS preprocessing

### Dependencies
- **Roboto Font** - Typography
- **MUI Icons** - Icon system
- **PropTypes** - Type checking

### Development Tools
- **React Scripts 5.0.1** - Build tooling
- **Testing Library** - Unit testing
- **Web Vitals** - Performance monitoring

## 📁 Project Structure

```
src/
├── components/
│   ├── api/                    # API integration layer
│   │   ├── API.js             # Main API client
│   │   ├── apiURL.js          # API configuration
│   │   └── useLoad.js         # Data loading hooks
│   ├── auth/                   # Authentication
│   │   └── useAuth.js         # Authentication hooks
│   ├── entities/               # Business logic components
│   │   ├── projectlogs/       # Sprint and logging features
│   │   ├── projects/          # Project management
│   │   ├── SignIn/            # Authentication forms
│   │   └── users/             # User management
│   ├── layouts/               # Layout components
│   │   ├── Header.js          # Application header
│   │   ├── Footer.js          # Application footer
│   │   ├── Layout.js          # Main layout wrapper
│   │   └── Navbar.js          # Navigation bar
│   ├── pages/                 # Route components
│   │   ├── Home.js            # Landing page
│   │   ├── MyProjects.js      # User projects dashboard
│   │   ├── Projects.js        # All projects view
│   │   ├── ProjectLogs.js     # Sprint logs interface
│   │   ├── Logs.js            # General logs view
│   │   ├── SignIn.js          # Authentication page
│   │   └── UserPage.js        # User profile
│   ├── UI/                    # Reusable UI components
│   │   ├── Actions.js         # Action buttons
│   │   ├── Card.js            # Card components
│   │   ├── Form.js            # Form utilities
│   │   ├── Modal.js           # Modal dialogs
│   │   ├── ObjectTable.js     # Data tables
│   │   └── Panel.js           # Panel layouts
│   ├── UI-Material/           # Material-UI wrappers
│   └── UI-MaterialUINEW/      # Enhanced MUI components
├── context/                   # React Context
│   └── UserContext.js         # User state management
└── utils/                     # Utility functions
    └── ProjectService.js      # Project-related services
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 14 or higher)
- **npm** or **yarn** package manager
- **Backend API server** running on port 5000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FYP-Contribution-Log
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   - Ensure your backend API is running on `http://localhost:5000/api`
   - Update `src/components/api/apiURL.js` if using a different endpoint

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The application will automatically reload when you make changes

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (use with caution)

## 👥 User Roles & Permissions

### Admin
- Full system access
- Can view all projects across the platform
- System-wide administrative privileges

### Overseer
- Project creation and management
- Team member assignment and role management
- Complete project oversight capabilities

### Leader
- Sprint management within assigned projects
- Team coordination and task assignment
- Progress monitoring and reporting

### Contributor
- Task completion and logging
- Attendance marking
- Progress updates and feedback

### Viewer
- Read-only access to project information
- View logs, reports, and team activities
- No editing or administrative capabilities

## 📊 Key Features in Detail

### Sprint Management
- Create sprints with defined timelines
- Track sprint progress and completion
- Manage sprint-specific tasks and logs
- Monitor team engagement per sprint

### Attendance Tracking
- Mark attendance for team meetings
- Track attendance patterns and trends
- Generate attendance reports
- Support for multiple attendance statuses (Present, Late, Excused, Absent)

### Task Completion System
- Assign and track individual tasks
- Monitor completion rates
- Detailed task descriptions and notes
- Progress visualization

### Engagement Metrics
- Comprehensive team performance analytics
- Attendance, task completion, and feedback scores
- Visual score indicators and charts
- Project-wide engagement insights

### Log Management
- Categorized logging system
- Rich text log descriptions
- Log editing and version control
- Search and filter capabilities

## 🔧 Configuration

### API Configuration
The application expects a REST API backend. Configure the API endpoint in:
```javascript
// src/components/api/apiURL.js
export const API_URL = "http://localhost:5000/api";
```

### Required API Endpoints
The application requires the following API endpoints:
- `/users` - User management
- `/projects` - Project CRUD operations
- `/userprojects` - User-project associations
- `/sprints` - Sprint management
- `/logs` - Project logging
- `/attendance` - Attendance tracking
- `/taskcompletions` - Task completion tracking
- `/engagementmetrics` - Analytics and metrics

## 🎨 Theming & Styling

The application uses Material-UI theming with custom SASS styling:
- Theme configuration in `src/components/Styles/Theme.js`
- Global styles in `src/global.scss`
- Component-specific styles in respective `.scss` files
- Color scheme defined in `src/components/Styles/colors.scss`

## 🔐 Authentication

The application includes a complete authentication system:
- User login/logout functionality
- Protected routes based on user roles
- User context management
- Session handling

## 📱 Responsive Design

- Mobile-first responsive design
- Tablet and desktop optimizations
- Material-UI responsive components
- Flexible grid layouts

## 🧪 Testing

The project includes testing setup using:
- Jest testing framework
- React Testing Library
- Component unit tests
- Integration test capabilities

## 🚀 Deployment

### Production Build
```bash
npm run build
```

This creates a `build` folder with optimized production files ready for deployment.

### Deployment Options
- Static hosting (Netlify, Vercel, GitHub Pages)
- Traditional web servers (Apache, Nginx)
- Cloud platforms (AWS S3, Azure, Google Cloud)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of a Final Year Project (FYP) and is intended for educational purposes.

## 📞 Support

For support and questions:
- Check the documentation
- Review existing issues
- Contact the development team

---

**Built for Final Year Project collaboration and management**
