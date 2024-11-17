<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<body>
  <h1>Lobodent Dental Clinic Online Appointment</h1>
  <p>The <strong>Lobodent Dental Clinic Online Appointment System</strong> is a web application that enables patients to book, reschedule, and manage their dental appointments online. It streamlines the clinic's scheduling process, improves patient experience, and reduces administrative overhead.</p>

  <h2>Features</h2>
  <ul>
    <li><strong>Patient Portal</strong>
      <ul>
        <li>Book new appointments by selecting available dates and time slots.</li>
        <li>View and manage existing appointments.</li>
        <li>Receive appointment confirmation and reminders.</li>
      </ul>
    </li>
    <li><strong>Admin Dashboard</strong>
      <ul>
        <li>View all appointments by date and status.</li>
        <li>Manage clinic schedules and available time slots.</li>
        <li>Reschedule or cancel appointments.</li>
      </ul>
    </li>
    <li><strong>Real-time Updates</strong>
      <ul>
        <li>Automatic synchronization of appointment data.</li>
        <li>Live availability of time slots.</li>
      </ul>
    </li>
   
  </ul>

  <h2>Tech Stack</h2>
  <ul>
    <li><strong>Frontend:</strong> Next.js, TypeScript, Zustand (state management)</li>
    <li><strong>Backend:</strong> Supabase (Database and API)</li>
    <li><strong>Libraries:</strong>
      <ul>
        <li>SWR for client-side data fetching</li>
        <li>Moment.js for date formatting</li>
        <li>Shadcn components for UI (Radix UI, React Hook Form)</li>
      </ul>
    </li>
  </ul>

  <h2>Installation</h2>
  <h3>Prerequisites</h3>
  <ul>
    <li>Node.js (>= 16.x)</li>
    <li>npm or yarn</li>
    <li>Supabase account</li>
  </ul>

  <h3>Steps</h3>
  <ol>
    <li>Clone the repository:
      <pre>git clone https://github.com/mikkouson/Dental-Clinic-Appointment-Landing-Page.git</pre>
    </li>
    <li>Install dependencies:
      <pre>npm install
# or
yarn install</pre>
    </li>
    <li>Set up environment variables:
      <pre>Create a .env.local file with the following:
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</pre>
    </li>
    <li>Run the application:
      <pre>npm run dev
# or
yarn dev</pre>
    </li>
    <li>Access the application at <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.</li>
  </ol>

  <h2>Usage</h2>
  <h3>Patient Portal</h3>
  <ol>
    <li>Select a date from the calendar.</li>
    <li>Choose an available time slot for the desired service.</li>
    <li>Enter patient details and confirm the appointment.</li>
  </ol>

  <h3>Admin Dashboard</h3>
  <ol>
    <li>Log in to access the dashboard.</li>
    <li>View appointments for a selected date.</li>
    <li>Reschedule, cancel, or modify appointment details as needed.</li>
  </ol>

  <h2>Contributing</h2>
  <p>Contributions are welcome!</p>
  <ul>
    <li>Fork the repository and create a feature branch.</li>
    <li>Submit a pull request with detailed information about your changes.</li>
  </ul>

</body>
</html>
